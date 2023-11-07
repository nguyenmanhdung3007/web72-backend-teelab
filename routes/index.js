const express = require('express');
const userRouter = require('./users');
const productRouter = require('./products')
const statisticalRouter = require('./statistical')
const router = express.Router();

/* GET home page. */
router.use("/user", userRouter)
router.use("/product", productRouter);
router.use("/admin", statisticalRouter)
module.exports = router;
