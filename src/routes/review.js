const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const reviewCtrl = require("../controllers/reviewController");

// Add
router.post("/", verifyToken, reviewCtrl.addReview);

// Update
router.put("/:reviewId", verifyToken, reviewCtrl.updateReview);

// Delete
router.delete("/:reviewId", verifyToken, reviewCtrl.deleteReview);

// Product Reviews
router.get("/product/:productId", reviewCtrl.getProductReviews);

module.exports = router;
