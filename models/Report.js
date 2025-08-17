const { model, Schema } = require('mongoose');

const reportSchema = new Schema(
  {
    location: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    date: {
      type: Date,
    },
    details: {
      type: String,
    },
    isAcknowled: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Report', reportSchema);
