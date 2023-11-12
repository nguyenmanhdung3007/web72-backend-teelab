const productModel = require("../../models/Product.js");
const joi = require("joi");
const variantModel = require("../../models/Variant.js");
const categoryModel = require("../../models/Category.js");
const { variantSchema } = require("./validation.js");
const orderModel = require("../../models/Order.js");

const getVariantById = async (req, res) => {
  try {
    const variantId = req.params.id;

    const variant = await variantModel
      .findById(variantId)
      .populate("productId");

    return res.status(200).json({ variant });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const createVariant = async (req, res) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);

  if (!product) {
    return res.status(400).json({ message: "product chưa tồn tại" });
  }
  try {
    const { name, image, price, color, size, countInStock } = req.body;

    const validate = variantSchema.validate({
      name,
      price,
      color,
      size,
      countInStock,
    });
    if (validate.error) {
      return res.status(400).jon({ error: validate.error.message });
    }
    const newVariant = await variantModel.create({
      productId,
      name,
      image,
      price,
      color,
      size,
      countInStock,
    });

    product.variants.push(newVariant._id);
    product.countInStock += newVariant.countInStock;
    console.log(product.countInStock);
    await product.save();
    return res
      .status(201)
      .json({ variant: newVariant, message: "Tao variant thanh cong" });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const updateVariant = async (req, res) => {
  const variantId = req.params.id;
  const variant = await variantModel.findById(variantId);
  const product = await productModel.findById(variant.productId);
  const preVariantCountInStock = variant.countInStock;
  try {
    const { name, image, price, color, size, countInStock } = req.body;
    const updated = await variantModel.findByIdAndUpdate(variantId, req.body, {
      new: true,
    });
    // Kiểm tra thay đổi countInStock
    if (preVariantCountInStock != updated.countInStock) {
      product.countInStock =
        product.countInStock - preVariantCountInStock + updated.countInStock;
      await product.save();
    }
    if (JSON.stringify(product._id) === JSON.stringify(updated.productId)) {
      const productChanged = await productModel.findById(updated.productId);
      // Xóa variant trong product cũ + bớt productCountInStock
      product.countInStock -= variant.countInStock;
      product.variants = product.variants.filter(
        (item) => JSON.stringify(item) !== JSON.stringify(variant._id)
      );
      await product.save();

      // thêm variant trong product mới + thêm productCounInStock
      productChanged.variants.push(variant._id);
      productChanged.countInStock += updated.countInStock;
      await productChanged.save();
      // console.log(arrayVariant);

      // Thêm cả logic cho đơn hàng khi chỉnh sửa giá mà variant có trong order
    }
    return res
      .status(200)
      .json({ message: "update sản phẩm thành công", updated });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const deleteVariant = async (req, res) => {
  const variantId = req.params.id;
  const variant = await variantModel.findById(variantId);
  const product = await productModel.findById(variant.productId);
  try {
    // check variant có trong order không

    // Xóa variant
    const variantDeleted = await variantModel.findByIdAndDelete({
      _id: variantId,
    });
    // trừ sản phẩm trong product
    product.countInStock -= variant.countInStock;
    await product.save();
    return res.status(200).json({ message: "Xoa san pham thanh cong" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

module.exports = {
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
};
