const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const wishlistCtrl = require("../controllers/wishlistController");

router.post("/add", verifyToken, wishlistCtrl.addToWishlist);
router.delete("/remove/:productId", verifyToken, wishlistCtrl.removeFromWishlist);
router.get("/", verifyToken, wishlistCtrl.getWishlist);

module.exports = router;
