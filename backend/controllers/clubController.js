const { prisma } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

// Fields that may be shown to unauthenticated visitors. Keep user and
// membership relations out of public responses.
const publicClubFields = {
  id: true,
  name: true,
  description: true,
  logo: true,
  coverImage: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * GET /clubs
 * Returns the public directory of clubs.
 */
exports.listPublicClubs = asyncHandler(async (req, res) => {
  const clubs = await prisma.club.findMany({
    select: publicClubFields,
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    clubs,
  });
});

/**
 * GET /clubs/:clubId
 * Returns public information for one club.
 */
exports.getPublicClub = asyncHandler(async (req, res) => {
  const { clubId } = req.params;

  // Prisma's MongoDB connector expects ObjectId values for this field.
  if (!/^[a-fA-F0-9]{24}$/.test(clubId)) {
    throw new AppError('Invalid club ID', 400);
  }

  const club = await prisma.club.findUnique({
    where: { id: clubId },
    select: publicClubFields,
  });

  if (!club) {
    throw new AppError('Club not found', 404);
  }

  res.status(200).json({
    success: true,
    club,
  });
});
