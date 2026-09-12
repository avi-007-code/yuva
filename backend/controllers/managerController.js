const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { uploadBuffer, deleteAsset } = require('../utils/cloudinaryUpload');
const { sanitizeUser } = require('../utils/sanitizeUser');

/**
 * GET /manager/my-clubs
 * Returns clubs for which the authenticated user has a MANAGER membership.
 */
exports.getMyClubs = asyncHandler(async (req, res) => {
  const memberships = await prisma.membership.findMany({
    where: {
      userId: req.user.id,
      role: 'MANAGER',
    },
    select: {
      club: {
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          coverImage: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });

  if (memberships.length === 0) {
    throw new AppError('Access denied: Manager membership required', 403);
  }

  res.status(200).json({
    success: true,
    message: 'Fetched managed clubs successfully',
    clubs: memberships.map(({ club }) => club),
  });
});

/**
 * PATCH /manager/clubs/:clubId
 * Updates only manager-editable Club fields after requireClubManager authorizes it.
 */
exports.updateManagedClub = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const allowedFields = ['name', 'description'];
  const body = req.body;

  if (!body || Array.isArray(body) || typeof body !== 'object') {
    throw new AppError('Update data must be an object', 400);
  }

  const receivedFields = Object.keys(body);

  if (receivedFields.length === 0) {
    throw new AppError('At least one field (name or description) is required', 400);
  }

  const unexpectedField = receivedFields.find((field) => !allowedFields.includes(field));
  if (unexpectedField) {
    throw new AppError(`Field '${unexpectedField}' cannot be updated`, 400);
  }

  const updateData = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      throw new AppError('Club name cannot be empty', 400);
    }
    updateData.name = body.name.trim();
  }

  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== 'string') {
      throw new AppError('Club description must be a string or null', 400);
    }
    updateData.description = body.description === null ? null : body.description.trim();
  }

  const club = await prisma.club.update({
    where: { id: clubId },
    data: updateData,
  });

  res.status(200).json({
    success: true,
    message: 'Club updated successfully',
    data: club,
  });
});

/**
 * GET /manager/profile
 * Returns profile details for the authenticated manager.
 */
exports.getManagerProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      memberships: {
        where: { role: 'MANAGER' },
        select: {
          club: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User profile not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...sanitizeUser(user),
      avatar: user.avatar || null,
      managedClubs: user.memberships?.map((m) => m.club) || [],
    },
  });
});

/**
 * PATCH /manager/profile
 * Updates manager's name and/or password.
 */
exports.updateManagerProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updateData = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new AppError('Name cannot be empty', 400);
    }
    updateData.name = name.trim();
  }

  if (newPassword) {
    if (!currentPassword) {
      throw new AppError('Current password is required to set a new password', 400);
    }
    if (!user.password) {
      throw new AppError('Account password is not set', 400);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401);
    }

    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400);
    }

    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(newPassword, salt);
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError('No profile changes provided', 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

/**
 * POST /manager/profile/avatar
 * Uploads profile avatar image to Cloudinary.
 */
exports.uploadManagerAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("An image file is required in the 'avatar' field", 400);
  }

  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.avatar?.publicId) {
    await deleteAsset(user.avatar.publicId);
  }

  const avatar = await uploadBuffer(req.file.buffer, `users/${userId}/avatar`);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Profile picture uploaded successfully',
    data: updatedUser,
  });
});

/**
 * DELETE /manager/profile/avatar
 * Deletes profile picture from Cloudinary and clears user avatar.
 */
exports.deleteManagerAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.avatar?.publicId) {
    await deleteAsset(user.avatar.publicId);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatar: null },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Profile picture removed successfully',
    data: updatedUser,
  });
});
