const mongoose = require('mongoose');
const url = process.env.ATLAS_URI

module.exports = (mongoose) => {
    return new Promise((resolve, reject) => {
      mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          console.log("Connected to MongoDB using Mongoose");
          resolve();
        })
        .catch((err) => {
          console.error("Error connecting to MongoDB using Mongoose", err);
          reject(err);
        });
    });
  };