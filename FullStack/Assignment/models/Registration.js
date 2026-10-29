const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, "Student name is required"],
    trim: true,
    minlength: [3, "Student name must be at least 3 characters"],
    maxlength: [50, "Student name must be at most 50 characters"],
  },
  collegeEmail: {
    type: String,
    required: [true, "College email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.(edu|ac\.in)$/,
      "Must be a valid college email ending in .edu or .ac.in",
    ],
  },
  rollNumber: {
    type: String,
    required: [true, "Roll number is required"],
    uppercase: true,
    match: [
      /^[A-Z0-9]{8,10}$/,
      "Roll number must be alphanumeric and 8 to 10 characters long",
    ],
  },
  eventType: {
    type: String,
    required: [true, "Event type is required"],
    enum: {
      values: ["CODING_HACKATHON", "AI_WORKSHOP", "ROBOTICS", "GAMING"],
      message:
        "Event type must be CODING_HACKATHON, AI_WORKSHOP, ROBOTICS or GAMING",
    },
  },
  teamSize: {
    type: Number,
    required: [true, "Team size is required"],
    min: [1, "Team size must be at least 1"],
    max: [4, "Team size must be at most 4"],
    validate: [
      {
        validator: Number.isInteger,
        message: "Team size must be a whole number",
      },
      {
        validator: function (value) {
          const eventType = this.get("eventType");
          if (eventType === "AI_WORKSHOP") {
            return value === 1;
          }
          return true;
        },
        message: "AI Workshop only permits individual registrations",
      },
    ],
  },
  ticketPrice: {
    type: Number,
    required: [true, "Ticket price is required"],
    min: [0, "Ticket price cannot be negative"],
  },
  discountCode: {
    type: String,
    uppercase: true,
    trim: true,
  },
  finalAmount: {
    type: Number,
  },
  status: {
    type: String,
    enum: {
      values: ["PENDING", "CONFIRMED", "CANCELLED"],
      message: "Status must be PENDING, CONFIRMED or CANCELLED",
    },
    default: "PENDING",
  },
  registrationDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= Date.now();
      },
      message: "Registration date cannot be in the future",
    },
  },
});

module.exports = mongoose.model("Registration", registrationSchema);