const { Product, InventoryLog } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");
const { success, error } = require("../utils/response");
const { checkLowStock } = require("../utils/inventoryNotifier");

// Admin: update stock directly (set absolute quantity)
exports.updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params; // product id
  const { quantity, reason = "admin:update" } = req.body;
  const adminId = req.admin?.id || null;

  const product = await Product.findByPk(id);
  if (!product) return error(res, "Product not found", 404);

  const previous = Number(product.quantity || 0);
  await product.update({ quantity });

  await InventoryLog.create({
    productId: product.id,
    change: Number(quantity) - previous,
    reason,
    previousQuantity: previous,
    newQuantity: Number(quantity),
    adminId,
  });

  await checkLowStock(product.id);
  return success(res, "Stock updated", { id: product.id, quantity: product.quantity });
});

// Admin: adjust stock by delta (positive or negative)
exports.adjustStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { delta, reason = "admin:adjust" } = req.body;
  const adminId = req.admin?.id || null;

  const product = await Product.findByPk(id);
  if (!product) return error(res, "Product not found", 404);

  const previous = Number(product.quantity || 0);
  const newQty = previous + Number(delta);

  if (newQty < 0) return error(res, "Resulting stock cannot be negative", 400);

  await product.update({ quantity: newQty });

  await InventoryLog.create({
    productId: product.id,
    change: Number(delta),
    reason,
    previousQuantity: previous,
    newQuantity: newQty,
    adminId,
  });

  await checkLowStock(product.id);
  return success(res, "Stock adjusted", { id: product.id, quantity: newQty });
});

// Admin: list low-stock products
exports.getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = Number(req.query.threshold || 5);
  const products = await Product.findAll({
    where: { quantity: { [require("sequelize").Op.lte]: threshold } },
    attributes: ['id','name','quantity'],
    order: [['quantity','ASC']]
  });
  return success(res, "Low stock products", products);
});

// View inventory logs (admin)
exports.getInventoryLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const logs = await InventoryLog.findAndCountAll({
    include: [{ model: Product, as: "product", attributes: ["id","name"] }],
    order: [["createdAt","DESC"]],
    limit: Number(limit),
    offset
  });

  return success(res, "Inventory logs fetched", {
    total: logs.count,
    page: Number(page),
    pages: Math.ceil(logs.count / limit),
    data: logs.rows
  });
});
