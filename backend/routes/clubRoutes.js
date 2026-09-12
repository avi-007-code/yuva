const express = require('express');
const router = express.Router();
const { authenticateToken, requireClubManager } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const { prisma } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const { validate } = require('../middleware/validate');
const { clubParams } = require('../validators/schemas');

/**
 * Example Club Manager Protected Route
 * GET /club/:clubId/dashboard
 */
router.get(
  '/:clubId/dashboard',
  validate({ params: clubParams }),
  authenticateToken,
  requireClubManager('clubId'),
  asyncHandler(async (req, res) => {
    const { clubId } = req.params;
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
      },
    });

    if (!club) {
      throw new AppError('Club not found', 404);
    }

    res.status(200).json({
      success: true,
      message: `Club manager dashboard access granted for club ${clubId}`,
      data: club,
    });
  })
);

module.exports = router;
