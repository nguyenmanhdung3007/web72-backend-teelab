

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
    }, 
    avatar: {
        type: String,
    },
    shippingAddress: {
        address: {type: String},
        district: {type: String},
        city: {type: String},
    },

}, { timestamps: true })

module.exports = mongoose.model("Users", User)