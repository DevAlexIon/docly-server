const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

// @route    GET /user/doctors
// @desc     Get all doctors
// @access   Private
router.get("/doctors", authenticate, getDoctors);

// @route    GET /user/:id
// @desc     Get user by ID
// @access   Private
router.get("/:id", authenticate, getUser);

// @route    PATCH /user/:id
// @desc     Update user by ID
// @access   Private
router.patch("/:id", authenticate, updateUser);

// @route    DELETE /user/:id
// @desc     Delete user by ID
// @access   Private
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
