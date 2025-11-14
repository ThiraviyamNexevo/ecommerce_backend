const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../middleware/verifyAdminToken");
const { validateBody } = require("../middleware/validateBody");
const { categorySchema } = require("../validators/categoryValidator");
const categoryCtrl = require("../controllers/categoryController");

router.get("/", verifyAdminToken, categoryCtrl.getAllCategories);
router.post("/", verifyAdminToken, validateBody(categorySchema), categoryCtrl.createCategory);
router.put("/:id", verifyAdminToken, validateBody(categorySchema), categoryCtrl.updateCategory);
router.delete("/:id", verifyAdminToken, categoryCtrl.deleteCategory);

module.exports = router;
