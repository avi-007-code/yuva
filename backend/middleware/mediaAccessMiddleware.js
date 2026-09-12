const { prisma } = require('../config/db');
const { authenticateToken } = require('./authMiddleware');
const { AppError } = require('./errorHandler');

const requireAdminOrEventManager = async (req, res, next) => {
  if (!req.user) {
    let authError;
    authenticateToken(req, res, (error) => { authError = error; });
    if (authError) return next(authError);
  }

  if (req.user.role === 'ADMIN') return next();

  const { eventId } = req.params;
  if (!/^[a-fA-F0-9]{24}$/.test(eventId)) {
    return next(new AppError('Invalid event ID', 400));
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { clubId: true },
    });
    if (!event) return next(new AppError('Event not found', 404));

    const membership = await prisma.membership.findFirst({
      where: {
        userId: req.user.id || req.user.userId,
        clubId: event.clubId,
        role: 'MANAGER',
      },
    });
    if (!membership) {
      return next(new AppError('Access denied: You do not manage this event\'s club', 403));
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireAdminOrEventManager };