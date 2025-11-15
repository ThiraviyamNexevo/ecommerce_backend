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
