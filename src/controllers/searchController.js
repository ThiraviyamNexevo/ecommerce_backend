const { Product, Category, SubCategory } = require("../models");
const { success } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");
const { Op } = require("sequelize");

// SEARCH + FILTER + SORT + PAGINATION
exports.searchProducts = asyncHandler(async (req, res) => {
  const {
    q,                // search keyword
    categoryId,       // category filter
    subCategoryId,    // subcategory filter
    minPrice,         // minimum price
    maxPrice,         // maximum price
    sort,             // price_low_high / price_high_low
    page = 1,         // pagination
    limit = 10,
  } = req.query;

  const offset = (page - 1) * limit;

  // Build dynamic filters
  let where = {};

  // 🔍 Keyword Search
  if (q) {
    where.name = { [Op.iLike]: `%${q}%` };
  }

  // 🟦 Category filter
  if (categoryId) where.categoryId = categoryId;

  // 🟧 Subcategory filter
  if (subCategoryId) where.subCategoryId = subCategoryId;

  // 💰 Price Filter
  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }

  // 📌 Sorting
  let order = [];

  if (sort === "price_low_high") order.push(["price", "ASC"]);
  if (sort === "price_high_low") order.push(["price", "DESC"]);
  if (sort === "newest") order.push(["createdAt", "DESC"]);

  // 🔥 Fetch Products
  const products = await Product.findAndCountAll({
    where,
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: SubCategory, as: "subCategory", attributes: ["id", "name"] },
    ],
    order,
    limit: Number(limit),
    offset,
  });

  return success(res, "Products fetched successfully", {
    total: products.count,
    page: Number(page),
    pages: Math.ceil(products.count / limit),
    data: products.rows,
  });
});
