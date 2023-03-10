const mongoose = require('mongoose');
const url = process.env.ATLAS_URI

const connectDB = async () => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB using Mongoose');
  } catch(err) {
    console.error('Error connecting to MongoDB using Mongoose', err);
    process.exit(1);
  }
};

module.exports = connectDB;