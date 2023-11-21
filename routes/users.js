const express = require('express');
const { login, register, getAllUser, updateUser, deleteUser, refeshToken, logOut ,getUserById, updateCart, removeVariantInCart} = require('../controllers/userControler/index.js');
const {authentication} = require('../middlewares/authenticator.js');
const { authorization } = require('../middlewares/authorization.js');
const userRouter = express.Router();

// userRouter.get("/", () => {
//   console.log("Chạy vào userRouter")
// })

userRouter.post("/login", login)  
userRouter.post("/register-admin",authentication, authorization, register) // chỉ khi đăng nhập mới sửa dc rule  
userRouter.post("/register", register) 
userRouter.put("/cart",authentication, updateCart)
userRouter.delete("/remove-cart/:id",authentication, removeVariantInCart)
userRouter.put("/:id",authentication, updateUser)    
userRouter.delete("/:id",authentication, authorization, deleteUser)    
userRouter.get("/",authentication,authorization, getAllUser)
userRouter.get("/refeshToken/:id", refeshToken)  
userRouter.get("/:id", getUserById)
userRouter.delete("/logout/:id",authentication, authorization, logOut)



module.exports = userRouter;
