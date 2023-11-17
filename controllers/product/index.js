const productModel = require("../../models/Product.js");
const joi = require("joi");
const variantModel = require("../../models/Variant.js");
const categoryModel = require("../../models/Category.js");
const { productSchema, variantSchema } = require("./validation.js");
const orderModel = require("../../models/Order.js");

const getAllProduct = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category")
      .populate("variants");
    return res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message || "Failed" });
  }
};
const getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    return res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const getAllProductPaging = async (req, res) => {
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
    const totalPage = Math.ceil(count / pageSize);

    return res.status(200).json({ products, count, totalPage });
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
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res
        .status(200)
        .json({ status: "error", message: "Hãy thêm sản productId" });
    }
    const product = await productModel
      .findById(productId)
      .populate("category")
      .populate("variants");
    console.log(product.priceDetail);

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed" });
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
      .json({
        product: newProduct,
        priceAfterSale: priceAfterSale,
        message: "Tao san pham thanh cong",
      });
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

module.exports = {
  getAllProduct,
  getAllCategory,
  getAllProductPaging,
  getProductById,
  createProduct,
  createCategory,
  updateProduct,
  deleteProduct,
  getProductByCategory,
};
