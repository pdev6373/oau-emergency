const express = require('express');
const UserController = require('../controllers/user');
const ReportController = require('../controllers/reports');

const UserRoutes = () => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/user/emergency-contact:
   *   get:
   *     summary: Retrieve emergency contact information
   *     tags:
   *       - Emergency Contacts
   *     description: Returns a list of emergency contact details including phone, email, and location for various services such as fire, security, and medical emergencies.
   *     responses:
   *       200:
   *         description: Successfully retrieved contact information
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
   *                   example: Contacts retrieved
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       title:
   *                         type: string
   *                         description: Title of the emergency service.
   *                         example: Fire Emergency
   *                       contacts:
   *                         type: array
   *                         description: List of contact details for the emergency service.
   *                         items:
   *                           type: object
   *                           properties:
   *                             phone:
   *                               type: string
   *                               description: Phone number for emergency contact.
   *                               example: +234 011 022 0333
   *                             email:
   *                               type: string
   *                               description: Email address for emergency contact.
   *                               example: fireemergency@agency.oauife.edu.ng
   *                             location:
   *                               type: string
   *                               description: Physical address of the emergency contact.
   *                               example: Beside Banking Area, Road 1, Oau Campus.
   */
  router.get('/emergency-contact', UserController.getContact);

  /**
   * @swagger
   * /api/v1/user/reports:
   *   get:
   *     summary: Retrieve reports for the authenticated user
   *     tags:
   *       - Reports
   *     description: Returns a list of reports specific to the authenticated user.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully retrieved user-specific reports
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
  router.get('/reports', ReportController.getReports);

  /**
   * @swagger
   * /api/v1/user/reports:
   *   post:
   *     summary: Create a new report
   *     tags:
   *       - Reports
   *     description: Creates a new report with the specified details.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               location:
   *                 type: string
   *                 description: Location of the incident.
   *                 example: Main Gate, OAU Campus
   *               date:
   *                 type: string
   *                 format: date
   *                 description: Date of the incident.
   *                 example: 2024-11-17
   *               details:
   *                 type: string
   *                 description: Description of the incident.
   *                 example: A fire outbreak occurred near the main gate.
   *     responses:
   *       200:
   *         description: Report successfully created
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
   *                   example: Report created
   *                 data:
   *                   $ref: '#/components/schemas/Report'
   *       400:
   *         description: Invalid date provided
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
   *                   example: Invalid date provided
   */
  router.post('/reports', ReportController.createReport);

  router
    .route('/')
    /**
     * @swagger
     * /api/v1/user:
     *   get:
     *     summary: Retrieve the authenticated user's details
     *     tags:
     *       - User Profile
     *     description: Fetches the details of the authenticated user, excluding the password.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Successfully retrieved user details.
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
     *                   example: Account retrieved
     *                 data:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                       description: The unique ID of the user.
     *                       example: 64a1234f567890ab12cdef34
     *                     firstName:
     *                       type: string
     *                       description: The first name of the user.
     *                       example: John
     *                     lastName:
     *                       type: string
     *                       description: The last name of the user.
     *                       example: Doe
     *                     email:
     *                       type: string
     *                       description: The email address of the user.
     *                       example: johndoe@example.com
     *                     isVerified:
     *                       type: boolean
     *                       description: Indicates whether the user's account is verified.
     *                       example: true
     *       400:
     *         description: Account not found.
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
     *                   example: Account not found
     */
    .get(UserController.getUser)

    /**
     * @swagger
     * /api/v1/user:
     *   patch:
     *     summary: Updates a user's details
     *     tags:
     *       - User Profile
     *     description: Updates the first name, last name, or display name of an authenticated user.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *                 description: The new first name of the user.
     *                 example: John
     *               lastName:
     *                 type: string
     *                 description: The new last name of the user.
     *                 example: Doe
     *               displayName:
     *                 type: string
     *                 description: The new display name of the user.
     *                 example: johndoe123
     *     responses:
     *       200:
     *         description: User details updated successfully.
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
     *                   example: User updated successfully
     *                 data:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                       description: The unique ID of the user.
     *                       example: 64a1234f567890ab12cdef34
     *                     firstName:
     *                       type: string
     *                       description: The updated first name of the user.
     *                       example: John
     *                     lastName:
     *                       type: string
     *                       description: The updated last name of the user.
     *                       example: Doe
     *                     displayName:
     *                       type: string
     *                       description: The updated display name of the user.
     *                       example: johndoe123
     *       400:
     *         description: Bad request due to missing or invalid input, or user does not exist/verification issue.
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
     *                   example: User does not exist
     */
    .patch(UserController.updateUser);

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

module.exports = UserRoutes;
