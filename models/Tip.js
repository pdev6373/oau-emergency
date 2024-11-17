const { model, Schema } = require('mongoose');

const tipSchema = new Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Tip', tipSchema);
