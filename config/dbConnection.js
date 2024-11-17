const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://adebayoluborode:TvIkWW7zMoXv64Jf@oau-emergency.30a3z.mongodb.net/?retryWrites=true&w=majority&appName=oau-emergency',
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
