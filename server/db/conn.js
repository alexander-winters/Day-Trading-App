const mongoose = require('mongoose');
const url = 'mongodb://mymongo-container:27017/test'

const connectDB = async () => {
  try {
    await mongoose.connect(url, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      maxPoolSize: 1500,
    });
    console.log('Connected to MongoDB using Mongoose');
  } catch(err) {
    console.error('Error connecting to MongoDB using Mongoose', err);
    process.exit(1);
  }
};

module.exports = connectDB;