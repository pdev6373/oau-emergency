const Report = require('../models/Report');
const isDate = require('validator/lib/isDate');

const getAllReports = async (req, res) => {
  const reports = await Report.find();

  return res.json({
    success: true,
    message: 'Reports retrieved',
    data: reports,
  });
};

const getReports = async (req, res) => {
  const reports = await Report.find({
    userId: req.user.id,
  });

  return res.json({
    success: true,
    message: 'Reports retrieved',
    data: reports,
  });
};

const acknowledgeReport = async (req, res) => {
  const { id } = req.body;
  const report = await Report.findById(id);

  report.isAcknowled = true;
  await report.save();

  return res.json({
    success: true,
    message: 'Reports updated',
    data: report,
  });
};

const createReport = async (req, res) => {
  const { location, date, details, image, video } = req.body;

  if (!isDate(date))
    return res.status(400).json({
      success: false,
      message: 'Invalid date provided',
    });

  const report = await Report.create({
    location,
    date,
    details,
    userId: req.user.id,
    video,
    image,
  });

  return res.json({
    success: true,
    message: 'Reports created',
    data: report,
  });
};

module.exports = {
  getAllReports,
  getReports,
  acknowledgeReport,
  createReport,
};
