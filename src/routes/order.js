const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const { validateBody } = require("../middleware/validateBody");
const { orderSchema } = require("../validators/orderValidator");
const orderCtrl = require("../controllers/orderController");

// USER
router.post("/", verifyToken, validateBody(orderSchema), orderCtrl.createOrder);
router.get("/", verifyToken, orderCtrl.getUserOrders);

// ADMIN
router.get("/admin", verifyAdminToken, orderCtrl.getAllOrders);
router.put("/admin/:id", verifyAdminToken, orderCtrl.updateOrderStatus);

module.exports = router;
