const { Product } = require("../models");
const { error } = require("../utils/response");

/**
 * Expects req.body.items = [{ productId, quantity }, ...]
 * Use this middleware on the endpoint that creates the order before actual creation.
 */
module.exports = async (req, res, next) => {
  try {
    const items = req.body.items || []; // prefer items array for atomic flow
    if (!Array.isArray(items) || items.length === 0) {
      return error(res, "Cart items required", 400);
    }

    for (const it of items) {
      const { productId, quantity } = it;
      const product = await Product.findByPk(productId, { attributes: ['id','name','quantity'] });
      if (!product) return error(res, `Product not found: ${productId}`, 404);
      if (product.quantity < quantity) {
        return error(res, `Insufficient stock for ${product.name}`, 400);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};
