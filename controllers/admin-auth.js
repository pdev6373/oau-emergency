const isEmail = require('validator/lib/isEmail');
const { sign, verify } = require('jsonwebtoken');
const { compare, hash, hashSync } = require('bcryptjs');
const normalizeEmail = require('validator/lib/normalizeEmail');
const Admin = require('../models/Admin');

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
    'rWUAUFHXXmIhNICO6Zlre1mHXn8XivgAOTW6e4BXOLD8sJRSKAISfQ7de8MZE6y12A8ainDlfu3RbuSvBZZhRVWNpZOYdZ/zxd9u115GykkrCQ8eaZuyrMpaL4EUTMQzXyx5TagDvYoQugatuXcLELbAztkXcoo8kmKdl5jGt9QMeG99jT2r742YONzVzGttPbTN5HUFf2yciXBqmD1c+UPbxsskx+XfYhP++jPqYgo5XepJegidrYMZC+owb7blJr110y7G/lDQqljZlGJ0WsMaxu1h5q62aozYFY0B6ta+C7neSn6ru2F7VayN/TMENBcrNRCXq7DR5uEpfasvig==',
    { expiresIn: '15m' },
  );

  const refreshToken = sign(
    { email: admin.email, type: 'admin', id: admin._id },
    'lT6QfEjns9UuevUFcWvhPohhN4T2Sq6Am2jEqoMgfUS9FAYWoQfpq99cVxd4iQxCnJO3U0JlJ64m+6g9aqC+i8TLmPRx8uMiJYaoQVi//gsFLg8tL5zxrE/pI2rC8it+92BJFvAFNG8U54eHyhkVNtJH7/wY0kThyMDEh3KlyjlHPslHtpkN8ntGzRmG5Fo07v4Z5fDQ1JevE+nw7Qz3buLqjjN35KaGVq4tlKFA3r/WamjtT0LmtLfLCeWAVHdrYz8ECKC3ArgUjGZFQGUu1mtAb3ohT7iOXF2IMecJOj55EVRhKGtMRuyaKo+t4Ysoy31Rt8htFLyLXAW/SvaESA==',
    { expiresIn: '7d' },
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
    'lT6QfEjns9UuevUFcWvhPohhN4T2Sq6Am2jEqoMgfUS9FAYWoQfpq99cVxd4iQxCnJO3U0JlJ64m+6g9aqC+i8TLmPRx8uMiJYaoQVi//gsFLg8tL5zxrE/pI2rC8it+92BJFvAFNG8U54eHyhkVNtJH7/wY0kThyMDEh3KlyjlHPslHtpkN8ntGzRmG5Fo07v4Z5fDQ1JevE+nw7Qz3buLqjjN35KaGVq4tlKFA3r/WamjtT0LmtLfLCeWAVHdrYz8ECKC3ArgUjGZFQGUu1mtAb3ohT7iOXF2IMecJOj55EVRhKGtMRuyaKo+t4Ysoy31Rt8htFLyLXAW/SvaESA==',
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
        'rWUAUFHXXmIhNICO6Zlre1mHXn8XivgAOTW6e4BXOLD8sJRSKAISfQ7de8MZE6y12A8ainDlfu3RbuSvBZZhRVWNpZOYdZ/zxd9u115GykkrCQ8eaZuyrMpaL4EUTMQzXyx5TagDvYoQugatuXcLELbAztkXcoo8kmKdl5jGt9QMeG99jT2r742YONzVzGttPbTN5HUFf2yciXBqmD1c+UPbxsskx+XfYhP++jPqYgo5XepJegidrYMZC+owb7blJr110y7G/lDQqljZlGJ0WsMaxu1h5q62aozYFY0B6ta+C7neSn6ru2F7VayN/TMENBcrNRCXq7DR5uEpfasvig==',
        { expiresIn: '15m' },
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
