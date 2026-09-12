const cloudinary = require('../config/cloudinary');

const uploadBuffer = (buffer, folder) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder, resource_type: 'image' },
    (error, result) => {
      if (error) return reject(error);
      resolve({ url: result.secure_url, publicId: result.public_id });
    }
  );

  stream.end(buffer);
});

const deleteAsset = (publicId) => cloudinary.uploader.destroy(publicId, {
  resource_type: 'image',
});

// Asset deletion must not prevent a related database record from being deleted.
// Any failed cleanup is logged for later recovery instead of aborting the delete.
const deleteAssetsBestEffort = async (publicIds, context) => {
  const assets = publicIds.filter(Boolean);
  const results = await Promise.allSettled(assets.map((publicId) => deleteAsset(publicId)));

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error(`Failed to delete Cloudinary asset for ${context}:`, result.reason);
    }
  });
};

module.exports = { uploadBuffer, deleteAsset, deleteAssetsBestEffort };
