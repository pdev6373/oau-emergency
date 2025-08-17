const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Images',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    resource_type: 'image',
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Videos',
    allowedFormats: ['mp4', 'mov', 'avi', 'mkv'],
    resource_type: 'video',
  },
});

module.exports = { imageStorage, videoStorage, cloudinary };
