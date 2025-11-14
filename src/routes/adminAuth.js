const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
// const isAdmin = require("../middleware/isAdmin");
const { login, enable2FA, verify2FA } = require("../controllers/adminAuthController");

// Public
router.post("/login", login);
router.post("/verify-2fa", verify2FA);

// Protected (Admin only)
router.post("/enable-2fa", verifyToken, enable2FA);

module.exports = router;
