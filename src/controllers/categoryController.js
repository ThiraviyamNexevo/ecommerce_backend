const { Category } = require("../models");
const { success, error } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");
const { logAdminActivity } = require("../utils/logger");

// ✅ CREATE
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  logAdminActivity(req.admin?.id, "Created category", { name });
  return success(res, "Category created successfully", category);
});

// ✅ READ ALL
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ order: [["id", "ASC"]] });
  return success(res, "Categories fetched successfully", categories);
});

// ✅ UPDATE
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const category = await Category.findByPk(id);
  if (!category) return error(res, "Category not found", 404);
  await category.update({ name, description });
  logAdminActivity(req.admin?.id, "Updated category", { id });
  return success(res, "Category updated successfully", category);
});

// ✅ DELETE
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByPk(id);
  if (!category) return error(res, "Category not found", 404);
  await category.destroy();
  logAdminActivity(req.admin?.id, "Deleted category", { id });
  return success(res, "Category deleted successfully");
});
