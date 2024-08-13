const express = require("express");
const router = express.Router();
const {
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  filterAppointments,
} = require("../controllers/appointmentController");
const { authenticate } = require("../middleware/authMiddleware");

// @route    GET /appointment/user/:id
// @desc     Get all appointments for a user
// @access   Private
router.get("/user/:id", authenticate, getAppointment);

// @route    POST /appointment
// @desc     Create an appointment
// @access   Private
router.post("/", authenticate, createAppointment);

// @route    PATCH /appointment/:id
// @desc     Update an appointment
// @access   Private
router.patch("/:id", authenticate, updateAppointment);

// @route    DELETE /appointment/:id
// @desc     Delete an appointment
// @access   Private
router.delete("/:id", authenticate, deleteAppointment);

// @route    GET /appointment/filter
// @desc     Filter appointments
// @access   Private
router.get("/filter", authenticate, filterAppointments);

module.exports = router;
