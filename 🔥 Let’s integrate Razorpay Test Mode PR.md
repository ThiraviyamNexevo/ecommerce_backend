🔥 Let’s integrate Razorpay Test Mode PROPERLY (Full Implementation)

Below is the complete, production-grade Razorpay Payment setup built for your existing order & email system.

🧱 1. Install Razorpay SDK
npm install razorpay
npm install crypto

🧱 2. Add Razorpay Test Keys to .env

Login:
👉 https://dashboard.razorpay.com/app/keys

Use TEST MODE keys:

RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=your_test_secret

🧱 3. Razorpay Utility

📄 src/utils/razorpay.js

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;

🧱 4. Payment Controller

📄 src/controllers/paymentController.js

🟧 Step 1: Create Razorpay Payment Order
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const { Order } = require("../models");
const { success, error } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");

exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findByPk(orderId);

  if (!order) return error(res, "Order not found", 404);

  if (order.paymentMethod !== "ONLINE")
    return error(res, "Payment method must be ONLINE", 400);

  const options = {
    amount: Number(order.total * 100), // Razorpay uses paise
    currency: "INR",
    receipt: "order_" + order.id,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  return success(res, "Payment order created", {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key_id: process.env.RAZORPAY_KEY_ID,
    orderId: order.id,
  });
});

🟩 Step 2: Verify Razorpay Payment Signature
exports.verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    return error(res, "Payment verification failed", 400);

  // Update order status in DB
  await Order.update(
    {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
    },
    { where: { id: orderId } }
  );

  return success(res, "Payment successful", {
    orderId,
    paymentId: razorpay_payment_id,
  });
});

🧱 5. Create Routes

📄 src/routes/payment.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const paymentCtrl = require("../controllers/paymentController");

// Razorpay routes
router.post("/razorpay/create", verifyToken, paymentCtrl.createRazorpayOrder);
router.post("/razorpay/verify", verifyToken, paymentCtrl.verifyRazorpayPayment);

module.exports = router;


Register in your server:

app.use("/api/payment", require("./routes/payment"));

🧪 6. Testing Razorpay Flow (Postman + Browser)
Step A — Place Order

paymentMethod = "ONLINE"

Your order create API returns (example):

orderId = 12

Step B — Create Razorpay Order

POST → /api/payment/razorpay/create

BODY:

{
  "orderId": 12
}


Response:

{
  "razorpayOrderId": "order_NHd9Nk01234",
  "amount": 200000,
  "currency": "INR",
  "key_id": "rzp_test_123456",
  "orderId": 12
}

Step C — Frontend Opens Razorpay Checkout

Test cards (provided by Razorpay):

Test card:

4111 1111 1111 1111
Expiry: any future date
CVV: 111


UPI test:

success@razorpay

Step D — Razorpay returns payment details

Frontend sends this to backend:

POST → /api/payment/razorpay/verify

{
  "razorpay_order_id": "order_NHd9Nk01234",
  "razorpay_payment_id": "pay_NHdjk3124",
  "razorpay_signature": "generated_signature",
  "orderId": 12
}


Backend verifies it → marks order as PAID & CONFIRMED.

🎉 Result

Your order module now supports:

✔ Razorpay Test Mode
✔ Online payments
✔ Payment verification
✔ Secure signature validation
✔ Automatic order update

VERY stable for production and testing.

https://api.razorpay.com/v1/checkout/embedded?key_id=rzp_test_RfWyhwBMmFiP30&order_id=order_RfXEVJbZk7j0j3

Card Number: 4111 1111 1111 1111
Expiry: any future date
CVV: 111

https://api.razorpay.com/v1/payments/pay_RfXaVbwNrzx2uR/callback/b9e370a07704a69359e0298d3d92654acc7de16a/rzp_test_RfWyhwBMmFiP30?status=authorized&token_recurring_status=rejected&language_code=en