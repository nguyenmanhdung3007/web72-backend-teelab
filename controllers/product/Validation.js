const Joi = require("joi");

const productSchema = Joi.object({
    name: Joi.string().required().message({"any.required": "Tên sản phẩm không được để trống"}),
    slug: Joi.string().required(),
    price: Joi.string().required(),
    countInStock: Joi.string().required(),
    thum: Joi.string().required(),
})