const express = require("express");
const router = express.Router();

const {
  createLienHe,
  getAllLienHe,
  getLienHeById,
  updateTrangThai,
  deleteLienHe,
} = require("../controllers/lienhe");

const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// =====================================
// KHÁCH HÀNG
// =====================================

// Gửi liên hệ
router.post("/", createLienHe);

// =====================================
// ADMIN
// =====================================

// Danh sách liên hệ
router.get(
  "/admin",
  protect,
  admin,
  getAllLienHe
);

// Chi tiết liên hệ
router.get(
  "/admin/:id",
  protect,
  admin,
  getLienHeById
);

// Đánh dấu đã xử lý
router.put(
  "/admin/:id",
  protect,
  admin,
  updateTrangThai
);

// Xóa liên hệ
router.delete(
  "/admin/:id",
  protect,
  admin,
  deleteLienHe
);

module.exports = router;