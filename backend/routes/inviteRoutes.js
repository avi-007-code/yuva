const express = require('express');
const router = express.Router();
const { validateInvite, acceptInvite } = require('../controllers/inviteController');
const { validate } = require('../middleware/validate');
const { inviteLimiter } = require('../middleware/rateLimiters');
const { inviteToken, acceptInviteBody } = require('../validators/schemas');
const inviteParams = require('zod').z.object({ token: inviteToken });

// GET /invite/:token/validate
router.get('/:token/validate', inviteLimiter, validate({ params: inviteParams }), validateInvite);

// POST /invite/:token/accept
router.post('/:token/accept', inviteLimiter, validate({ params: inviteParams, body: acceptInviteBody }), acceptInvite);

module.exports = router;
