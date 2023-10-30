const express = require('express');
const { login, register, getAllUser } = require('../controllers/user.js');
const authentication = require('../middlewares/authenticator.js');
const userRouter = express.Router();

// userRouter.get("/", () => {
//   console.log("Chạy vào userRouter")
// })

userRouter.post("/login", login)  
userRouter.post("/register", register)  
userRouter.get("/",authentication, getAllUser)  



module.exports = userRouter;
