const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

module.exports = (req, res, next) => {
  try {
    // ✅ Token should come from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(res, "Access denied. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify JWT using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request
    req.user = decoded;

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
