const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "Đã kết nối MongoDB"
    );
  } catch (error) {
    console.log(
      "Lỗi MongoDB"
    );
    console.log(error.message);
  }
};

module.exports = connectDB;