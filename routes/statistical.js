const express = require("express");
const { authentication } = require("../middlewares/authenticator.js");
const { authorization } = require("../middlewares/authorization.js");

const {
  getAllOrder,
  getOrdersToday,
  getOrderDate,
  getOrderMonth,
  getOrderYear,
} = require("../controllers/statistical");
const { getPagingOrder } = require("../controllers/order/index.js");

const { getProductByCategory } = require("../controllers/product/index.js");

const statisticalRouter = express.Router();

statisticalRouter.get("/", getAllOrder);
statisticalRouter.get("/order-today", getOrdersToday);
statisticalRouter.get("/order-day", getOrderDate);
statisticalRouter.get("/order-month", getOrderMonth);
statisticalRouter.get("/order-year", getOrderYear);

// user
statisticalRouter.get("/order", getPagingOrder);

// product
statisticalRouter.get("/product/get-by-category", getProductByCategory);

// variant


// order

module.exports = statisticalRouter;
