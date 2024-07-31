const User = require("../models/User");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");

exports.getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    if (id !== userId && role !== "admin'") {
      return res.status(403).json({ msg: "Access denied!" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    let appointments;

    if (role === "patient") {
      appointments = await Appointment.find({ patient: id }).populate({
        path: "doctor",
        select: "name",
      });
    } else {
      appointments = await Appointment.find({ doctor: id }).populate({
        path: "patient",
        select: "name",
      });
    }

    if (!appointments) {
      return res.status(404).json({ msg: "No appointments found" });
    }

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createAppointment = async (req, res) => {
  const { patient, doctor, date } = req.body;

  if (!date) {
    return res.status(400).json({ msg: "Date is required" });
  }

  const existingPatient = await User.findById(patient);
  const existingDoctor = await User.findById(doctor);

  if (existingDoctor.role !== "doctor") {
    return res.status(400).json({ msg: "Doctor role missing!" });
  }

  const [day, month, year] = date.split("-");
  const formattedDate = new Date(`${year}-${month}-${day}`);

  if (!existingPatient || !existingDoctor) {
    return res.status(404).json({ msg: "Doctor or patient not found" });
  }

  try {
    const newAppointment = new Appointment({
      patient,
      doctor,
      date: formattedDate,
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ msg: "Access denied!" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid appointment ID" });
    }

    const updatedData = req.body;

    const newDoctor = await User.findById(updatedData.doctor);

    if (!mongoose.Types.ObjectId.isValid(updatedData.doctor)) {
      return res.status(400).json({ msg: "Invalid doctor ID" });
    }

    if (newDoctor.role !== "doctor") {
      return res.status(400).json({ msg: "Doctor role missing!" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.json(updatedAppointment);
  } catch (err) {
    console.error(err.message);

    if (err.name === "ValidationError") {
      if (err.errors.status) {
        return res.status(400).json({
          msg: "Invalid status value. Allowed values are scheduled, completed, or canceled.",
        });
      }
      const fieldErrors = Object.keys(err.errors).map(
        (field) => err.errors[field].message
      );
      return res.status(400).json({ msg: fieldErrors.join(", ") });
    }

    res.status(500).send("Server Error");
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid appointment ID!" });
    }

    if (role !== "admin") {
      return res.status(403).json({ msg: "Access denied!" });
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ msg: "Appointment not found!" });
    }

    res.json({ msg: "Appointment deleted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
