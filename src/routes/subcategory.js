const express = require("express");
const router = express.Router();

const verifyAdminToken = require("../middleware/verifyAdminToken");
const { validateBody } = require("../middleware/validateBody");
const { subCategorySchema } = require("../validators/subCategoryValidator");
const subCategoryCtrl = require("../controllers/subCategoryController");

// Admin Protected Routes
router.get("/", verifyAdminToken, subCategoryCtrl.getAllSubCategories);
router.get("/:id", verifyAdminToken, subCategoryCtrl.getSubCategoryById);
router.post("/", verifyAdminToken, validateBody(subCategorySchema), subCategoryCtrl.createSubCategory);
router.put("/:id", verifyAdminToken, validateBody(subCategorySchema), subCategoryCtrl.updateSubCategory);
router.delete("/:id", verifyAdminToken, subCategoryCtrl.deleteSubCategory);

module.exports = router;
