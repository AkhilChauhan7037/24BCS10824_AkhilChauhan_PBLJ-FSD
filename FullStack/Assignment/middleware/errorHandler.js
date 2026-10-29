const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid data format",
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
};

module.exports = errorHandler;