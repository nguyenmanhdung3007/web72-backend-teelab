const mongoose = require('mongoose')

const orderModel = mongoose.Schema({
    orderedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },

    orderDetail: [
        {
            variant: {
                type: mongoose.Types.ObjectId,
                ref: "variants",
            },
            quantity: {type: Number, default: 1},
        }
    ],
    shippingAddress: {
        address: {type: String, required: true},
        district: {type: String, required: true},
        city: {type: String, required: true}
    },
    paymentMethod: {
        type: String,
        required: true,
        defautlt: "1",
    },
    

    status: {
        type: String,
        enum: ["0", "1", "2"]
    }
}, {timestamps: true})

module.exports =  mongoose.model("orders", orderModel)

