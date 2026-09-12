const { prisma } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { sanitizeUser } = require('../utils/sanitizeUser');
const crypto = require('crypto');
const { sendManagerPasswordResetOtp } = require('../services/emailService');

const PASSWORD_RESET_OTP_TTL_MS = 10 * 60 * 1000;
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

/**
 * POST /auth/admin/login
 * Admin login endpoint
 */
exports. adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide both email and password', 400);
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if role is ADMIN
  if (user.role !== 'ADMIN') {
    throw new AppError('Access denied: User is not an admin', 403);
  }

  // Check if active
  if (!user.isActive) {
    throw new AppError('Account is inactive. Please contact system administrator.', 403);
  }

  // Check password
  if (!user.password) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_TOKEN;
  const jwtExpiry = process.env.JWT_EXPIRES_IN || '24h';

  const token = jwt.sign(
    {
      id: user.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiry }
  );

  res.status(200).json({
    success: true,
    message: 'Admin login successful',
    token,
    user: sanitizeUser(user),
  });
});

/**
 * POST /auth/manager/login
 * Manager login endpoint - succeeds for any active User with correct password
 */
exports.managerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide both email and password', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.password) {
    throw new AppError('Account setup is not complete. Please accept your invitation first.', 400);
  }

  if (!user.isActive) {
    throw new AppError('Account is inactive. Please accept your invite or contact an admin.', 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_TOKEN;
  const jwtExpiry = process.env.JWT_EXPIRES_IN || '24h';

  const token = jwt.sign(
    {
      id: user.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiry }
  );

  res.status(200).json({
    success: true,
    message: 'Manager login successful',
    token,
    user: sanitizeUser(user),
  });
});

/**
 * POST /auth/manager/forgot-password
 * Sends a password reset OTP to an active manager account.
 */
exports.requestManagerPasswordReset = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      memberships: { where: { role: 'MANAGER' }, select: { id: true }, take: 1 },
    },
  });

  // Keep account existence and manager membership private.
  if (user?.isActive && user.memberships.length > 0) {
    const otp = crypto.randomInt(100000, 1000000).toString();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetOtpHash: hashOtp(otp),
        passwordResetOtpExpiresAt: new Date(Date.now() + PASSWORD_RESET_OTP_TTL_MS),
      },
    });
    await sendManagerPasswordResetOtp(user.email, user.name, otp);
  }

  res.status(200).json({
    success: true,
    message: 'If an active manager account exists for that email, an OTP has been sent.',
  });
});

/**
 * POST /auth/manager/reset-password
 * Verifies the OTP and replaces the manager password.
 */
exports.resetManagerPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      isActive: true,
      passwordResetOtpHash: true,
      passwordResetOtpExpiresAt: true,
      memberships: { where: { role: 'MANAGER' }, select: { id: true }, take: 1 },
    },
  });

  if (
    !user ||
    !user.isActive ||
    user.memberships.length === 0 ||
    !user.passwordResetOtpHash ||
    !user.passwordResetOtpExpiresAt ||
    new Date(user.passwordResetOtpExpiresAt) < new Date() ||
    hashOtp(otp) !== user.passwordResetOtpHash
  ) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetOtpHash: null,
      passwordResetOtpExpiresAt: null,
    },
  });

  res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
});

/**
 * POST /auth/admin/register (Optional utility helper for seed / setup)
 */
exports.adminRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Admin registered successfully',
    user: sanitizeUser(newUser),
  });
});
