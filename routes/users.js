const express = require('express');
const userRouter = express.Router();

userRouter.get("/", () => {
  console.log("Chạy vào userRouter")
})

module.exports = userRouter;
