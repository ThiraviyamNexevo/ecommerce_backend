const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { validateBody } = require("../middleware/validateBody");
const { productSchema } = require("../validators/productValidator");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// ✅ Auth required for all routes
router.post("/", verifyToken, validateBody(productSchema), createProduct);
router.get("/", verifyToken, getAllProducts);
router.put("/:id", verifyToken, validateBody(productSchema), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;
