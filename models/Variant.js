const mongoose = require("mongoose");

const variantModel = new mongoose.Schema(
  {
    productId: { type: mongoose.Types.ObjectId, ref: "products" },
    name: { type: String },
    image: { type: String },
    price: {
      price: { type: Number, required: true },
      saleRatio: { type: Number, required: true },
      priceAfterSale: {type: Number ,required: true},
    },
    color: { type: String },
    size: { type: String },
    countInStock: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("variants", variantModel);
