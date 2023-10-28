const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    slug: { type: String, required: true },
    price: {
      type: {
        price: Number,
        saleRatio: Number,
      },
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
    //   required: true,
      ref: "categories",
    },
    counInStock: { type: Number, default: 0 },
    thumbnail: { type: String, required: true },
    detail: {
      type: String,
    //   required: true,
    },
    variants: [{ type: mongoose.Types.ObjectId, ref: "variants"}]
  },
  {
    timestamps: true,
  }
  // Economic
);

module.exports = mongoose.model("products", productSchema);
