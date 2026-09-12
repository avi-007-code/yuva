const multer = require('multer');
const { AppError } = require('./errorHandler');

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return callback(new AppError('Only image files are allowed', 400));
    }
    callback(null, true);
  },
});

const handleUploadError = (upload) => (req, res, next) => {
  upload(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('Image file must be 5 MB or smaller', 400));
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new AppError(`Unexpected form field '${error.field}' in upload request`, 400));
      }
      return next(new AppError(error.message, 400));
    }
    next(error);
  });
};

module.exports = {
  singleImage: (fieldName) => handleUploadError(imageUpload.single(fieldName)),
  multipleImages: (fieldName, maxCount) => handleUploadError(imageUpload.array(fieldName, maxCount)),
};