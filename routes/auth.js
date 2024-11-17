const express = require('express');
const AuthController = require('../controllers/auth');
const loginLimiter = require('../middleware/loginLimiter');

const AuthRoutes = () => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     description: Register a new user account and send verification email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - firstname
   *               - lastname
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               firstname:
   *                 type: string
   *                 description: User's first name
   *               lastname:
   *                 type: string
   *                 description: User's last name
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 description: User's password (min 8 characters)
   *               dateOfBirth:
   *                 type: string
   *                 format: date
   *                 description: User's date of birth (optional)
   *               gender:
   *                 type: string
   *                 enum: [Male, Female]
   *                 description: User's gender (optional)
   *     responses:
   *       200:
   *         description: Registration successful, verification email sent
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
   *                   example: A verification email was sent to user@example.com
   *       400:
   *         description: Invalid input data
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
   *                   example: All fields are required
   *       409:
   *         description: Account already exists
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
   *                   example: Account already exist
   */
  router.post('/register', AuthController.register);

  /**
   * @swagger
   * /api/v1/auth/verify:
   *   post:
   *     summary: Verify user email with OTP
   *     tags: [Authentication]
   *     description: Verify user's email address using the OTP sent during registration
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - otp
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               otp:
   *                 type: string
   *                 description: One-Time Password sent to user's email
   *     responses:
   *       201:
   *         description: User verified successfully
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
   *                   example: New user user@example.com verified
   *       400:
   *         description: Invalid OTP
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
   *                   example: Invalid OTP
   *       403:
   *         description: Missing required fields
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
   *                   example: All fields are required
   */
  router.post('/verify', AuthController.verifyUser);

  /**
   * @swagger
   * /api/v1/auth/forgot-password:
   *   post:
   *     summary: Request password reset OTP
   *     tags: [Authentication]
   *     description: Send OTP to user's email for password reset verification
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's registered email address
   *     responses:
   *       200:
   *         description: OTP sent successfully
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
   *                   example: OTP sent to user@example.com
   *       400:
   *         description: Invalid request
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
   *                   example: Email field is required
   *             examples:
   *               emailRequired:
   *                 value:
   *                   success: false
   *                   message: Email field is required
   *               invalidEmail:
   *                 value:
   *                   success: false
   *                   message: Invalid email address
   *               accountNotExist:
   *                 value:
   *                   success: false
   *                   message: Account does not exist
   *       401:
   *         description: Account not verified
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
   *                   example: Account not verified
   */
  router.post('/forgot-password', AuthController.forgotPassword);

  /**
   * @swagger
   * /api/v1/auth/new-password:
   *   patch:
   *     summary: Set new password using OTP
   *     tags: [Authentication]
   *     description: Reset user's password after verifying OTP sent to email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - otp
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's registered email address
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 description: New password to set
   *               otp:
   *                 type: string
   *                 description: One-Time Password received in email
   *     responses:
   *       200:
   *         description: Password changed successfully
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
   *                   example: Password changed successfully
   *       400:
   *         description: Invalid OTP
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
   *                   example: Invalid OTP
   *       403:
   *         description: Missing required fields
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
   *                   example: All fields are required
   */
  router.patch('/new-password', AuthController.setNewPassword);

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: User login
   *     tags: [Authentication]
   *     description: Authenticate a user using their email and password.
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
   *                 description: User's registered email address.
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 8
   *                 description: User's account password.
   *     responses:
   *       200:
   *         description: User logged in successfully.
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
   *                   example: User logged in
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                       description: JWT access token.
   *                     refreshToken:
   *                       type: string
   *                       description: JWT refresh token.
   *                     userDetails:
   *                       type: object
   *                       properties:
   *                         email:
   *                           type: string
   *                           format: email
   *                           description: User's email address.
   *                         name:
   *                           type: string
   *                           description: User's full name.
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
  router.post('/login', loginLimiter, AuthController.login);

  /**
   * @swagger
   * /api/v1/auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Authentication]
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
   *                     userDetails:
   *                       type: object
   *                       properties:
   *                         email:
   *                           type: string
   *                           format: email
   *                           description: User's email address.
   *                         name:
   *                           type: string
   *                           description: User's full name.
   *       401:
   *         description: Unauthorized access (e.g., invalid refresh token or user not found).
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
  router.post('/refresh', AuthController.refresh);
  return router;
};

module.exports = AuthRoutes;
