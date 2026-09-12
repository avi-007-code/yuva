const express = require('express');
const router = express.Router();
const {
	adminLogin,
	managerLogin,
	requestManagerPasswordReset,
	resetManagerPassword,
	adminRegister,
} = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { authLimiter, loginLimiter } = require('../middleware/rateLimiters');
const {
	loginBody,
	forgotPasswordBody,
	resetPasswordBody,
	adminRegisterBody,
} = require('../validators/schemas');

// POST /auth/admin/login
router.post('/admin/login', loginLimiter, validate({ body: loginBody }), adminLogin);

// POST /auth/manager/login
router.post('/manager/login', loginLimiter, validate({ body: loginBody }), managerLogin);
router.post('/manager/forgot-password', authLimiter, validate({ body: forgotPasswordBody }), requestManagerPasswordReset);
router.post('/manager/reset-password', authLimiter, validate({ body: resetPasswordBody }), resetManagerPassword);

// POST /auth/admin/register (Utility / initial setup)
router.post('/admin/register', authLimiter, validate({ body: adminRegisterBody }), adminRegister);

module.exports = router;
