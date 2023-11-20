const express = require("express");
const { authentication } = require("../middlewares/authenticator.js");
const { authorization } = require("../middlewares/authorization.js");

const { getOrdersToday, getOrderDate, getOrderMonth, getOrderYear, getNewUserDay, getNewUserMonth, getNewUserYear } = require('../controllers/statistical');

const { getPagingOrder } = require("../controllers/order/index.js");

const { getProductByCategory } = require("../controllers/product/index.js");

const statisticalRouter = express.Router();

statisticalRouter.get("/order-today", getOrdersToday);
statisticalRouter.get("/order-day", getOrderDate);
statisticalRouter.get("/order-month", getOrderMonth);
statisticalRouter.get("/order-year", getOrderYear);

// user
statisticalRouter.get("/order", authentication, authorization, getPagingOrder);

// product
statisticalRouter.get("/product/get-by-category", authentication, authorization, getProductByCategory);

// variant


//user 
statisticalRouter.get('/user-day', getNewUserDay);
statisticalRouter.get('/user-month', getNewUserMonth);
statisticalRouter.get('/user-year', getNewUserYear);

module.exports = statisticalRouter;
