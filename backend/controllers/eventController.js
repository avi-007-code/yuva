const { prisma } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { deleteAssetsBestEffort } = require('../utils/cloudinaryUpload');

const objectIdPattern = /^[a-fA-F0-9]{24}$/;
const eventStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

const publicEventFields = {
  id: true,
  clubId: true,
  title: true,
  description: true,
  location: true,
  startAt: true,
  endAt: true,
  status: true,
  coverImage: true,
  gallery: true,
  registrationUrl: true,
  createdAt: true,
  updatedAt: true,
};

const validateObjectId = (value, label) => {
  if (!objectIdPattern.test(value)) throw new AppError(`Invalid ${label}`, 400);
};

const requiredText = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`${label} is required and cannot be empty`, 400);
  }
  return value.trim();
};

const validDate = (value, label) => {
  if (typeof value !== 'string' && !(value instanceof Date)) {
    throw new AppError(`${label} must be a valid date`, 400);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new AppError(`${label} must be a valid date`, 400);
  return date;
};

const validDateRange = (startAt, endAt) => {
  if (endAt <= startAt) throw new AppError('endAt must be after startAt', 400);
};

const ensureClubExists = async (clubId) => {
  validateObjectId(clubId, 'club ID');
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: { id: true, name: true, description: true },
  });
  if (!club) throw new AppError('Club not found', 404);
  return club;
};

// Checks the event independently of URL values, preventing cross-club access.
const getEventForClub = async (clubId, eventId) => {
  validateObjectId(eventId, 'event ID');
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: publicEventFields,
  });
  if (!event) throw new AppError('Event not found', 404);
  if (event.clubId !== clubId) throw new AppError('Event does not belong to this club', 404);
  return event;
};

exports.createEvent = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const body = req.body;
  if (!body || Array.isArray(body) || typeof body !== 'object') {
    throw new AppError('Event data must be an object', 400);
  }

  const startAt = validDate(body.startAt, 'startAt');
  const endAt = body.endAt == null ? null : validDate(body.endAt, 'endAt');
  if (endAt) validDateRange(startAt, endAt);

  const event = await prisma.event.create({
    data: {
      clubId,
      title: requiredText(body.title, 'title'),
      description: requiredText(body.description, 'description'),
      location: requiredText(body.location, 'location'),
      startAt,
      endAt,
      status: 'UPCOMING',
      registrationUrl: body.registrationUrl ? body.registrationUrl.trim() : null,
    },
    select: publicEventFields,
  });

  res.status(201).json({ success: true, message: 'Event created successfully', event });
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const { clubId, eventId } = req.params;
  const body = req.body;
  if (!body || Array.isArray(body) || typeof body !== 'object') {
    throw new AppError('Update data must be an object', 400);
  }

  const allowedFields = ['title', 'description', 'location', 'startAt', 'endAt', 'status', 'registrationUrl'];
  const fields = Object.keys(body);
  if (!fields.length) throw new AppError('At least one event field is required', 400);
  const unexpected = fields.find((field) => !allowedFields.includes(field));
  if (unexpected) throw new AppError(`Field '${unexpected}' cannot be updated`, 400);

  const event = await getEventForClub(clubId, eventId);
  const data = {};
  ['title', 'description', 'location'].forEach((field) => {
    if (body[field] !== undefined) data[field] = requiredText(body[field], field);
  });
  if (body.status !== undefined) {
    if (typeof body.status !== 'string' || !eventStatuses.includes(body.status)) {
      throw new AppError(`status must be one of: ${eventStatuses.join(', ')}`, 400);
    }
    data.status = body.status;
  }
  if (body.registrationUrl !== undefined) {
    data.registrationUrl = body.registrationUrl ? body.registrationUrl.trim() : null;
  }

  const startAt = body.startAt === undefined ? event.startAt : validDate(body.startAt, 'startAt');
  const endAt = body.endAt === undefined
    ? event.endAt
    : body.endAt === null
      ? null
      : validDate(body.endAt, 'endAt');
  if (body.startAt !== undefined || body.endAt !== undefined) {
    if (endAt) validDateRange(startAt, endAt);
    data.startAt = startAt;
    data.endAt = endAt;
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId }, data, select: publicEventFields,
  });
  res.status(200).json({ success: true, message: 'Event updated successfully', event: updatedEvent });
});

exports.cancelEvent = asyncHandler(async (req, res) => {
  const { clubId, eventId } = req.params;
  await getEventForClub(clubId, eventId);
  const event = await prisma.event.update({
    where: { id: eventId }, data: { status: 'CANCELLED' }, select: publicEventFields,
  });
  res.status(200).json({ success: true, message: 'Event cancelled successfully', event });
});

exports.listManagedClubEvents = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const events = await prisma.event.findMany({
    where: { clubId },
    select: publicEventFields,
    orderBy: { startAt: 'desc' },
  });
  res.status(200).json({ success: true, events });
});

/**
 * DELETE /admin/events/:eventId
 * Admins and managers of the event's club are authorized by the route middleware.
 */
exports.deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    throw new AppError('Event not found', 404);
  }

  await deleteAssetsBestEffort(
    [event.coverImage?.publicId, ...(event.gallery || []).map((image) => image.publicId)],
    `event ${eventId}`
  );

  const deletedEvent = await prisma.event.delete({ where: { id: eventId } });
  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
    data: deletedEvent,
  });
});

exports.listUpcomingEvents = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  await ensureClubExists(clubId);
  const events = await prisma.event.findMany({
    where: { clubId, status: { in: ['UPCOMING', 'ONGOING'] } },
    select: publicEventFields, orderBy: { startAt: 'asc' },
  });
  res.status(200).json({ success: true, events });
});

exports.listPastEvents = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  await ensureClubExists(clubId);
  const events = await prisma.event.findMany({
    where: { clubId, status: 'COMPLETED' },
    select: publicEventFields, orderBy: { startAt: 'desc' },
  });
  res.status(200).json({ success: true, events });
});

exports.listAllUpcomingEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: { status: { in: ['UPCOMING', 'ONGOING'] } },
    select: {
      ...publicEventFields,
      club: { select: { id: true, name: true } },
    },
    orderBy: { startAt: 'asc' },
  });
  res.status(200).json({ success: true, events });
});

exports.getPublicEvent = asyncHandler(async (req, res) => {
  const { clubId, eventId } = req.params;
  const club = await ensureClubExists(clubId);
  const event = await getEventForClub(clubId, eventId);
  res.status(200).json({
    success: true,
    event,
    club: { id: club.id, name: club.name, description: club.description },
  });
});
