const mongoose = require("mongoose");

const LienHeSchema = new mongoose.Schema(
  {
    hoTen: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    soDienThoai: {
      type: String,
      default: "",
    },

    tieuDe: {
      type: String,
      required: true,
    },

    noiDung: {
      type: String,
      required: true,
    },

    trangThai: {
      type: String,
      enum: [
        "chuaxuly",
        "daxuly",
      ],
      default: "chuaxuly",
    },

    ghiChuAdmin: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "LienHe",
  LienHeSchema
);