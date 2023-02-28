const { MongoClient } = require("mongodb");
const url = process.env.ATLAS_URI

let _db;

module.exports = {
  connectToServer: function () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(client => {
          _db = client.db();
          console.log("Connected to MongoDB");
          resolve();
        })
        .catch(err => {
          console.error("Error connecting to MongoDB", err);
          reject(err);
        });
    });
  },

  getDb: function () {
    if (!_db) {
      console.warn("Attempted to get database before connecting.");
      return null;
    }
    return _db;
  }
};
