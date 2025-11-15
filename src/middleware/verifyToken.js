const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    // ✅ Token should come from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(res, "Access denied. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify JWT using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Fetch full user data from DB
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "phone"],
    });

    if (!user) return error(res, "User not found", 404);

    // ✅ Attach user info to request
    req.user = user;

    next(); // Continue to next middleware or controller
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return error(res, "Token expired. Please log in again.", 401);
    }
    if (err.name === "JsonWebTokenError") {
      return error(res, "Invalid token. Please log in again.", 401);
    }
    return error(res, "Authentication failed.", 401);
  }
};
