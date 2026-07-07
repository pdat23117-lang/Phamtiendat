const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      required: true,
    },

    gia: {
      type: Number,
      required: true,
    },

    hang: {
      type: String,
      required: true,
    },

    hinh: {
      type: String,
      required: true,
    },

    ram: {
      type: String,
      default: "",
    },

    bonho: {
      type: String,
      default: "",
    },

    mau: {
      type: String,
      default: "",
    },

    baohanh: {
      type: String,
      default: "12 tháng",
    },

    mota: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 10,
    },

    noibat: {
      type: Boolean,
      default: false,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        name: String,

        rating: Number,

        comment: String,

        adminReply: {
          type: String,
          default: "",
        },

        repliedAt: Date,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  ProductSchema
);