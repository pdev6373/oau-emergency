const { verify } = require('jsonwebtoken');

const verifyJWT = (type) => (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];

  verify(
    token,
    'rWUAUFHXXmIhNICO6Zlre1mHXn8XivgAOTW6e4BXOLD8sJRSKAISfQ7de8MZE6y12A8ainDlfu3RbuSvBZZhRVWNpZOYdZ/zxd9u115GykkrCQ8eaZuyrMpaL4EUTMQzXyx5TagDvYoQugatuXcLELbAztkXcoo8kmKdl5jGt9QMeG99jT2r742YONzVzGttPbTN5HUFf2yciXBqmD1c+UPbxsskx+XfYhP++jPqYgo5XepJegidrYMZC+owb7blJr110y7G/lDQqljZlGJ0WsMaxu1h5q62aozYFY0B6ta+C7neSn6ru2F7VayN/TMENBcrNRCXq7DR5uEpfasvig==',
    (err, decoded) => {
      if (err || decoded.Info.type !== type)
        return res.status(403).json({ success: false, message: 'Forbidden' });

      req.user = decoded.Info;
      next();
    },
  );
};

module.exports = verifyJWT;
