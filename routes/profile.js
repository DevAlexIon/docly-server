const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const {
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

// @route    POST /profile
// @desc     Create a profile
// @access   Private
router.post("/", authenticate, createProfile);

// @route    DELETE /profile/:id
// @desc     Delete a profile
// @access   Private
router.delete("/:id", authenticate, deleteProfile);

// @route    UPDATE /profile/:id
// @desc     Update a profile
// @access   Private
router.patch("/:id", authenticate, updateProfile);

module.exports = router;
