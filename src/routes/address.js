const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { validateBody } = require("../middleware/validateBody");
const { addressSchema } = require("../validators/addressValidator");
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

// ✅ Auth required for all routes
router.post("/", verifyToken, validateBody(addressSchema), createAddress);
router.get("/", verifyToken, getAddresses);
router.put("/:id", verifyToken, validateBody(addressSchema), updateAddress);
router.delete("/:id", verifyToken, deleteAddress);

module.exports = router;
