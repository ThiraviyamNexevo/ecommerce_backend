const express = require("express");
const router = express.Router();
const searchCtrl = require("../controllers/searchController");

router.get("/", searchCtrl.searchProducts);

module.exports = router;
