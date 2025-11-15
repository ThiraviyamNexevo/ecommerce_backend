const {
  sequelize,
  User,
  Cart,
  Order,
  OrderItem,
  Product,
  UserAddress,
  InventoryLog,
} = require("../models");
const { success, error } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");
const { sendEmail } = require("../utils/email");
const { orderConfirmationTemplate } = require("../utils/orderTemplate");

// 🛒 Convert Cart → Order
exports.createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { addressId, paymentMethod } = req.body;

  const address = await UserAddress.findOne({
    where: { id: addressId, userId },
  });
  if (!address) return error(res, "Invalid address", 400);

  // Fetch cart items server-side
  const cartItems = await Cart.findAll({
    where: { userId },
    include: [{ model: Product, as: "product" }],
  });
  if (cartItems.length === 0) return error(res, "Cart is empty", 400);

  // Calculate totals
  let subtotal = 0;
  for (const item of cartItems) {
    subtotal += item.quantity * Number(item.product.price);
  }
  const tax = subtotal * 0.18;
  const shipping = subtotal > 1000 ? 0 : 40;
  const total = subtotal + tax + shipping;

  // Start transaction
  const t = await sequelize.transaction();
  try {
    // 1) Validate and deduct stock
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      }); // lock row
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.quantity < item.quantity)
        throw new Error(`Insufficient stock for ${product.name}`);

      const previous = Number(product.quantity);
      const newQty = previous - item.quantity;

      await product.update({ quantity: newQty }, { transaction: t });

      // log inventory
      await InventoryLog.create(
        {
          productId: product.id,
          change: -item.quantity,
          reason: `order:${userId}`, // or `order:${orderId}` later
          previousQuantity: previous,
          newQuantity: newQty,
          adminId: null,
        },
        { transaction: t }
      );
    }

    // 2) Create order
    const order = await Order.create(
      {
        userId,
        addressId,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
        orderStatus: "PENDING",
      },
      { transaction: t }
    );

    // 3) Create order items
    for (const item of cartItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
        { transaction: t }
      );
    }

    // 4) Clear cart
    await Cart.destroy({ where: { userId }, transaction: t });

    await t.commit();

    // AFTER COMMIT: fetch full order details and send email (non-transactional)
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
            { model: Product, as: "product", attributes: ["name", "price"] },
          ],
        },
      ],
    });
    console.log(req.user)

    // send email
    await sendEmail(
      req.user.email,
      "Order Confirmation - #" + order.id,
      orderConfirmationTemplate(req.user, orderDetails, orderDetails.items)
    );

    return success(res, "Order placed successfully", {
      orderId: order.id,
      total,
      paymentMethod,
    });
  } catch (err) {
    if (!t.finished) {
      await t.rollback();
    }

    if (err.message && err.message.startsWith("Insufficient stock")) {
      return error(res, err.message, 400);
    }

    throw err;
  }
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
