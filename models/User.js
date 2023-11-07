

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
    refreshToken: {
        type: String,
    }
    ,
    userName: {
        type: String,
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
        type: String,
        require: true,
    }, 
    avatar: {
        type: String,
    },
    shippingAddress: {
        address: {type: String, required: true},
        district: {type: String, required: true},
        city: {type: String, required: true},
    },

}, { timestamps: true })

module.exports = mongoose.model("Users", User)