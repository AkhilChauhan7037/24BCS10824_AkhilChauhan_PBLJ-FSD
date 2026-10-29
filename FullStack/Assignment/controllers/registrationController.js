const Registration = require("../models/Registration");

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const calculateFinalAmount = (ticketPrice, discountCode) => {
  if (!discountCode) {
    return ticketPrice;
  }
  if (discountCode === "CAMPUS50") {
    return ticketPrice * 0.5;
  }
  if (discountCode === "EARLYBIRD") {
    return Math.max(ticketPrice - 100, 0);
  }
  return null;
};

const createRegistration = async (req, res, next) => {
  try {
    const {
      studentName,
      collegeEmail,
      rollNumber,
      eventType,
      teamSize,
      ticketPrice,
      discountCode,
    } = req.body;

    const code = discountCode ? String(discountCode).trim().toUpperCase() : "";
    const finalAmount = calculateFinalAmount(Number(ticketPrice), code);

    if (finalAmount === null) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid discount code" });
    }

    const registration = await Registration.create({
      studentName,
      collegeEmail,
      rollNumber,
      eventType,
      teamSize,
      ticketPrice,
      discountCode: code,
      finalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRegistrations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.eventType) filter.eventType = req.query.eventType;
    if (req.query.status) filter.status = req.query.status;

    const registrations = await Registration.find(filter);

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

const getRegistrationById = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid registration ID format" });
    }

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

const updateRegistration = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid registration ID format" });
    }

    const existing = await Registration.findById(req.params.id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    const allowedFields = [
      "studentName",
      "collegeEmail",
      "rollNumber",
      "eventType",
      "teamSize",
      "ticketPrice",
      "discountCode",
      "status",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.eventType === undefined) {
      updates.eventType = existing.eventType;
    }

    const ticketPrice =
      updates.ticketPrice !== undefined
        ? Number(updates.ticketPrice)
        : existing.ticketPrice;

    const code =
      updates.discountCode !== undefined
        ? String(updates.discountCode).trim().toUpperCase()
        : existing.discountCode;

    const finalAmount = calculateFinalAmount(ticketPrice, code);
    if (finalAmount === null) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid discount code" });
    }
    updates.finalAmount = finalAmount;

    const updated = await Registration.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Registration updated",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRegistration = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid registration ID format" });
    }

    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    res.status(200).json({ success: true, message: "Registration deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration,
};