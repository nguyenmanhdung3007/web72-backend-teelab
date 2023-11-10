const express = require('express');
const {authentication} = require('../middlewares/authenticator.js');
const { authorization } = require('../middlewares/authorization.js');

const { getAllOrder,getOrdersToday, getOrderDate, getOrderMonth, getOrderYear } = require('../controllers/statistical');

const statisticalRouter = express.Router();

statisticalRouter.get('/', getAllOrder);
statisticalRouter.get('/order-today', getOrdersToday);
statisticalRouter.get('/order-day', getOrderDate);
statisticalRouter.get('/order-month', getOrderMonth);
statisticalRouter.get('/order-year', getOrderYear);

module.exports = statisticalRouter;
