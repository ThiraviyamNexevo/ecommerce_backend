const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { validateBody } = require("../middleware/validateBody");

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

module.exports = router;
