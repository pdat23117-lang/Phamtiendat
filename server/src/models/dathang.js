const mongoose = require("mongoose");


// ==============================
// CHI TIẾT SẢN PHẨM TRONG ĐƠN
// ==============================
const OrderItemSchema =
  new mongoose.Schema(
    {

      product: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Product",

        required: true,
      },


      ten: {
        type: String,

        required: true,
      },


      gia: {
        type: Number,

        required: true,

        min: 0,
      },


      soluong: {
        type: Number,

        required: true,

        default: 1,

        min: 1,
      },


      // =========================
      // BỘ NHỚ
      // =========================
      bonho: {
        type: String,

        default: "",
      },


      // =========================
      // MÀU
      // =========================
      mau: {
        type: String,

        default: "",
      },


      // =========================
      // HÌNH ẢNH
      // =========================
      hinh: {
        type: String,

        default: "",
      },

    },

    {
      _id: false,
    }
  );


// ==============================
// ORDER
// ==============================
const OrderSchema =
  new mongoose.Schema(

    {

      // =========================
      // NGƯỜI ĐẶT
      // =========================
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },


      // =========================
      // DANH SÁCH SẢN PHẨM
      // =========================
      items: [
        OrderItemSchema
      ],


      // =========================
      // ĐỊA CHỈ NHẬN HÀNG
      // =========================
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


      // =========================
      // TỔNG TIỀN SẢN PHẨM
      // =========================
      tongTien: {
        type: Number,

        required: true,

        default: 0,

        min: 0,
      },


      // =========================
      // PHÍ VẬN CHUYỂN
      // =========================
      phiVanChuyen: {
        type: Number,

        default: 30000,

        min: 0,
      },


      // =========================
      // GIẢM GIÁ
      // =========================
      giamGia: {
        type: Number,

        default: 0,

        min: 0,
      },


      // =========================
      // THÀNH TIỀN
      // =========================
      thanhTien: {
        type: Number,

        required: true,

        default: 0,

        min: 0,
      },


      // =========================
      // PHƯƠNG THỨC THANH TOÁN
      // =========================
      paymentMethod: {

        type: String,

        enum: [
          "cod",
          "bank",
          "vnpay",
          "momo",
        ],

        default: "cod",
      },
      paymentStatus: {
  type: String,
  enum: [
    "unpaid",
    "waiting",
    "paid",
    "failed"
  ],
  default: "unpaid",
},


      // =========================
      // ĐÃ THANH TOÁN
      // =========================
      isPaid: {
        type: Boolean,

        default: false,
      },


      paidAt: {
        type: Date,

        default: null,
      },


      // =========================
      // TRẠNG THÁI
      // =========================
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


      // =========================
      // GHI CHÚ
      // =========================
      note: {
        type: String,

        default: "",
      },

    },

    {
      timestamps: true,
    }
  );


// ==============================
// VIRTUAL: TỔNG SỐ LƯỢNG
// ==============================
OrderSchema.virtual(
  "tongSoLuong"
).get(function () {

  return this.items.reduce(
    (tong, item) =>
      tong + item.soluong,
    0
  );

});


// ==============================
// JSON
// ==============================
OrderSchema.set(
  "toJSON",
  {
    virtuals: true,
  }
);


OrderSchema.set(
  "toObject",
  {
    virtuals: true,
  }
);


// ==============================
// EXPORT
// ==============================
module.exports =
  mongoose.model(
    "Order",
    OrderSchema
  );