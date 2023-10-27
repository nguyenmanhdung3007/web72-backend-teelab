const express = require('express');
const userRouter = require('./users');
const router = express.Router();

/* GET home page. */
router.use("/user", userRouter)

module.exports = router;
