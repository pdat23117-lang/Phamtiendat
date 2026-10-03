const mongoose = require("mongoose");

// ==============================
// CART ITEM
// ==============================
const CartItemSchema = new mongoose.Schema({

  sanpham: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  bonho: {
    type: String,
    required: true
  },

  mau: {
    type: String,
    required: true
  },

  soluong: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  }

  // KHÔNG thêm _id: false
  // Mongoose sẽ tự tạo _id cho mỗi item
});


// ==============================
// CART
// ==============================
const CartSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  items: {
    type: [CartItemSchema],
    default: []
  }

}, {
  timestamps: true
});


module.exports = mongoose.model(
  "Cart",
  CartSchema
);