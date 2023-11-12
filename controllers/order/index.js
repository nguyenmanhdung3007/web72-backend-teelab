const orderSchema = require("../order/validation");
const orderModel = require("../../models/Order.js");
const variantModel = require("../../models/Variant.js");
const productModel = require("../../models/Product.js");

const createOrder = async (req, res) => {
  const input = req.body;
  const userId = req.params.id;

  console.log(input.orderDetail.length);
  const validate = orderSchema.validate(input);

  if (validate.error) {
    return res.status(400).json({ error: validate.error.message });
  }

  try {
    for (let i = 0; i < input.orderDetail.length; i++) {
      const variantId = input.orderDetail[i].variant;
      const variant = await variantModel.findById(variantId);

      //   Check sản phẩm order có nhiều hơn sản phẩm trong kho hay không?
      if (variant.countInStock >= input.orderDetail[i].quantity) {
        console.log(variant.countInStock);
        variant.countInStock -= input.orderDetail[i].quantity;
        const product = await productModel.findById(variant.productId);
        product.countInStock -= input.orderDetail[i].quantity;
        await variant.save();
        await product.save();
      } else {
        return res
          .status(400)
          .json({ message: "Không thể mua quá số lượng sản phẩm có sẵn" });
      }
    }

    const newOrder = await orderModel.create({
      orderedBy: userId,
      shippingAddress: input.shippingAddress,
      orderDetail: input.orderDetail,
      paymentMethod: input.paymentMethod,
      status: input.status,
    });
    return res
      .status(201)
      .json({ order: newOrder, message: "Tao order thanh cong" });
  } catch (error) {
    console.log(error);
  }
};
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId).populate("orderDetail");

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const updateStatusOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    console.log(1);
    const order = await orderModel.findByIdAndUpdate(orderId, status, {
      new: true,
    });
    return res.status(200).json({ message: "update status thành công", order });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
  }
};

const deleteOrder = async (req, res) => {
  // check status nếu bằng = mới cho delete và kiểm tra hoàn tiền
};

const getPagingOrder = async (req, res) => {
  try {
    const pageSize = req.query.pageSize || 5;
    const pageIndex = req.query.pageIndex || 1;

    const order = await orderModel
      .find()
      .populate({ path: "orderedBy", select: "-password" })
      .skip(pageSize * pageIndex - pageSize)
      .limit(pageSize);
    const count = orderModel.countDocuments();
    const totalPage = Math.ceil(count / pageSize);
    return res.status(200).json({ order, count, totalPage });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
  }
};
module.exports = { createOrder, updateStatusOrder, getOrderById, getPagingOrder };
