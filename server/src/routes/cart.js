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
// GIỎ HÀNG CỦA NGƯỜI DÙNG
// ==============================


// ==============================
// Lấy giỏ hàng
// GET /cart
// ==============================
router.get(
  "/",
  protect,
  getCart
);


// ==============================
// Thêm sản phẩm vào giỏ
// POST /cart
// ==============================
router.post(
  "/",
  protect,
  addToCart
);


// ==============================
// Cập nhật số lượng
// PUT /cart/item/:itemId
// ==============================
router.put(
  "/item/:itemId",
  protect,
  updateCart
);


// ==============================
// Xóa một dòng sản phẩm
// DELETE /cart/item/:itemId
// ==============================
router.delete(
  "/item/:itemId",
  protect,
  removeCartItem
);


// ==============================
// Xóa toàn bộ giỏ hàng
// DELETE /cart
// ==============================
router.delete(
  "/",
  protect,
  clearCart
);


module.exports = router;