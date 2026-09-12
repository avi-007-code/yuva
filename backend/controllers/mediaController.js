const { prisma } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { uploadBuffer, deleteAsset } = require('../utils/cloudinaryUpload');

const requireFile = (file, fieldName) => {
  if (!file) throw new AppError(`An image file is required in the '${fieldName}' field`, 400);
};

const decodePublicId = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new AppError('Invalid Cloudinary public ID', 400);
  }
};

const getClub = async (clubId) => {
  const club = await prisma.club.findUnique({ where: { id: clubId } });
  if (!club) throw new AppError('Club not found', 404);
  return club;
};

const getEvent = async (eventId) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

exports.uploadClubLogo = asyncHandler(async (req, res) => {
  requireFile(req.file, 'logo');
  const { clubId } = req.params;
  const club = await getClub(clubId);

  if (club.logo?.publicId) await deleteAsset(club.logo.publicId);
  const logo = await uploadBuffer(req.file.buffer, `clubs/${clubId}/logo`);
  const updatedClub = await prisma.club.update({ where: { id: clubId }, data: { logo } });

  res.status(200).json({ success: true, message: 'Club logo uploaded successfully', club: updatedClub });
});

exports.deleteClubLogo = asyncHandler(async (req, res) => {
  const club = await getClub(req.params.clubId);
  if (club.logo?.publicId) await deleteAsset(club.logo.publicId);

  const updatedClub = await prisma.club.update({
    where: { id: req.params.clubId },
    data: { logo: null },
  });
  res.status(200).json({ success: true, message: 'Club logo deleted successfully', club: updatedClub });
});

exports.uploadClubCover = asyncHandler(async (req, res) => {
  requireFile(req.file, 'cover');
  const { clubId } = req.params;
  const club = await getClub(clubId);

  if (club.coverImage?.publicId) await deleteAsset(club.coverImage.publicId);
  const coverImage = await uploadBuffer(req.file.buffer, `clubs/${clubId}/cover`);
  const updatedClub = await prisma.club.update({ where: { id: clubId }, data: { coverImage } });

  res.status(200).json({ success: true, message: 'Club cover uploaded successfully', club: updatedClub });
});

exports.deleteClubCover = asyncHandler(async (req, res) => {
  const club = await getClub(req.params.clubId);
  if (club.coverImage?.publicId) await deleteAsset(club.coverImage.publicId);

  const updatedClub = await prisma.club.update({
    where: { id: req.params.clubId },
    data: { coverImage: null },
  });
  res.status(200).json({ success: true, message: 'Club cover deleted successfully', club: updatedClub });
});

exports.uploadEventCover = asyncHandler(async (req, res) => {
  requireFile(req.file, 'cover');
  const { eventId } = req.params;
  const event = await getEvent(eventId);

  if (event.coverImage?.publicId) await deleteAsset(event.coverImage.publicId);
  const coverImage = await uploadBuffer(req.file.buffer, `events/${eventId}/cover`);
  const updatedEvent = await prisma.event.update({ where: { id: eventId }, data: { coverImage } });

  res.status(200).json({ success: true, message: 'Event cover uploaded successfully', event: updatedEvent });
});

exports.deleteEventCover = asyncHandler(async (req, res) => {
  const event = await getEvent(req.params.eventId);
  if (event.coverImage?.publicId) await deleteAsset(event.coverImage.publicId);

  const updatedEvent = await prisma.event.update({
    where: { id: req.params.eventId },
    data: { coverImage: null },
  });
  res.status(200).json({ success: true, message: 'Event cover deleted successfully', event: updatedEvent });
});

exports.uploadEventGallery = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new AppError("At least one image is required in the 'images' field", 400);
  const { eventId } = req.params;
  const event = await getEvent(eventId);
  const images = await Promise.all(
    req.files.map((file) => uploadBuffer(file.buffer, `events/${eventId}/gallery`))
  );
  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: { gallery: { set: [...(event.gallery || []), ...images] } },
  });

  res.status(200).json({ success: true, message: 'Event gallery images uploaded successfully', event: updatedEvent });
});

exports.deleteEventGalleryImage = asyncHandler(async (req, res) => {
  const event = await getEvent(req.params.eventId);
  const publicId = decodePublicId(req.params.publicId);
  const imageExists = (event.gallery || []).some((image) => image.publicId === publicId);
  if (!imageExists) throw new AppError('Gallery image not found', 404);

  await deleteAsset(publicId);
  const updatedEvent = await prisma.event.update({
    where: { id: req.params.eventId },
    data: { gallery: { set: event.gallery.filter((image) => image.publicId !== publicId) } },
  });
  res.status(200).json({ success: true, message: 'Event gallery image deleted successfully', event: updatedEvent });
});