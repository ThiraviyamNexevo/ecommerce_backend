const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdminToken"); // protects admin routes
const inventoryCtrl = require("../controllers/inventoryController");

// Admin endpoints
router.patch("/product/:id/set", verifyAdmin, inventoryCtrl.updateStock);
router.patch("/product/:id/adjust", verifyAdmin, inventoryCtrl.adjustStock);
router.get("/low-stock", verifyAdmin, inventoryCtrl.getLowStockProducts);
router.get("/logs", verifyAdmin, inventoryCtrl.getInventoryLogs);

module.exports = router;
