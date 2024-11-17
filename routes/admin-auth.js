const express = require('express');
const AdminController = require('../controllers/admin-auth');
const loginLimiter = require('../middleware/loginLimiter');

const AdminAuthRoutes = () => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/admin-auth/login:
   *   post:
   *     summary: Admin login
   *     tags: [Admin Authentication]
   *     description: Authenticate admin using their email and password.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Admin registered email address.
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 description: Admin account password.
   *     responses:
   *       200:
   *         description: Admin logged in successfully.
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
   *                   example: Admin logged in
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                       description: JWT access token.
   *                     refreshToken:
   *                       type: string
   *                       description: JWT refresh token.
   *                     adminDetails:
   *                       type: object
   *                       properties:
   *                         email:
   *                           type: string
   *                           format: email
   *                           description: Admin email address.
   *                         name:
   *                           type: string
   *                           description: Admin full name.
   *       400:
   *         description: Validation errors (e.g., missing fields or invalid data).
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
   *                   example: Invalid email address
   *       401:
   *         description: Unauthorized errors (e.g., invalid credentials).
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
   *                   example: Incorrect email or password
   */
  router.post('/login', loginLimiter, AdminController.login);

  /**
   * @swagger
   * /api/v1/admin-auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Admin Authentication]
   *     description: Generate a new access token using a valid refresh token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: A valid refresh token issued during login.
   *     responses:
   *       200:
   *         description: New access token generated successfully.
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
   *                   example: New access token generated
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                       description: Newly generated access token.
   *                     adminDetails:
   *                       type: object
   *                       properties:
   *                         email:
   *                           type: string
   *                           format: email
   *                           description: Admin email address.
   *                         name:
   *                           type: string
   *                           description: Admin full name.
   *       401:
   *         description: Unauthorized access (e.g., invalid refresh token or admin not found).
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
   *                   example: Unauthorized
   *       403:
   *         description: Forbidden access (e.g., refresh token verification failed).
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
   *                   example: Forbidden
   */
  router.post('/refresh', AdminController.refresh);
  return router;
};

module.exports = AdminAuthRoutes;
