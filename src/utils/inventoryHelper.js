const { Product, InventoryLog } = require("../models");
const { checkLowStock } = require("./inventoryNotifier");

exports.restoreStockForOrder = async (orderId, items, adminId = null) => {
  // items is array of { productId, quantity }
  for (const it of items) {
    const product = await Product.findByPk(it.productId);
    if (!product) continue;
    const previous = Number(product.quantity || 0);
    const newQty = previous + Number(it.quantity);
    await product.update({ quantity: newQty });

    await InventoryLog.create({
      productId: product.id,
      change: Number(it.quantity),
      reason: `restore:order:${orderId}`,
      previousQuantity: previous,
      newQuantity: newQty,
      adminId,
    });

    await checkLowStock(product.id);
  }
};
