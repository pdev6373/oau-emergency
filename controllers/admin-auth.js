const { compare } = require('bcryptjs');
const Admin = require('../models/Admin');
const isEmail = require('validator/lib/isEmail');
const { sign, verify } = require('jsonwebtoken');
const normalizeEmail = require('validator/lib/normalizeEmail');

// ⚡️ @Description -> Login admin
// ⚡️ @Route -> api/admin/auth/login (POST)
// ⚡️ @Access -> Public
const login = async (req, res) => {
  const { email: adminEmail, password } = req.body;

  const email = normalizeEmail(adminEmail);
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

  const admin = await Admin.findOne({ email }).exec();
  if (!admin)
    return res
      .status(400)
      .send({ success: false, message: 'Invalid email or password' });

  const match = await compare(password, admin.password);
  if (!match)
    return res
      .status(401)
      .send({ success: false, message: 'Incorrect email or password' });

  const accessToken = sign(
    {
      Info: { email: admin.email, type: 'admin', id: admin._id },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' },
  );

  const refreshToken = sign(
    { email: admin.email, type: 'admin', id: admin._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' },
  );

  admin.password = undefined;
  res.json({
    success: true,
    message: 'Admin logged in',
    data: { accessToken, refreshToken, adminDetails: admin },
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

      const admin = await Admin.findOne({
        email: normalizeEmail(decoded.email),
      })
        .select('-password')
        .lean()
        .exec();

      if (!admin)
        return res
          .status(401)
          .send({ success: false, message: 'Unauthorized' });

      const accessToken = sign(
        {
          Info: { email: admin.email, type: 'admin', id: admin._id },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' },
      );

      res.json({
        success: true,
        message: 'New access token generated',
        data: { accessToken, adminDetails: admin },
      });
    },
  );
};

module.exports = {
  login,
  refresh,
};
