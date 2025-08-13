const OTP = require('../models/Otp');
const otpGenerator = require('otp-generator');
const { OTP_DIGITS_LENGTH, OTP_CONFIGURATIONS } = require('./constants');

module.exports.sendOTP = async (email) => {
  let otp = otpGenerator.generate(OTP_DIGITS_LENGTH, OTP_CONFIGURATIONS);

  let result = await OTP.findOne({ otp });

  while (result?.email == email) {
    otp = otpGenerator.generate(OTP_DIGITS_LENGTH, OTP_CONFIGURATIONS);
    result = await OTP.findOne({ otp });
  }

  const otpPayload = { email, otp };
  await OTP.create(otpPayload);

  return {
    success: true,
    message: `OTP sent to ${email}`,
  };
};
