const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/User");

exports.createProfile = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { userId, bio, specialties, location, availableSlots, phoneNumber } =
      req.body;

    if (!mongoose.mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const existingProfile = await Profile.findOne({ user: userId });

    if (existingProfile) {
      return res.status(400).json({ msg: "Profile already exists" });
    }

    const profile = new Profile({
      user: userId,
      bio,
      specialties,
      location,
      availableSlots,
      phoneNumber,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ status: 400, errors });
    }

    console.error(error.message);
    res.status(500).json({ status: 500, errors: ["Server Error"] });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid profile ID" });
    }

    const updatedData = req.body;

    const updatedProfile = await Profile.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProfile) {
      return res.status(400).json({ msg: "Profile not found!" });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error(err.message);

    if (err.name === "ValidationError") {
      const firstErrorMessage = Object.values(err.errors)[0].message;
      return res.status(400).json({ msg: firstErrorMessage });
    }

    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(401).json({ msg: "Unauthorized!" });
    }

    if (!mongoose.mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid profile ID" });
    }

    const deleteProfile = await Profile.findByIdAndDelete(id);

    if (!deleteProfile) {
      return res.status(401).json({ msg: "Profile doesn't exist!" });
    }

    res.json({ msg: "Profile deleted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
