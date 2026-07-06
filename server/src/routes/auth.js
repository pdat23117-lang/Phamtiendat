const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  getUsers,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// Đăng ký - đăng nhập
router.post("/register", register);
router.post("/login", login);

// Quên mật khẩu
router.post("/forgot-password", forgotPassword);
router.put(
  "/reset-password/:token",
  resetPassword
);

// Thông tin cá nhân
router.get("/me", protect, getMe);
router.put(
  "/profile",
  protect,
  updateProfile
);
router.put(
  "/change-password",
  protect,
  changePassword
);

// Admin
router.get(
  "/users",
  protect,
  admin,
  getUsers
);

module.exports = router;