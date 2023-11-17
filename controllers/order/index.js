const orderSchema = require("../order/validation");
const orderModel = require("../../models/Order.js");
const variantModel = require("../../models/Variant.js");
const productModel = require("../../models/Product.js");
const userModel = require("../../models/User.js");

const createOrder = async (req, res) => {
  const input = req.body;
  const userId = req.user._id;
  const userCart = await userModel
    .findById(userId)
    .select("cart")
    .populate("cart.variant");

  //   userCart.cart = [];
  //   await userCart.save();

  // return res.json({
  //   success: userCart ? true : false,
  //   rs: userCart ? userCart : "something went wrong",
  // });
  console.log(userCart.cart.length === 0);

  const validate = orderSchema.validate(input);

  if (validate.error) {
    return res.status(400).json({ error: validate.error.message });
  }

  try {
    if (userCart.cart.length === 0) {
      return res.status(200).json({
        status: "ERR",
        message: "Không có sản phẩm trong giỏ hàng",
      });
    }
    let totalPrice = 0;
    for (let i = 0; i < userCart?.cart.length; i++) {
      const variantId = userCart.cart[i].variant;
      const variant = await variantModel.findById(variantId);

      console.log(userCart.cart[i].variant.countInStock);
      console.log(userCart.cart[i].quantity);

      if (userCart.cart[i].variant?.countInStock >= userCart.cart[i].quantity) {
        console.log(variant.countInStock);
        variant.countInStock -= userCart.cart[i].quantity;
        const product = await productModel.findById(variant.productId);
        product.countInStock -= userCart.cart[i].quantity;
        // Tính giá của order
        if (!variant.priceDetail.saleRatio) {
          const price = variant.priceDetail.price * userCart.cart[i].quantity;
          Math.round((totalPrice += price));
          console.log(price);
        } else {
          const price =
            variant.priceDetail.priceAfterSale * userCart.cart[i].quantity;
          Math.round((totalPrice += price) / 1000) * 1000;
        }
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
      orderDetail: userCart.cart,
      paymentMethod: input.paymentMethod,
      status: input.status,
      totalPrice: totalPrice,
    });

    userCart.cart = [];
    await userCart.save();
    console.log(userCart);

    return res.status(201).json({
      order: newOrder,
      message: "Tao order thanh cong",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed" });
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
    if (!status || !orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId and status is required",
      });
    }
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      {
        new: true,
      }
    );
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







// paypal
const generateAccessToken = async (next) => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
    next()
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const createOrderPayPal = async (cart) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrderPayPal() callback:",
    cart
  );

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00",
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

const createOrderPaymentPaypal = async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const {_id} = req.user
    const { orderDetail, totalPrice, shippingAddress } = req.body;
    // const { jsonResponse, httpStatusCode } = await createOrderPayPal(cart);
    const rs = await orderModel.create({orderDetail, totalPrice, orderBy: _id})
    // res.status(httpStatusCode).json(jsonResponse);
    return res.json({
        success: userCart ? true : false,
        rs: userCart ? userCart : "something went wrong",
      });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

const createCaptureOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};

module.exports = {
  createOrder,
  updateStatusOrder,
  getOrderById,
  getPagingOrder,
  createOrderPaymentPaypal,
  createCaptureOrder
};
