const Joi = require("joi");
const { error } = require("../utils/response");

// ✅ Validation wrapper
exports.validateBody = (schema) => (req, res, next) => {
  const { error: validationError } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false, // reject unknown keys (default)
  });

  if (validationError) {
    const messages = validationError.details.map((d) => d.message);
    return error(res, "Validation failed", 400, messages);
  }

  next();
};
