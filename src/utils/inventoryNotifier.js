const { Product } = require("../models");

/**
 * Basic low-stock checker. Call it after updates.
 * threshold default 5
 */
exports.checkLowStock = async (productId, threshold = 5) => {
  const product = await Product.findByPk(productId, { attributes: ['id','name','quantity'] });
  if (!product) return;
  if (product.quantity <= threshold) {
    // extend: send email / push notification to admin
    console.warn(`⚠️ Low stock: ${product.name} (id:${product.id}) — quantity: ${product.quantity}`);
  }
};
