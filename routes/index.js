const express = require('express');
const userRouter = require('./users');
const productRouter = require('./products')
const router = express.Router();

/* GET home page. */
router.use("/", userRouter)
router.use("/product", productRouter);

module.exports = router;
