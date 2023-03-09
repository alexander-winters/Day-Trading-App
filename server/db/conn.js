const mongoose = require('mongoose');
const url = process.env.ATLAS_URI

// module.exports = (mongoose) => {
//     return new Promise((resolve, reject) => {
//       mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//         .then(() => {
//           console.log("Connected to MongoDB using Mongoose");
//           resolve();
//         })
//         .catch((err) => {
//           console.error("Error connecting to MongoDB using Mongoose", err);
//           reject(err);
//         });
//     });
//   };

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