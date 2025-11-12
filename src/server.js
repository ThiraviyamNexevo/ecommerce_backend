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

// ✅ Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
