const express = require('express');
const AuthRoutes = require('./auth');
const UserRoutes = require('./user');
const verifyJWT = require('../middleware/verifyJWT');
const AdminAuthRoutes = require('./admin-auth');
const AdminRoutes = require('./admin');
const TipsRoutes = require('./tips');

const getRoutes = () => {
  const router = express.Router();
  router.use('/auth', AuthRoutes());
  router.use('/admin-auth', AdminAuthRoutes());
  router.use('/safety-tips', TipsRoutes());
  router.use('/user', verifyJWT('user'), UserRoutes());
  router.use('/admin', verifyJWT('admin'), AdminRoutes());
  // router.use('/post', PostRoutes());

  return router;
};

module.exports = getRoutes;
