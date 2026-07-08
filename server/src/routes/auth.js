const express = require("express");

const router = express.Router();

const {

  register,

  login,

  forgotPassword,

  resetPassword,

  getProfile,

  updateProfile,

  changePassword,

  getAllUsers,

  updateUserRole,

  deleteUser,

} = require("../controllers/authController");

const {

  protect,

} = require("../middleware/auth");

const {

  admin,

} = require("../middleware/admin");

// =====================================
// PUBLIC
// =====================================

// Đăng ký
router.post(
  "/register",
  register
);

// Đăng nhập
router.post(
  "/login",
  login
);

// Quên mật khẩu
router.post(
  "/forgot-password",
  forgotPassword
);

// Đặt lại mật khẩu
router.post(
  "/reset-password/:token",
  resetPassword
);

// =====================================
// USER
// =====================================

// Hồ sơ
router.get(
  "/profile",
  protect,
  getProfile
);

// Cập nhật hồ sơ
router.put(
  "/profile",
  protect,
  updateProfile
);

// Đổi mật khẩu
router.put(
  "/change-password",
  protect,
  changePassword
);

// =====================================
// ADMIN
// =====================================

// Danh sách người dùng
router.get(
  "/users",
  protect,
  admin,
  getAllUsers
);

// Cập nhật quyền
router.put(
  "/users/:id/role",
  protect,
  admin,
  updateUserRole
);

// Xóa người dùng
router.delete(
  "/users/:id",
  protect,
  admin,
  deleteUser
);

module.exports = router;