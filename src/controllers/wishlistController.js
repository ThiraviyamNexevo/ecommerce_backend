const { Wishlist, Product } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");
const { success, error } = require("../utils/response");

// ADD TO WISHLIST
exports.addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  // check product exists
  const product = await Product.findByPk(productId);
  if (!product) return error(res, "Invalid product", 400);

  // prevent duplicates
  const exists = await Wishlist.findOne({ where: { userId, productId } });
  if (exists) return error(res, "Already in wishlist", 400);

  await Wishlist.create({ userId, productId });

  return success(res, "Added to wishlist");
});

// REMOVE FROM WISHLIST
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const item = await Wishlist.findOne({ where: { userId, productId } });
  if (!item) return error(res, "Item not found in wishlist", 404);

  await item.destroy();

  return success(res, "Removed from wishlist");
});

// GET USER'S WISHLIST
exports.getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const items = await Wishlist.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "name", "price", "image"],
      },
    ],
    order: [["id", "DESC"]],
  });

  return success(res, "Wishlist fetched", items);
});
