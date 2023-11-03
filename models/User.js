

const mongoose = require('mongoose');


const User = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    birth_year: {
        type: Number,
    }
    ,
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "customer"
    },
    phone: {
        type: String,
        require: true,
    }, 
    avatar: {
        type: String,
    },
    shippingAddress: {
        address: { type: String, require: true },
        district: { type: String, require: true },
        city: { type: String, require: true },
    },

}, { timestamps: true })

module.exports = mongoose.model("Users", User)