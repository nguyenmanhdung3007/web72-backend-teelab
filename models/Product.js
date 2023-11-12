const mongoose = require("mongoose");

const productModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    priceDetail: {
      price: { type: Number, required: true },
      saleRatio: { type: Number, required: true },
      priceAfterSale: {type: Number ,required: true},
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "categories",
    },
    countInStock: { type: Number, default: 0 },
    thumbnail: { type: String, required: true },
    detailProduct: {
      material: { type: String },
      form: { type: String },
      color: { type: String },
      design: { type: String },
      image: { type: String },
      // required: true,
    },
    variants: [{ type: mongoose.Types.ObjectId, ref: "variants" }],
  },
  {
    timestamps: true,
  }
  // Economic
);

module.exports = mongoose.model("products", productModel);
