const Joi = require("joi");

exports.subCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  categoryId: Joi.number().integer().required().messages({
    "any.required": "Category ID is required",
    "number.base": "Category ID must be a valid number"
  }),
});
