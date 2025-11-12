const { error } = require("../utils/response");

// ✅ Global error handler
module.exports = (err, req, res, next) => {
  console.error("🔥 Error caught:", err);

  // Handle Sequelize validation errors
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map((e) => e.message);
    return error(res, "Database validation failed", 400, messages);
  }

  // Custom known errors
  if (err.statusCode) {
    return error(res, err.message, err.statusCode);
  }

  // Default
  return error(res, "Internal Server Error", 500);
};
