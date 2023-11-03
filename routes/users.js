const express = require('express');
const { login, register, getAllUser, updateUser } = require('../controllers/userControler/index.js');
const {authentication} = require('../middlewares/authenticator.js');
const { authorization } = require('../middlewares/authorization.js');
const userRouter = express.Router();

// userRouter.get("/", () => {
//   console.log("Chạy vào userRouter")
// })

userRouter.post("/login", login)  
userRouter.post("/register", register)  
userRouter.post("/:id", updateUser)  
userRouter.get("/",authentication,authorization, getAllUser)  



module.exports = userRouter;
