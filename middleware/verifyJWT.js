const { verify } = require('jsonwebtoken');

const verifyJWT = (type) => (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];

  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.Info.type !== type)
      return res.status(403).json({ success: false, message: 'Forbidden' });

    req.user = decoded.Info;
    next();
  });
};

module.exports = verifyJWT;
