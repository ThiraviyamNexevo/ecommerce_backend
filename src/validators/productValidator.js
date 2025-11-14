const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
  categoryId: Joi.number().integer().required(),
  subCategoryId: Joi.number().integer().allow(null),
});
