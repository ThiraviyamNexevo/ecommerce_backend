const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../middleware/verifyAdminToken");
const { validateBody } = require("../middleware/validateBody");
const { productSchema } = require("../validators/productValidator");
const productCtrl = require("../controllers/productController");
const upload = require("../middleware/upload"); // multer setup

// Admin protected routes
router.get("/", verifyAdminToken, productCtrl.getAllProducts);
router.get("/:id", verifyAdminToken, productCtrl.getProductById);
router.post("/", verifyAdminToken, upload.single("image"), validateBody(productSchema), productCtrl.createProduct);
router.put("/:id", verifyAdminToken, upload.single("image"), validateBody(productSchema), productCtrl.updateProduct);
router.delete("/:id", verifyAdminToken, productCtrl.deleteProduct);

module.exports = router;
