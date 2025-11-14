const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const { generate2FASecret, verify2FAToken } = require("../utils/twoFactor");
const { success, error } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");
const { logAdminActivity } = require("../utils/logger");

// ✅ Step 1: Enable 2FA (Generate QR)
exports.enable2FA = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.user.id);

  const { secret, qrCode } = await generate2FASecret(admin.email);
  await admin.update({
    twoFactorSecret: secret,
    is2FAEnabled: true,
  });

  return success(res, "2FA enabled successfully", { qrCode });
});

// ✅ Step 2: Login (first step)
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } });

  if (!admin) return error(res, "Admin not found", 404);

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return error(res, "Invalid credentials", 401);

  if (admin.is2FAEnabled) {
    return success(res, "2FA token required", { require2FA: true });
  }

  const token = jwt.sign(
    { id: admin.id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  await admin.update({ lastLoginAt: new Date() });

  return success(res, "Login successful", { token });
});

// ✅ Step 3: Verify 2FA Token
exports.verify2FA = asyncHandler(async (req, res) => {
  const { email, token } = req.body;
  const admin = await Admin.findOne({ where: { email } });

  if (!admin || !admin.is2FAEnabled) return error(res, "2FA not enabled", 400);

  const verified = verify2FAToken(admin.twoFactorSecret, token);
  if (!verified) return error(res, "Invalid or expired 2FA code", 401);

  const jwtToken = jwt.sign(
    { id: admin.id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  await admin.update({ lastLoginAt: new Date() });

  return success(res, "2FA login successful", { token: jwtToken });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name });

  logAdminActivity(req.user.id, "Created category", { name });

  return success(res, "Category created", category);
});
