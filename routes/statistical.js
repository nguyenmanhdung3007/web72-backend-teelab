const express = require('express');
const {authentication} = require('../middlewares/authenticator.js');
const { authorization } = require('../middlewares/authorization.js');

const { productRevenue } = require('../controllers/statistical');

const statisticalRouter = express.Router();

statisticalRouter.get('/', productRevenue)

module.exports = statisticalRouter;
