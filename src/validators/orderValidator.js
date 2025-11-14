const Joi = require("joi");

exports.orderSchema = Joi.object({
  addressId: Joi.number().required(),
  paymentMethod: Joi.string().valid("COD", "ONLINE").required(),
});
