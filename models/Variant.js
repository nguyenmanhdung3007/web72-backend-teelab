const  mongoose = require("mongoose");

const variantModel = new mongoose.Schema({
    productId: { type: mongoose.Types.ObjectId, ref: "product" },
    image: [{type: String}],
    price: { type: Number,},
    color: { type: String,},
    size: { type: String,},
    counInStock: { type: Number,}
}, {timestamps: true})

module.exports = mongoose.model("variants", variantModel)