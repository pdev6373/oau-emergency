const Tip = require('../models/Tip');

const getTips = async (req, res) => {
  const tips = await Tip.find();

  return res.json({
    success: true,
    message: 'Safety Tips retrieved',
    data: tips,
  });
};

const createTip = async (req, res) => {
  const { title, body } = req.body;

  const tip = await Tip.create({
    title,
    body,
  });

  return res.json({
    success: true,
    message: 'Safety Tip created',
    data: tip,
  });
};

module.exports = {
  getTips,
  createTip,
};
