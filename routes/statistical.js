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

const {
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductPaging,
  createCategory,
} = require("../controllers/product/index.js");

const statisticalRouter = express.Router();

statisticalRouter.get("/", getAllOrder);
statisticalRouter.get("/order-today", getOrdersToday);
statisticalRouter.get("/order-day", getOrderDate);
statisticalRouter.get("/order-month", getOrderMonth);
statisticalRouter.get("/order-year", getOrderYear);

// user
statisticalRouter.get("/order", authentication, authorization, getPagingOrder);

// product
statisticalRouter.post(
  "/create-category",
  authentication,
  authorization,
  createCategory
);
statisticalRouter.get(
  "/product/get-by-category",
  authentication,
  authorization,
  getProductByCategory
);
statisticalRouter.get("/product/get-all-paging", getAllProductPaging);
statisticalRouter.post(
  "/product/:id",
  authentication,
  authorization,
  createProduct
);
statisticalRouter.put(
  "/product/:id",
  authentication,
  authorization,
  updateProduct
);
statisticalRouter.delete(
  "/product/:id",
  authentication,
  authorization,
  deleteProduct
);
// variant

// order
// statisticalRouter.get("/order/all",authentication,authorization, getAllOrder);

module.exports = statisticalRouter;
