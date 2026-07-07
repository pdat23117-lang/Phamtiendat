const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// ===========================
// ĐĂNG KÝ
// ===========================

const register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Vui lòng nhập đầy đủ thông tin",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Mật khẩu tối thiểu 6 ký tự",
      });
    }

    const emailRegex =
      /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Email không hợp lệ",
      });
    }

    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message:
          "Email đã được sử dụng",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name: name.trim(),
        email:
          email.toLowerCase(),
        password:
          hashedPassword,
      });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token:
        generateToken(
          user._id
        ),
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Lỗi server",
    });

  }
};

// ===========================
// ĐĂNG NHẬP
// ===========================

const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Vui lòng nhập email và mật khẩu",
      });

    }

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (!user) {

      return res.status(401).json({
        success: false,
        message:
          "Email hoặc mật khẩu không đúng",
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message:
          "Email hoặc mật khẩu không đúng",
      });

    }

    res.json({

      success: true,

      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      token:
        generateToken(
          user._id
        ),

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Lỗi server",
    });

  }

};
// ===========================
// LẤY THÔNG TIN USER
// ===========================

const getMe = async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy người dùng",
      });

    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });

  }

};

// ===========================
// LẤY DANH SÁCH USER
// ===========================

const getUsers = async (req, res) => {

  try {

    const users =
      await User.find({})
        .select("-password")
        .sort({
          createdAt: -1,
        });

    res.json(users);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });

  }

};

// ===========================
// CẬP NHẬT HỒ SƠ
// ===========================

const updateProfile =
async (req, res) => {

  try {

    const {
      name,
      phone,
      address,
      avatar,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy người dùng",
      });

    }

    if (name)
      user.name = name.trim();

    if (phone !== undefined)
      user.phone = phone;

    if (address !== undefined)
      user.address = address;

    if (avatar !== undefined)
      user.avatar = avatar;

    await user.save();

    res.json({

      success: true,

      message:
        "Cập nhật thành công",

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        address:
          user.address,

        avatar:
          user.avatar,

        role: user.role,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Lỗi server",
    });

  }

};

// ===========================
// ĐỔI MẬT KHẨU
// ===========================

const changePassword =
async (req, res) => {

  try {

    const {

      currentPassword,

      newPassword,

    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Vui lòng nhập đầy đủ thông tin",
      });

    }

    if (newPassword.length < 6) {

      return res.status(400).json({
        success: false,
        message:
          "Mật khẩu mới tối thiểu 6 ký tự",
      });

    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy người dùng",
      });

    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message:
          "Mật khẩu hiện tại không đúng",
      });

    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    res.json({

      success: true,

      message:
        "Đổi mật khẩu thành công",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Lỗi server",
    });

  }

};
// ===========================
// QUÊN MẬT KHẨU
// ===========================

const forgotPassword =
async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email",
      });

    }

    const user =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (!user) {

      return res.json({
        success: true,
        message:
          "Nếu email tồn tại, hệ thống đã gửi liên kết đặt lại mật khẩu.",
      });

    }

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken =
      hashedToken;

    user.resetPasswordExpire =
      Date.now() +
      15 * 60 * 1000;

    await user.save();

    const resetUrl =

`${process.env.CLIENT_URL}/resetmatkhau/${resetToken}`;

    const html = `

      <h2>Đặt lại mật khẩu</h2>

      <p>Xin chào ${user.name},</p>

      <p>Nhấn vào liên kết dưới đây để đặt lại mật khẩu:</p>

      <a href="${resetUrl}">
        ${resetUrl}
      </a>

      <p>Liên kết có hiệu lực trong 15 phút.</p>

    `;

    await sendEmail(

      user.email,

      "Đặt lại mật khẩu DAT MOBILE",

      html

    );

    res.json({

      success: true,

      message:
        "Liên kết đặt lại mật khẩu đã được gửi tới email.",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: "Lỗi server",

    });

  }

};

// ===========================
// RESET PASSWORD
// ===========================

const resetPassword =
async (req, res) => {

  try {

    const hashedToken =

      crypto

        .createHash("sha256")

        .update(req.params.token)

        .digest("hex");

    const user =
      await User.findOne({

        resetPasswordToken:
          hashedToken,

        resetPasswordExpire: {
          $gt: Date.now(),
        },

      });

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          "Liên kết không hợp lệ hoặc đã hết hạn.",

      });

    }

    const { password } =
      req.body;

    if (!password) {

      return res.status(400).json({

        success: false,

        message:
          "Vui lòng nhập mật khẩu mới",

      });

    }

    if (password.length < 6) {

      return res.status(400).json({

        success: false,

        message:
          "Mật khẩu tối thiểu 6 ký tự",

      });

    }
        user.password =
      await bcrypt.hash(
        password,
        10
      );

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpire =
      undefined;

    await user.save();

    res.json({

      success: true,

      message:
        "Đặt lại mật khẩu thành công",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Lỗi server",

    });

  }

};

// ===========================
// XÓA USER (ADMIN)
// ===========================

const deleteUser =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "Không tìm thấy người dùng",

      });

    }

    await user.deleteOne();

    res.json({

      success: true,

      message:
        "Đã xóa người dùng",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Lỗi server",

    });

  }

};

// ===========================
// KHÓA / MỞ KHÓA USER
// ===========================

const toggleUserStatus =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "Không tìm thấy người dùng",

      });

    }

    user.isActive =
      !user.isActive;

    await user.save();

    res.json({

      success: true,

      message:
        user.isActive
          ? "Đã mở khóa tài khoản"
          : "Đã khóa tài khoản",

      user,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Lỗi server",

    });

  }

};
// ===========================
// CẬP NHẬT QUYỀN USER (ADMIN)
// ===========================

const updateUserRole =
async (req, res) => {

  try {

    const { role } =
      req.body;

    if (
      !["user", "admin"].includes(role)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Quyền không hợp lệ",

      });

    }

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "Không tìm thấy người dùng",

      });

    }

    user.role = role;

    await user.save();

    res.json({

      success: true,

      message:
        "Cập nhật quyền thành công",

      user,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Lỗi server",

    });

  }

};

// ===========================
// TÌM USER THEO ID (ADMIN)
// ===========================

const getUserById =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "Không tìm thấy người dùng",

      });

    }

    res.json({

      success: true,

      user,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Lỗi server",

    });

  }

};
module.exports = {

  register,

  login,

  getMe,

  getUsers,

  getUserById,

  updateProfile,

  changePassword,

  forgotPassword,

  resetPassword,

  updateUserRole,

  toggleUserStatus,

  deleteUser,

};