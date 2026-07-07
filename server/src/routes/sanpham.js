const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getAllReviews,
  replyReview,
  deleteReview,
} = require("../controllers/sanpham");

const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// =====================================
// PUBLIC
// =====================================

// Danh sách sản phẩm
router.get("/", getProducts);

// Chi tiết sản phẩm
router.get("/:id", getProductById);

// =====================================
// REVIEW
// =====================================

// Người dùng đánh giá
router.post(
  "/:id/reviews",
  protect,
  createReview
);

// =====================================
// ADMIN REVIEW
// =====================================

// Tất cả đánh giá
router.get(
  "/admin/reviews",
  protect,
  admin,
  getAllReviews
);

// Trả lời đánh giá
router.put(
  "/admin/:productId/reviews/:reviewId/reply",
  protect,
  admin,
  replyReview
);

// Xóa đánh giá
router.delete(
  "/admin/:productId/reviews/:reviewId",
  protect,
  admin,
  deleteReview
);

// =====================================
// ADMIN PRODUCT
// =====================================

// Thêm sản phẩm
router.post(
  "/",
  protect,
  admin,
  createProduct
);

// Sửa sản phẩm
router.put(
  "/:id",
  protect,
  admin,
  updateProduct
);

// Xóa sản phẩm
router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

module.exports = router;