const { Review, Product, User } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");
const { success, error } = require("../utils/response");
const { Op } = require("sequelize");


// ⭐ ADD REVIEW
exports.addReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5)
    return error(res, "Rating must be between 1 and 5", 400);

  const product = await Product.findByPk(productId);
  if (!product) return error(res, "Invalid product", 400);

  // prevent duplicate reviews
  const exists = await Review.findOne({ where: { userId, productId } });
  if (exists) return error(res, "You already reviewed this product", 400);

  const newReview = await Review.create({
    userId,
    productId,
    rating,
    review,
  });

  return success(res, "Review added successfully", newReview);
});


// ⭐ EDIT REVIEW
exports.updateReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;
  const { rating, review } = req.body;

  const existing = await Review.findOne({
    where: { id: reviewId, userId },
  });

  if (!existing) return error(res, "Review not found", 404);

  await existing.update({ rating, review });

  return success(res, "Review updated successfully", existing);
});


// ⭐ DELETE REVIEW
exports.deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { reviewId } = req.params;

  const existing = await Review.findOne({
    where: { id: reviewId, userId },
  });

  if (!existing) return error(res, "Review not found", 404);

  await existing.destroy();

  return success(res, "Review deleted successfully");
});


// ⭐ GET PRODUCT REVIEWS
exports.getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;

  const reviews = await Review.findAndCountAll({
    where: { productId },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: Number(limit),
    offset,
  });

  // calculate average rating
  const avg = await Review.findOne({
    where: { productId },
    attributes: [[Review.sequelize.fn("AVG", Review.sequelize.col("rating")), "avgRating"]],
    raw: true,
  });

  return success(res, "Reviews fetched", {
    total: reviews.count,
    averageRating: Number(avg.avgRating || 0).toFixed(1),
    page: Number(page),
    pages: Math.ceil(reviews.count / limit),
    data: reviews.rows,
  });
});
