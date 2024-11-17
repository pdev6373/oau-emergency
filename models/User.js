const { model, Schema } = require('mongoose');
const { sign } = require('jsonwebtoken');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.generateVerificationToken = function () {
  const verificationToken = sign(
    { id: this._id },
    `${process.env.USER_VERIFICATION_TOKEN_SECRET}`,
    { expiresIn: '5m' },
  );
  return verificationToken;
};

module.exports = model('User', userSchema);
