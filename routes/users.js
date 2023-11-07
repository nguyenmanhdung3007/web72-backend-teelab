const express = require('express');
const { login, register, getAllUser, updateUser, deleteUser, refeshToken } = require('../controllers/userControler/index.js');
const {authentication} = require('../middlewares/authenticator.js');
const { authorization } = require('../middlewares/authorization.js');
const userRouter = express.Router();

// userRouter.get("/", () => {
//   console.log("Chạy vào userRouter")
// })

userRouter.post("/login", login)  
userRouter.post("/register",authentication, authorization, register) // chỉ khi đăng nhập mới sửa dc rule  
userRouter.put("/:id",authentication,authorization, updateUser)    
userRouter.delete("/:id",authentication, authorization, deleteUser)    
userRouter.get("/",authentication,authorization, getAllUser)
userRouter.get("/refeshToken/:id", refeshToken)  
userRouter.detete("/logout", logOut)


module.exports = userRouter;
