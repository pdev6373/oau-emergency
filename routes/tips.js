const express = require('express');
const UserController = require('../controllers/user');
const ReportController = require('../controllers/reports');
const TipsController = require('../controllers/tips');

const TipsRoutes = () => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/safety-tips:
   *   get:
   *     summary: Retrieve all safety tips
   *     tags:
   *       - Safety Tips
   *     description: Fetches a list of all safety tips stored in the database.
   *     responses:
   *       200:
   *         description: Successfully retrieved safety tips.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Safety Tips retrieved
   *                 data:
   *                   type: array
   *                   description: List of safety tips.
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The unique ID of the safety tip.
   *                         example: 64a1234f567890ab12cdef34
   *                       title:
   *                         type: string
   *                         description: The title of the safety tip.
   *                         example: "Fire Safety"
   *                       description:
   *                         type: string
   *                         description: Detailed information about the safety tip.
   *                         example: "Always keep a fire extinguisher accessible in your home."
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         description: The date and time the safety tip was created.
   *                         example: "2024-11-17T10:00:00Z"
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *                         description: The date and time the safety tip was last updated.
   *                         example: "2024-11-17T12:00:00Z"
   */
  router.get('/', TipsController.getTips);

  return router;
};

module.exports = TipsRoutes;
