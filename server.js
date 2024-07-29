const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Doctor Appointment Platform API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
