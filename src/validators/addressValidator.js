const Joi = require("joi");

exports.addressSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a text value",
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be a valid 10-digit number",
      "any.required": "Phone number is required",
    }),

  pincode: Joi.string().required().messages({
    "string.empty": "Pincode is required",
    "any.required": "Pincode is required",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),

  city: Joi.string().required().messages({
    "string.empty": "City is required",
    "any.required": "City is required",
  }),

  state: Joi.string().required().messages({
    "string.empty": "State is required",
    "any.required": "State is required",
  }),

  landmark: Joi.string().allow("", null),

  isDefault: Joi.boolean().optional(),
});
