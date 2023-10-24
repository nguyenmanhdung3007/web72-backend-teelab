

import mongoose from "mongoose";


const User = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "customer"
    },
    name:{
        type: String,
    },
    age: {
        type: Number,
    },
})

// const User = mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         default: "customer"
//     },
//     name: {
//         type: String,
//     },
//     age: {
//         type: Number,
//     }
// }
//     //Ecommerce
// )


export default mongoose.model("Users", User)