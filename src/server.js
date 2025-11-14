const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const errorHandler = require("./middleware/errorHandler");

// Middlewares
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/address", require("./routes/address"));
app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/admin/category", require("./routes/category"));
app.use("/api/admin/subcategory", require("./routes/subcategory"));
app.use("/api/admin/product", require("./routes/product"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/order", require("./routes/order"));


// ✅ Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
