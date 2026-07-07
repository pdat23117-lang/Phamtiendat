const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    sanpham: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    soluong: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Cart",
  CartSchema
);