const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const paymentCtrl = require("../controllers/paymentController");

// Razorpay routes
router.post("/razorpay/create", verifyToken, paymentCtrl.createRazorpayOrder);
router.post("/razorpay/verify", verifyToken, paymentCtrl.verifyRazorpayPayment);

module.exports = router;
