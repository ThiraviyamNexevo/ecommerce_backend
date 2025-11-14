const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const { validateBody } = require("../middleware/validateBody");
const { cartSchema } = require("../validators/cartValidator");
const cartCtrl = require("../controllers/cartController");

router.post("/", verifyToken, validateBody(cartSchema), cartCtrl.addToCart);
router.get("/", verifyToken, cartCtrl.getCart);
router.put("/:id", verifyToken, cartCtrl.updateQuantity);
router.delete("/:id", verifyToken, cartCtrl.removeItem);
router.delete("/", verifyToken, cartCtrl.clearCart);

module.exports = router;
