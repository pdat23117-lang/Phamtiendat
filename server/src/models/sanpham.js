const mongoose = require("mongoose");

// ==========================================
// PRODUCT SCHEMA
// ==========================================
const ProductSchema = new mongoose.Schema(
  {
    // ========================================
    // TÊN SẢN PHẨM
    // ========================================
    ten: {
      type: String,
      required: true,
    },

    // ========================================
    // GIÁ THEO TỪNG DUNG LƯỢNG
    // Ví dụ:
    // {
    //   "128GB": 19990000,
    //   "256GB": 21990000,
    //   "512GB": 24990000
    // }
    // ========================================
    gia: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // ========================================
    // HÃNG
    // ========================================
    hang: {
      type: String,
      required: true,
    },

    // ========================================
    // ẢNH ĐẠI DIỆN
    // ========================================
    hinh: {
      type: String,
      required: true,
    },

    // ========================================
    // NHIỀU HÌNH ẢNH
    // ========================================
    hinhAnh: {
      type: [String],
      default: [],
    },

    // ========================================
    // BỘ NHỚ
    // ========================================
    bonho: {
      type: [String],
      default: [],
    },

    // ========================================
    // MÀU SẮC
    // ========================================
    mau: {
      type: [String],
      default: [],
    },

    // ========================================
    // BẢO HÀNH
    // ========================================
    baohanh: {
      type: String,
      default: "12 tháng",
    },

    // ========================================
    // MÔ TẢ
    // ========================================
    mota: {
      type: String,
      default: "",
    },

    // ========================================
    // TỒN KHO
    // ========================================
    stock: {
      type: Number,
      default: 10,
    },

    // ========================================
    // SẢN PHẨM NỔI BẬT
    // ========================================
    noibat: {
      type: Boolean,
      default: false,
    },

    // ========================================
    // ĐÁNH GIÁ
    // ========================================
    reviews: [
      {
        // Người đánh giá
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        // Tên người đánh giá
        name: {
          type: String,
          default: "",
        },

        // Số sao
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },

        // Bình luận của khách hàng
        comment: {
          type: String,
          default: "",
        },

        // ====================================
        // PHẢN HỒI CỦA ADMIN
        // ====================================
        adminReply: {
          type: String,
          default: "",
        },

        // Thời gian đánh giá
        createdAt: {
          type: Date,
          default: Date.now,
        },

        // Thời gian admin phản hồi
        repliedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    // ========================================
    // ĐIỂM ĐÁNH GIÁ TRUNG BÌNH
    // ========================================
    averageRating: {
      type: Number,
      default: 0,
    },

    // ========================================
    // TỔNG SỐ ĐÁNH GIÁ
    // ========================================
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