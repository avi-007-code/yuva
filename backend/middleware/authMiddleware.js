const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { AppError } = require('./errorHandler');

/**
 * Verifies JWT token and attaches user payload to req.user
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRET_TOKEN;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // Standardize user object shape in req.user
    req.user = {
      ...decoded,
      id: decoded.id || decoded.userId,
      userId: decoded.userId || decoded.id,
    };
    next();
  } catch (error) {
    return next(new AppError('Invalid authentication token', 401));
  }
};

/**
 * Middleware requiring user to have GlobalRole ADMIN
 */
const requireAdmin = (req, res, next) => {
  // Ensure user is authenticated first
  if (!req.user) {
    return authenticateToken(req, res, (err) => {
      if (err) return next(err);
      checkAdminRole(req, res, next);
    });
  }
  checkAdminRole(req, res, next);
};

const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(new AppError('Access denied', 403));
  }
  next();
};

/**
 * Middleware requiring the authenticated user to be a MANAGER of the specified club.
 * Extracts clubId from req.params.clubId (or req.params.id / custom paramName).
 */
const requireClubManager = (paramName = 'clubId') => {
  return async (req, res, next) => {
    // 1. Authenticate token if req.user is not yet populated
    if (!req.user) {
      let authErr = null;
      authenticateToken(req, res, (err) => {
        authErr = err;
      });
      if (authErr) return next(authErr);
    }

    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // 2. Extract clubId from params
    const clubId = req.params[paramName] || req.params.clubId || req.params.id;
    if (!clubId) {
      return next(new AppError(`Club ID parameter '${paramName}' missing in route`, 400));
    }

    // 3. Validate MongoDB ObjectIds before sending them to Prisma.
    if (!/^[a-fA-F0-9]{24}$/.test(clubId)) {
      return next(new AppError('Invalid club ID', 400));
    }

    // 4. Check that the requested club exists, then verify a manager membership.
    try {
      const club = await prisma.club.findUnique({
        where: { id: clubId },
        select: { id: true },
      });

      if (!club) {
        return next(new AppError('Club not found', 404));
      }

      const userId = req.user.id || req.user.userId;
      const membership = await prisma.membership.findFirst({
        where: {
          userId: userId,
          clubId: clubId,
          role: 'MANAGER',
        },
      });

      if (!membership) {
        return next(
          new AppError('Access denied: You do not have manager permissions for this club', 403)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const requireAdminOrClubManager = (paramName = 'clubId') => {
  return (req, res, next) => {
    if (!req.user) {
      return authenticateToken(req, res, (err) => {
        if (err) return next(err);
        checkAdminOrClubManager(req, res, next, paramName);
      });
    }
    checkAdminOrClubManager(req, res, next, paramName);
  };
};

const checkAdminOrClubManager = (req, res, next, paramName) => {
  if (req.user.role === 'ADMIN') return next();
  requireClubManager(paramName)(req, res, next);
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireClubManager,
  requireAdminOrClubManager,
};
