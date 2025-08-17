const express = require('express');
const multer = require('multer');
const { imageStorage, videoStorage } = require('../storage/storage');

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

const UploadRoutes = () => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/upload/image:
   *   post:
   *     summary: Upload an image to Cloudinary
   *     tags:
   *       - Upload
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Image uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 url:
   *                   type: string
   *                 public_id:
   *                   type: string
   *       500:
   *         description: Server error
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
      console.log({ err: JSON.stringify(err) });
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  /**
   * @swagger
   * /api/v1/upload/video:
   *   post:
   *     summary: Upload a video to Cloudinary
   *     tags:
   *       - Upload
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               video:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Video uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 url:
   *                   type: string
   *                 public_id:
   *                   type: string
   *       500:
   *         description: Server error
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
      console.log({ err: JSON.stringify(err) });
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};

module.exports = UploadRoutes;
