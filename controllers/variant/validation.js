const Joi = require("joi");

const variantSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  color: Joi.string().required(),
  size: Joi.string().required(),
  countInStock: Joi.number().positive().integer().required(),
});

module.exports = { variantSchema };
