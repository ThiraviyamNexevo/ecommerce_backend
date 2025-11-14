const { Cart, Product } = require("../models");
const { success, error } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");

// 🛒 Add to Cart
exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findByPk(productId);
  if (!product) return error(res, "Product not found", 404);

  // Check if product already in cart
  let cartItem = await Cart.findOne({ where: { userId, productId } });

  if (cartItem) {
    // update quantity if exists
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    cartItem = await Cart.create({ userId, productId, quantity });
  }

  return success(res, "Item added to cart", cartItem);
});

// 🛒 Get User Cart
exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findAll({
    where: { userId },
    include: [{ model: Product, as: "product" }],
  });

  return success(res, "Cart fetched successfully", cart);
});

// 🛒 Update Quantity
exports.updateQuantity = asyncHandler(async (req, res) => {
  const { id } = req.params; // cart item ID
  const { quantity } = req.body;

  const cart = await Cart.findByPk(id);
  if (!cart) return error(res, "Cart item not found", 404);

  cart.quantity = quantity;
  await cart.save();

  return success(res, "Quantity updated", cart);
});

// 🛒 Remove single item
exports.removeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cart = await Cart.findByPk(id);
  if (!cart) return error(res, "Cart item not found", 404);

  await cart.destroy();
  return success(res, "Item removed from cart");
});

// 🗑 Clear cart
exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await Cart.destroy({ where: { userId } });

  return success(res, "Cart cleared");
});
