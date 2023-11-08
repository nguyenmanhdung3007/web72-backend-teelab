const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required(),
  priceDetail: Joi.object({
    price: Joi.number().required(),
    saleRatio: Joi.number().required(),
  }),
  countInStock: Joi.number().required(),
  detailProduct: Joi.object({
    material: Joi.string(),
    form: Joi.string(),
    color: Joi.string(),
    design: Joi.string(),
    image: Joi.string(),
  }).required(),
});

const variantSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  color: Joi.string().required(),
  size: Joi.string().required(),
  countInStock: Joi.number().positive().integer().required(),
});

module.exports = { productSchema, variantSchema };
