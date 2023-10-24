const express = require('express');
const userRouter = express.Router();

userRouter.get("/", () => {
  console.log("Chạy vào userRouter")
})

userRouter.post("/login", async (req, res) => {
    const {username , password} = req.body;
    console.log(username, password)

    // const user = await find({})
})  

module.exports = userRouter;
