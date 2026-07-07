require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// ======================
// Kết nối MongoDB
// ======================
connectDB();

// ======================
// Middleware
// ======================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ======================
// Routes
// ======================

app.use(
  "/api/auth",
  require("./routes/auth")
);

app.use(
  "/api/sanpham",
  require("./routes/sanpham")
);

app.use(
  "/api/cart",
  require("./routes/cart")
);

app.use(
  "/api/dathang",
  require("./routes/dathang")
);

app.use(
  "/api/lienhe",
  require("./routes/lienhe")
);

// ======================
// Test server
// ======================

app.get("/", (req, res) => {
  res.send("Server DAT MOBILE đang chạy...");
});

// ======================
// 404
// ======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy API",
  });
});

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server chạy cổng ${PORT}`
  );
});