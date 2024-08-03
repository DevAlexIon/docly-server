const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    specialties: [
      {
        type: [String],
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
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid phone number! It should be exactly 10 digits.`,
      },
      required: [true, "User phone number required"],
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Profile = mongoose.model("profile", ProfileSchema);
