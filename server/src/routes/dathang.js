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
  confirmBankTransfer,
  confirmPayment,
  changePaymentMethod,
} = require("../controllers/dathang");

const { protect } =
  require("../middleware/auth");

const { admin } =
  require("../middleware/admin");


// ======================================================
// USER
// ======================================================


// Tạo đơn hàng
router.post(
  "/",
  protect,
  createOrder
);


// Lấy danh sách đơn của chính mình
router.get(
  "/my",
  protect,
  getMyOrders
);


// Hủy đơn hàng
router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);


// Xem chi tiết đơn hàng
router.get(
  "/:id",
  protect,
  getOrderById
);


// Khách xác nhận đã chuyển khoản
router.put(
  "/:id/confirm-bank",
  protect,
  confirmBankTransfer
);


// Khách đổi phương thức thanh toán
router.put(
  "/:id/change-payment",
  protect,
  changePaymentMethod
);



// ======================================================
// ADMIN
// ======================================================


// Thống kê Dashboard
router.get(
  "/admin/thongke",
  protect,
  admin,
  getThongKe
);


// Lấy tất cả đơn hàng
router.get(
  "/admin/all",
  protect,
  admin,
  getAllOrders
);


// Admin cập nhật trạng thái đơn
router.put(
  "/admin/:id/status",
  protect,
  admin,
  updateOrderStatus
);


// Admin xác nhận đã nhận tiền
router.put(
  "/admin/:id/confirm-payment",
  protect,
  admin,
  confirmPayment
);


module.exports = router;