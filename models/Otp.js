const mongoose = require('mongoose');
const mailSender = require('../utils/sendVerificationEmail');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    await mailSender({
      to: email,
      subject: 'Verification Email',
      body: `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`,
    });
  } catch (error) {
    console.error('Error occurred while sending email: ', error);
    throw error;
  }
}

otpSchema.pre('save', async function (next) {
  if (this.isNew) await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model('OTP', otpSchema);
