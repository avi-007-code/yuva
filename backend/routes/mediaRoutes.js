const express = require('express');
const router = express.Router();
const { requireAdminOrClubManager } = require('../middleware/authMiddleware');
const { requireAdminOrEventManager } = require('../middleware/mediaAccessMiddleware');
const { singleImage, multipleImages } = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validate');
const { uploadLimiter, destructiveLimiter } = require('../middleware/rateLimiters');
const { clubParams, eventParams, publicIdParams } = require('../validators/schemas');
const {
  uploadClubLogo,
  deleteClubLogo,
  uploadClubCover,
  deleteClubCover,
  uploadEventCover,
  deleteEventCover,
  uploadEventGallery,
  deleteEventGalleryImage,
} = require('../controllers/mediaController');
const { deleteEvent } = require('../controllers/eventController');

router.post('/clubs/:clubId/logo', uploadLimiter, validate({ params: clubParams }), requireAdminOrClubManager('clubId'), singleImage('logo'), uploadClubLogo);
router.delete('/clubs/:clubId/logo', uploadLimiter, validate({ params: clubParams }), requireAdminOrClubManager('clubId'), deleteClubLogo);
router.post('/clubs/:clubId/cover', uploadLimiter, validate({ params: clubParams }), requireAdminOrClubManager('clubId'), singleImage('cover'), uploadClubCover);
router.delete('/clubs/:clubId/cover', uploadLimiter, validate({ params: clubParams }), requireAdminOrClubManager('clubId'), deleteClubCover);

router.post('/events/:eventId/cover', uploadLimiter, validate({ params: eventParams }), requireAdminOrEventManager, singleImage('cover'), uploadEventCover);
router.delete('/events/:eventId/cover', uploadLimiter, validate({ params: eventParams }), requireAdminOrEventManager, deleteEventCover);
router.post('/events/:eventId/gallery', uploadLimiter, validate({ params: eventParams }), requireAdminOrEventManager, multipleImages('images', 10), uploadEventGallery);
router.delete('/events/:eventId/gallery/:publicId', uploadLimiter, validate({ params: publicIdParams }), requireAdminOrEventManager, deleteEventGalleryImage);
router.delete('/events/:eventId', destructiveLimiter, validate({ params: eventParams }), requireAdminOrEventManager, deleteEvent);

module.exports = router;
