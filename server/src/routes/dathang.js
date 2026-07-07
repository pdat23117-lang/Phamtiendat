const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getThongKe,
} = require("../controllers/dathang");

const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// =========================
// USER
// =========================

// Tạo đơn hàng
router.post("/", protect, createOrder);

// Lấy danh sách đơn của chính mình
router.get("/my", protect, getMyOrders);

// Hủy đơn hàng
router.put("/:id/cancel", protect, cancelOrder);

// Xem chi tiết đơn hàng
router.get("/:id", protect, getOrderById);

// =========================
// ADMIN
// =========================

// Thống kê dashboard
router.get(
  "/admin/thongke",
  protect,
  admin,
  getThongKe
);

// Danh sách tất cả đơn hàng
router.get(
  "/admin/all",
  protect,
  admin,
  getAllOrders
);

// Cập nhật trạng thái đơn hàng
router.put(
  "/admin/:id/status",
  protect,
  admin,
  updateOrderStatus
);

module.exports = router;