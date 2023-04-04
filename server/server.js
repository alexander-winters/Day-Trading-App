const express = require("express");
const app = express();
const cors = require("cors");
const port = process.argv[4] || 5000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/dashboard"));
// Get Mongoose connection
const connectDB = require("./db/conn");

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
  });
})
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });