

import mongoose from "mongoose";


const User = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "customer"
    },
    phone: {
        type: Number,
    },
    avatar: {
        type: String,
    },
    shippingAddress: {
        address: {type: String, require: true}
        district: {type: String, require: true}
        city: {type: String, require: true}
    },
}, {timestamps: true})


export default mongoose.model("Users", User)