const { User, Cart, Order, OrderItem, Product, UserAddress } = require("../models");
const { success, error } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");
const { sendEmail } = require("../utils/email");
const { orderConfirmationTemplate } = require("../utils/orderTemplate");

// 🛒 Convert Cart → Order
exports.createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { addressId, paymentMethod } = req.body;

  // CHECK ADDRESS
  const address = await UserAddress.findOne({
    where: { id: addressId, userId },
  });
  if (!address) return error(res, "Invalid address", 400);

  // FETCH CART
  const cartItems = await Cart.findAll({
    where: { userId },
    include: [{ model: Product, as: "product" }],
  });

  if (cartItems.length === 0) return error(res, "Cart is empty", 400);

  let subtotal = 0;

  cartItems.forEach((item) => {
    subtotal += item.quantity * Number(item.product.price);
  });

  const tax = subtotal * 0.18; // 18% GST example
  const shipping = subtotal > 1000 ? 0 : 40; // free shipping example
  const total = subtotal + tax + shipping;

  // CREATE ORDER
  const order = await Order.create({
    userId,
    addressId,
    subtotal,
    tax,
    shipping,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
    orderStatus: "PENDING",
  });

  // CREATE ORDER ITEMS
  for (const item of cartItems) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    });
  }

  // CLEAR CART
  //   await Cart.destroy({ where: { userId } });

  // 🔥 FETCH FULL ORDER DETAILS (address + items + product)
  const orderDetails = await Order.findByPk(order.id, {
    include: [
      {
        model: UserAddress,
        as: "address",
        attributes: [
          "name",
          "phone",
          "address",
          "city",
          "state",
          "pincode",
          "landmark",
        ],
      },
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["name", "price"],
          },
        ],
      },
    ],
  });
  const user = await User.findByPk(userId);

  // Send Email
  await sendEmail(
     user.email,
    "Order Confirmation - #" + order.id,
    orderConfirmationTemplate(req.user, orderDetails, orderDetails.items)
  );

  return success(res, "Order placed successfully", {
    orderId: order.id,
    total,
    paymentMethod,
  });
});

// 🧾 FETCH USER ORDERS
exports.getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.findAll({
    where: { userId },
    include: [
      { model: OrderItem, as: "items", include: ["product"] },
      { model: UserAddress, as: "address" },
    ],
    order: [["id", "DESC"]],
  });

  return success(res, "Orders fetched", orders);
});

// 📦 ADMIN — ALL ORDERS
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: OrderItem, as: "items", include: ["product"] },
      { model: UserAddress, as: "address" },
      { model: User, as: "user" },
    ],
    order: [["id", "DESC"]],
  });

  return success(res, "All orders fetched", orders);
});

// 🚚 UPDATE ORDER STATUS (Admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findByPk(id);
  if (!order) return error(res, "Order not found", 404);

  order.orderStatus = status;
  await order.save();

  return success(res, "Order status updated", order);
});
