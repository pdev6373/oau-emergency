const Otp = require('../models/Otp');
const User = require('../models/User');
const { compare, hash } = require('bcryptjs');
const { sendOTP } = require('../utils/sendOtp');
const isEmail = require('validator/lib/isEmail');
const { sign, verify } = require('jsonwebtoken');
const normalizeEmail = require('validator/lib/normalizeEmail');

// ⚡️ @Description -> Register a user
// ⚡️ @Route -> api/auth/register (POST)
// ⚡️ @Access -> Public
const register = async (req, res) => {
  try {
    const { email: userEmail, firstname, lastname, password } = req.body;

    const email = normalizeEmail(userEmail);

    const requiredFields = { email, firstname, lastname, password };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field]) => field);

    if (missingFields.length > 0)
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });

    if (!isEmail(email))
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });

    if (password.length < 8)
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser?.isVerified)
      return res.status(409).json({
        success: false,
        message: 'Account already exists',
      });

    const hashedPassword = await hash(password, 10);
    const userData = {
      email,
      firstname,
      lastname,
      password: hashedPassword,
    };

    const user = existingUser
      ? await User.findOneAndUpdate({ email }, userData, { new: true })
      : await User.create(userData);

    if (!user)
      return res.status(400).json({
        success: false,
        message: 'Failed to create user account',
      });

    const sendOTPResponse = await sendOTP(email);
    return res.json(sendOTPResponse);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
    });
  }
};

// ⚡️ @Description -> Verify user email
// ⚡️ @Route -> api/auth/verify/:token (POST)
// ⚡️ @Access -> Public
const verifyUser = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(403).json({
      success: false,
      message: 'All fields are required',
    });

  const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);

  if (response.length === 0 || otp !== response[0].otp)
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });

  const user = await User.findOne({ email }).exec();

  user.isVerified = true;
  await user.save();

  return res.status(201).json({
    success: true,
    message: `New user ${user.email} verified`,
  });
};

// ⚡️ @Description -> Sends a password reset link to users email
// ⚡️ @Route -> api/auth/forgot-password (POST)
// ⚡️ @Access -> Public
const forgotPassword = async (req, res) => {
  const { email: userEmail } = req.body;
  const email = normalizeEmail(userEmail);

  if (!email)
    return res
      .status(400)
      .json({ success: false, message: 'Email field is required' });

  if (!isEmail(email))
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email address' });

  const user = await User.findOne({ email }).exec();
  if (!user)
    return res
      .status(400)
      .send({ success: false, message: 'Account does not exist' });

  if (!user.isVerified)
    return res
      .status(401)
      .send({ success: false, message: 'Account not verified' });

  const sendOTPResponse = await sendOTP(email);
  return res.json(sendOTPResponse);
};

// ⚡️ @Description -> Sets user new password
// ⚡️ @Route -> api/auth/new-password/:token (PATCH)
// ⚡️ @Access -> Public
const setNewPassword = async (req, res) => {
  const { password, email, otp } = req.body;

  if (!password || !email || !otp)
    return res.status(403).json({
      success: false,
      message: 'All fields are required',
    });
  const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);

  if (response.length === 0 || otp !== response[0].otp)
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
    });

  const user = await User.findOne({ email }).exec();

  user.password = await hash(password, 10);
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
};

// ⚡️ @Description -> Login user
// ⚡️ @Route -> api/auth/login (POST)
// ⚡️ @Access -> Public
const login = async (req, res) => {
  const { email: userEmail, password } = req.body;

  const email = normalizeEmail(userEmail);

  const isInvalid = [email, password].some((entry) => !entry);
  if (isInvalid)
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });

  if (!isEmail(email))
    return res
      .status(400)
      .json({ success: false, message: 'Invalid email address' });

  if (password.length < 8)
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters',
    });

  const user = await User.findOne({ email }).exec();
  if (!user)
    return res
      .status(400)
      .send({ success: false, message: 'Invalid email or password' });

  if (!user.isVerified)
    return res
      .status(401)
      .send({ success: false, message: 'Account not verified' });

  const match = await compare(password, user.password);
  if (!match)
    return res
      .status(401)
      .send({ success: false, message: 'Incorrect email or password' });

  const accessToken = sign(
    {
      Info: { email: user.email, type: 'user', id: user._id },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' },
  );

  const refreshToken = sign(
    { email: user.email, type: 'user', id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' },
  );

  user.password = undefined;
  res.json({
    success: true,
    message: 'User logged in',
    data: { accessToken, refreshToken, userDetails: user },
  });
};

// ⚡️ @Description -> Sends new access token with refresh token
// ⚡️ @Route -> api/auth/refresh (GET)
// ⚡️ @Access -> Public
const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(403).send({ success: false, message: 'Forbidden' });

      const user = await User.findOne({ email: normalizeEmail(decoded.email) })
        .select('-password')
        .lean()
        .exec();

      if (!user)
        return res
          .status(401)
          .send({ success: false, message: 'Unauthorized' });

      if (!user.isVerified)
        return res
          .status(401)
          .send({ success: false, message: 'Account not verified' });

      const accessToken = sign(
        {
          Info: { email: user.email, typr: 'user', id: user._id },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' },
      );

      res.json({
        success: true,
        message: 'New access token generated',
        data: { accessToken, userDetails: user },
      });
    },
  );
};

module.exports = {
  login,
  refresh,
  register,
  verifyUser,
  forgotPassword,
  setNewPassword,
};
