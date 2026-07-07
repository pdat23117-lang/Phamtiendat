require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("./src/models/sanpham");

const products = require("./products.json");

const seedDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "✅ Đã kết nối MongoDB"
    );

    await Product.deleteMany();

    console.log(
      "🗑️ Đã xóa dữ liệu cũ"
    );

    await Product.insertMany(
      products
    );

    console.log(
      `✅ Đã thêm ${products.length} sản phẩm`
    );

    process.exit();
  } catch (err) {
    console.log(err);

    process.exit(1);
  }
};

seedDB();