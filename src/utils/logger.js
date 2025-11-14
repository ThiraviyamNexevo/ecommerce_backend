const fs = require("fs");
const path = require("path");

// Simple log file setup
const logFilePath = path.join(__dirname, "../../logs/admin-activity.log");

// Ensure log directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

/**
 * ✅ Logs admin activity (action, details, etc.)
 * @param {number|string} adminId
 * @param {string} action
 * @param {object} details
 */
const logAdminActivity = (adminId, action, details = {}) => {
  const log = {
    timestamp: new Date().toISOString(),
    adminId,
    action,
    details,
  };

  const line = JSON.stringify(log) + "\n";
  fs.appendFileSync(logFilePath, line, "utf8");

  console.log(`📝 Admin Activity Logged: ${action}`);
};

// Export properly
module.exports = { logAdminActivity };
