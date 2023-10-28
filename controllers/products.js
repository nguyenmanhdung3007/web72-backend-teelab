const productModel = require("../models/product.js");
const joi = require("joi");
const variantModel = require("../models/variants.js");
const category = require("../models/category.js")

const createProduct = async (req, res) => {
  try {
    // const productSchema = joi
    //   .object({
    //     name: joi.string().required().min(3).max(32).messages({
    //       "string.min": "Tên phải có 3 kí tự trở lên",
    //       "string.max": "Tên phải bé hơn 32 kí tự",
    //       "string.base": "Tên phải là kiểu dữ liệu string",
    //       "any.required": "Tên không được để trống",
    //     }),
    //     price: joi.number().required().messages({
    //       "any.required": "Gía tiền không được bỏ trống",
    //     }),
    //     countInStock: joi.number().required(),
    //   })
    //   .unknown(true);

    const name = req.body.name;
    const slug = req.body.slug;
    const price = req.body.price;
    const countInStock = req.body.countInStock;
    const thumbnail = req.body.thumbnail;
    const detail = req.body.detail;
    // const category = req.body.category;

    // const validate = productSchema.validate({ name, price, countInStock, thumbnail });
    // if (validate.error) {
    //   return res.status(400).json({ error: validate.error.message });
    // }


    const newProduct = await productModel.create({name, slug, price, countInStock, thumbnail, category: req.categoryId});
    return res.status(201).json({ product: newProduct, message: "Tao san pham thanh cong" })
  } catch (error) {
    console.log(error);
  }
};


module.exports = createProduct;