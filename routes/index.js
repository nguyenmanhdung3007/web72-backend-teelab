const express = require('express');
const userRouter = require('./users');
const productRouter = require('./products')
const statisticalRouter = require('./statistical')
const orderRouter = require('./orders');
const variantRouter = require('./variants')
const categoryRouter = require('./categories')
const router = express.Router();

/* GET home page. */
router.use("/user", userRouter)
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/order", orderRouter)
router.use("/variant", variantRouter)

router.use("/admin", statisticalRouter)


module.exports = router;
