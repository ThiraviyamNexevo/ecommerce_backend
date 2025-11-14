const { Product, Category, SubCategory } = require('../models')
const { success, error } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");
const { logAdminActivity } = require("../utils/logger");
const path = require("path");

// ✅ CREATE
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, categoryId, subCategoryId } =
    req.body;

  // Optional: handle image upload
  let image = null;
  if (req.file) {
    image = req.file.filename;
  }

  const category = await Category.findByPk(categoryId);
  if (!category) return error(res, "Invalid category", 400);

  const product = await Product.create({
    name,
    description,
    price,
    quantity,
    image,
    categoryId,
    subCategoryId,
  });

  logAdminActivity(req.admin?.id, "Created product", { name });
  return success(res, "Product created successfully", product);
});

// ✅ READ ALL
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: SubCategory, as: "subCategory", attributes: ["id", "name"] },
    ],
    order: [["id", "ASC"]],
  });
 
  if (!products) return error(res, "Product not found", 404);
  return success(res, "Products fetched successfully", products);
});

// ✅ READ SINGLE
exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, {
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: SubCategory, as: "subCategory", attributes: ["id", "name"] },
    ],
  });
  if (!product) return error(res, "Product not found", 404);
  return success(res, "Product fetched successfully", product);
});

// ✅ UPDATE
exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) return error(res, "Product not found", 404);

  const { name, description, price, quantity, categoryId, subCategoryId } =
    req.body;
  let image = product.image;

  if (req.file) {
    image = req.file.filename;
  }

  await product.update({
    name,
    description,
    price,
    quantity,
    image,
    categoryId,
    subCategoryId,
  });
  logAdminActivity(req.admin?.id, "Updated product", { id });
  return success(res, "Product updated successfully", product);
});

// ✅ DELETE
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) return error(res, "Product not found", 404);

  await product.destroy();
  logAdminActivity(req.admin?.id, "Deleted product", { id });
  return success(res, "Product deleted successfully");
});
