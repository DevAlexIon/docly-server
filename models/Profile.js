const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bio: {
      type: String,
    },
    specialties: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
    },
    availableSlots: [
      {
        type: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = Profile = mongoose.model("profile", ProfileSchema);
