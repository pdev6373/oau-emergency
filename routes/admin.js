const express = require('express');
const ReportsController = require('../controllers/reports');
const TipsController = require('../controllers/tips');

const AdminRoutes = () => {
  const router = express.Router();

  router
    .route('/reports')
    /**
     * @swagger
     * /api/v1/admin/reports:
     *   get:
     *     summary: Retrieve all reports
     *     tags:
     *       - Reports
     *     description: Returns a list of all reports in the system.
     *     responses:
     *       200:
     *         description: Successfully retrieved all reports
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
     *                   example: Reports retrieved
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Report'
     */
    .get(ReportsController.getAllReports);

  /**
   * @swagger
   * /api/v1/admin/acknowledge-report:
   *   patch:
   *     summary: Acknowledge a report
   *     tags:
   *       - Reports
   *     description: Marks a specific report as acknowledged by updating its `isAcknowled` status to true.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 description: ID of the report to acknowledge.
   *                 example: 64b8f8175fa3f5326c3e5d20
   *     responses:
   *       200:
   *         description: Report successfully acknowledged
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
   *                   example: Report acknowledged
   *                 data:
   *                   $ref: '#/components/schemas/Report'
   *       404:
   *         description: Report not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Report not found
   */
  router.patch('/acknowledge-report', ReportsController.acknowledgeReport);

  /**
   * @swagger
   * /api/v1/admin/safety-tips:
   *   post:
   *     summary: Create a new safety tip
   *     tags:
   *       - Safety Tips
   *     description: Adds a new safety tip to the database.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: The title of the safety tip.
   *                 example: "Fire Safety"
   *               body:
   *                 type: string
   *                 description: Detailed information about the safety tip.
   *                 example: "Install smoke detectors in key areas of your home and check them monthly."
   *     responses:
   *       200:
   *         description: Safety Tip successfully created.
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
   *                   example: Safety Tip created
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       description: The unique ID of the created safety tip.
   *                       example: 64a1234f567890ab12cdef34
   *                     title:
   *                       type: string
   *                       description: The title of the safety tip.
   *                       example: "Fire Safety"
   *                     body:
   *                       type: string
   *                       description: The content or details of the safety tip.
   *                       example: "Install smoke detectors in key areas of your home and check them monthly."
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       description: The date and time the safety tip was created.
   *                       example: "2024-11-17T10:00:00Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       description: The date and time the safety tip was last updated.
   *                       example: "2024-11-17T10:00:00Z"
   */
  router.post('/safety-tips', TipsController.createTip);

  return router;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the report.
 *           example: 64b8f8175fa3f5326c3e5d20
 *         location:
 *           type: string
 *           description: Location of the reported incident.
 *           example: Main Gate, OAU Campus
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the incident.
 *           example: 2024-11-17
 *         details:
 *           type: string
 *           description: Detailed description of the incident.
 *           example: A fire outbreak occurred near the main gate.
 *         isAcknowled:
 *           type: boolean
 *           description: Whether the report has been acknowledged.
 *           example: true
 *         userId:
 *           type: string
 *           description: ID of the user who created the report.
 *           example: 64b8f8175fa3f5326c3e5d20
 */

module.exports = AdminRoutes;
