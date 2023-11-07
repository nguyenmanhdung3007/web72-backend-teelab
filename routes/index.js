const express = require('express');
const userRouter = require('./users');
const productRouter = require('./products');
const orderRouter = require('./order');
const variantRouter = require('./variants')
const router = express.Router();

/* GET home page. */
router.use("/user", userRouter)
router.use("/product", productRouter);
router.use("/order", orderRouter)
router.use("/variant", variantRouter)

module.exports = router;
