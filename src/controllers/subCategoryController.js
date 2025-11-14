const { SubCategory, Category } = require("../models");
const { success, error } = require("../utils/response");
const asyncHandler = require("../middleware/asyncHandler");
const { logAdminActivity } = require("../utils/logger");

// ✅ CREATE SubCategory
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, categoryId } = req.body;

  // check category validity
  const category = await Category.findByPk(categoryId);
  if (!category) return error(res, "Invalid category ID", 400);

  const subCategory = await SubCategory.create({ name, categoryId });

  logAdminActivity(req.admin?.id, "Created subcategory", {
    name,
    categoryId,
  });

  return success(res, "SubCategory created successfully", subCategory);
});

// ✅ GET ALL SubCategories
exports.getAllSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.findAll({
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
    order: [["id", "ASC"]],
  });
  return success(res, "SubCategories fetched successfully", subCategories);
});

// ✅ GET SINGLE SubCategory
exports.getSubCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByPk(id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });

  if (!subCategory) return error(res, "SubCategory not found", 404);

  return success(res, "SubCategory fetched successfully", subCategory);
});

// ✅ UPDATE SubCategory
exports.updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, categoryId } = req.body;

  const subCategory = await SubCategory.findByPk(id);
  if (!subCategory) return error(res, "SubCategory not found", 404);

  if (categoryId) {
    const category = await Category.findByPk(categoryId);
    if (!category) return error(res, "Invalid category ID", 400);
  }

  await subCategory.update({ name, categoryId });
  logAdminActivity(req.admin?.id, "Updated subcategory", { id });

  return success(res, "SubCategory updated successfully", subCategory);
});

// ✅ DELETE SubCategory
exports.deleteSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByPk(id);
  if (!subCategory) return error(res, "SubCategory not found", 404);

  await subCategory.destroy();
  logAdminActivity(req.admin?.id, "Deleted subcategory", { id });

  return success(res, "SubCategory deleted successfully");
});
