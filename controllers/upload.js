const express = require('express');
const multer = require('multer');
const { imageStorage, videoStorage } = require('../storage/storage');

const router = express.Router();

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

/**
 * @route   POST /upload/image
 * @desc    Upload an image to Cloudinary
 */
router.post('/image', uploadImage.single('image'), (req, res) => {
  try {
    return res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: req.file.path, // Cloudinary file URL
      public_id: req.file.filename, // Cloudinary public ID
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   POST /upload/video
 * @desc    Upload a video to Cloudinary
 */
router.post('/video', uploadVideo.single('video'), (req, res) => {
  try {
    return res.json({
      success: true,
      message: 'Video uploaded successfully',
      url: req.file.path, // Cloudinary file URL
      public_id: req.file.filename, // Cloudinary public ID
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
