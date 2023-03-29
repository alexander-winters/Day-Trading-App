const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const { start_trigger_timer } = require('../transaction-server/trigger_processing');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/dashboard"));
// Get Mongoose connection
const connectDB = require("./db/conn");

connectDB()
  .then(() => {
    start_trigger_timer();
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
  });
})
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });