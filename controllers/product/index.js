const productModel = require("../../models/Product.js");
const joi = require("joi");
const variantModel = require("../../models/Variant.js");
const categoryModel = require("../../models/Category.js");
const { productSchema, variantSchema } = require("./validation.js");
const orderModel = require("../../models/Order.js");

const getProduct = async (req, res) => {
  try {
    const pageSize = req.query.pageSize || 10;
    const pageIndex = req.query.pageIndex || 1;
    const products = await productModel
      .find()
      .populate("category")
      .populate("variants")
      .skip(pageSize * pageIndex - pageSize)
      .limit(pageSize);
    const count = await productModel.countDocuments();

    return res.status(200).json({ products, count, totalPage });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel
      .findById(productId)
      .populate({ path: "category" }, { path: "variants" });

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json(error);
  }
};

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
    const { name, slug, priceDetail, countInStock, thumbnail, detailProduct } =
      req.body;

    const validate = productSchema.validate({
      name,
      priceDetail,
      countInStock,
      detailProduct,
    });
    if (validate.error) {
      return res.status(400).json({ error: validate.error.message });
    }

    const newProduct = await productModel.create({
      name,
      slug,
      priceDetail,
      countInStock,
      thumbnail,
      category,
      detailProduct,
    });
    return res
      .status(201)
      .json({ product: newProduct, message: "Tao san pham thanh cong" });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const {
      name,
      slug,
      priceDetail,
      category,
      countInStock,
      thumbnail,
      detailProduct,
      variant,
    } = req.body;

    const product = productModel.findByIdAndUpdate();
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
    product.countInStock = product.countInStock + newVariant.countInStock;
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

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);
    // kiểm tra xem có tồn tại product k
    if (!product) {
      return res.status(400).json({ message: "Sản phẩm không tồn tại" });
    }

    console.log(product.variants);

    // Check xem sản phẩm có tồn tại trong đơn hàng hay không?
    for (let i = 0; i < product.variants.length; i++) {
      const element = product.variants[i];
      const productInOrder = await orderModel.find({
        orderDetail: {
          $elemMatch: {
            variant: element,
          },
        },
        status: { $in: ["2", "1"] },
      });

      const isProductInOrder = productInOrder.length != 0 ? true : false;
      console.log(isProductInOrder);
      if (productInOrder) {
        console.log(1);
      } else {
        console.log(2);
      }
      if (isProductInOrder) {
        return res.status(400).json({
          success: false,
          message: "Có sản phẩm đang tồn tại trong đơn hàng",
        });
      }
      // Nếu không có thì xóa cả các variant bên trong product
      // const variant = await variantModel.findByIdAndDelete(element);
      console.log("xóa các variant bên trong product");
    }

    // const productDeleted = await productModel.findByIdAndDelete({
    //   _id: productId,
    // });
    return res.status(200).json({ message: "Xoa san pham thanh cong" });
  } catch (error) {
    console.log(error);
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

const getPagingProduct = async (req, res) => {
  try {
    const pageSize = req.query.pageSize || 10; // So luong phan tu trong 1 trang
    const pageIndex = req.query.pageIndex || 1; // So trang

    const product = await productModel
      .find()
      .populate("variants")
      .populate("category")
      .skip(pageSize * pageIndex - pageSize)
      .limit(pageSize);
    const count = await productModel.countDocuments();
    const totalPage = Math.ceil(count / pageSize);

    return res.status(200).json({ product, count, totalPage });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const pageSize = req.query.pageSize || 10; // So luong phan tu trong 1 trang
    const pageIndex = req.query.pageIndex || 1;

    const product = await productModel
      .find({ category: category })
      .populate("variants")
      .populate("category")
      .skip(pageSize * pageIndex - pageSize)
      .limit(pageSize);
    const count = await productModel.countDocuments(product);
    const totalPage = Math.ceil(count / pageSize);

    return res.status(200).json(product, count, totalPage);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

module.exports = {
  getProduct,
  getProductById,
  getVariantById,
  createProduct,
  createCategory,
  createVariant,
  updateProduct,
  updateVariant,
  deleteProduct,
  deleteVariant,
  getPagingProduct,
  getProductByCategory,
};
