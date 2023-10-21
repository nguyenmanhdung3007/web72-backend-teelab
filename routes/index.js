const express = require('express');
const userRouter = require('./users');
const router = express.Router();

/* GET home page. */
router.use("/", userRouter)

module.exports = router;
