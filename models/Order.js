const mongoose = require('mongoose')

const order = mongoose.Schema({
    orderedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },

    orderDetail: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "products",
            },
            quantity: {type: Number, default: 1},
            thumbnail: {type: String,},
            price: {type: String, required: true},
        }
    ],
    shippingAddress: {
        address: {type: String, required: true}
        district: {type: String, required: true}
        city: {type: String, required: true}
    },
    paymentMethod: {
        type: String,
        required: true,
        defautlt: "Thanh toán khi nhận hàng",
    },
    

    status: {
        type: String,
        enum: ["pending", "canceled", "delivering"]
    }
}, {timestamps: true})

module.exports =  mongoose.Model("orders", order)

