const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    ten: {
      type: String,
      required: true,
    },

    gia: {
      type: Number,
      required: true,
    },

    soluong: {
      type: Number,
      required: true,
      default: 1,
    },

    hinh: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [OrderItemSchema],

    shippingAddress: {
      ten: {
        type: String,
        required: true,
      },

      sodienthoai: {
        type: String,
        required: true,
      },

      diachi: {
        type: String,
        required: true,
      },

      ghichu: {
        type: String,
        default: "",
      },
    },

    tongTien: {
      type: Number,
      required: true,
      default: 0,
    },

    phiVanChuyen: {
      type: Number,
      default: 30000,
    },

    giamGia: {
      type: Number,
      default: 0,
    },

    thanhTien: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "bank", "vnpay", "momo"],
      default: "cod",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipping",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual tổng số lượng
OrderSchema.virtual("tongSoLuong").get(function () {
  return this.items.reduce(
    (tong, item) => tong + item.soluong,
    0
  );
});

OrderSchema.set("toJSON", {
  virtuals: true,
});

OrderSchema.set("toObject", {
  virtuals: true,
});

module.exports = mongoose.model(
  "Order",
  OrderSchema
);