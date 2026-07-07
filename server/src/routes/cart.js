const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/auth");

// ==============================
// Giỏ hàng của người dùng
// ==============================

// Lấy giỏ hàng
router.get("/", protect, getCart);

// Thêm sản phẩm vào giỏ
router.post("/", protect, addToCart);

// Cập nhật số lượng sản phẩm
router.put("/:productId", protect, updateCart);

// Xóa một sản phẩm khỏi giỏ
router.delete("/:productId", protect, removeCartItem);

// Xóa toàn bộ giỏ hàng
router.delete("/", protect, clearCart);

module.exports = router;