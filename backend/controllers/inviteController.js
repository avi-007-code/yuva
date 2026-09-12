const { prisma } = require('../config/db');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { sanitizeUser } = require('../utils/sanitizeUser');

/**
 * GET /invite/:token/validate
 * Public route to validate invitation token expiry and active status
 */
exports.validateInvite = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new AppError('Invite token is required', 400);
  }

  const user = await prisma.user.findFirst({
    where: { inviteToken: token },
  });

  if (!user) {
    return res.status(200).json({ success: true, message: 'Invitation validation completed', data: { valid: false } });
  }

  if (user.isActive) {
    return res.status(200).json({ success: true, message: 'Invitation validation completed', data: { valid: false } });
  }

  if (!user.inviteExpiresAt || new Date(user.inviteExpiresAt) < new Date()) {
    return res.status(200).json({ success: true, message: 'Invitation validation completed', data: { valid: false } });
  }

  res.status(200).json({
    success: true,
    message: 'Invitation validation completed',
    data: {
      valid: true,
      user: {
      id: user.id,
      name: user.name,
      email: user.email,
      },
    },
  });
});

/**
 * POST /invite/:token/accept
 * Public route to accept invitation and set password
 */
exports.acceptInvite = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.trim().length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400);
  }

  const user = await prisma.user.findFirst({
    where: { inviteToken: token },
  });

  if (!user) {
    throw new AppError('Invalid invitation token', 400);
  }

  if (user.isActive) {
    throw new AppError('Invitation has already been accepted', 400);
  }

  if (!user.inviteExpiresAt || new Date(user.inviteExpiresAt) < new Date()) {
    throw new AppError('Invitation token has expired. Please ask an admin to resend your invite.', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      isActive: true,
      inviteToken: null,
      inviteExpiresAt: null,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Invitation accepted successfully. You can now log in.',
    user: sanitizeUser(updatedUser),
  });
});
