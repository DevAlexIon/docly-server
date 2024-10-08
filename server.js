const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const appointmentRoutes = require("./routes/appointment");
const profileRoutes = require("./routes/profile");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("Doctor Appointment Platform API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
