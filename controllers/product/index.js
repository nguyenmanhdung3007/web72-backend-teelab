const productModel = require("../../models/Product.js");
const joi = require("joi");
const variantModel = require("../../models/Variant.js");
const categoryModel = require("../../models/Category.js");

const getProduct = async (req, res) => {
  try {
      const products = await productModel.find()

      return res.status(200).json({ products })
  } catch (error) {
      console.log(error)
      return res.status(400).json({ error: error.message || "Failed" })
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createCategory = async (req, res) => {
  try {
    const name = req.body.name;
    const slug = req.body.slug;

    const newCategory = await categoryModel.create({ name, slug });
    return res
      .status(201)
      .json({ category: newCategory, message: "Tao category thanh cong" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi tạo category" });
  }
};

const createProduct = async (req, res) => {
  const categoryId = req.params.id;
  const category = await categoryModel.findById(categoryId);

  if (!category) {
    return res.status(404).json({ message: "product chưa tồn tại" });
  }
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

    const { name, slug, price, countInStock, thumbnail, detail } = req.body;

    // const validate = productSchema.validate({ name, price, countInStock, thumbnail });
    // if (validate.error) {
    //   return res.status(400).json({ error: validate.error.message });
    // }

    const newProduct = await productModel.create({
      name,
      slug,
      price,
      countInStock,
      thumbnail,
      category,
    });
    return res
      .status(201)
      .json({ product: newProduct, message: "Tao san pham thanh cong" });
  } catch (error) {
    console.log(error);
  }
};

const createVariant = async (req, res) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);

  if (!product) {
    return res.status(400).json({ message: "product chưa tồn tại" });
  }
  try {
    const { image, price, color, size, countInStock } = req.body;
    const newVariant = await variantModel.create({
      productId,
      image,
      price,
      color,
      size,
      countInStock,
    });
    return res
      .status(201)
      .json({ variant: newVariant, message: "Tao variant thanh cong" });
  } catch (error) {
    console.log(error);
  }
};


const deleteProduct = async (req, res) => {
  try {
      const id = req.params.id

      const product = await productModel.findOneAndDelete({ _id: id })

      return res.status(200).json({ message: "Xoa san pham thanh cong" })
  } catch (error) {
      console.log(error)
      return res.status(400).json({ error: error.message || "Failed" })
  }
};

module.exports = {
  getProduct,
  getProductById,
  createProduct,
  createCategory,
  createVariant,
  deleteProduct,
};
