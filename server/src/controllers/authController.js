const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// =====================================
// ĐĂNG KÝ
// =====================================

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
        message:
          "Vui lòng nhập đầy đủ thông tin",
      });

    }

    const emailExists =
      await User.findOne({
        email,
      });

    if (emailExists) {

      return res.status(400).json({
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

        name,

        email,

        password:
          hashedPassword,

      });

    res.status(201).json({

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

      message:
        "Lỗi server",

    });

  }

};

// =====================================
// ĐĂNG NHẬP
// =====================================

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);

    const user = await User.findOne({ email });

    console.log("User:", user);

    if (!user) {
      return res.status(401).json({
        message: "Không tìm thấy user",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Match:", match);

    if (!match) {
      return res.status(401).json({
        message: "Sai mật khẩu",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Lỗi server",
    });

  }
};
// =====================================
// LẤY HỒ SƠ CÁ NHÂN
// =====================================

const getProfile = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    if (!user) {

      return res.status(404).json({

        message:
          "Không tìm thấy người dùng",

      });

    }

    res.json(user);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Lỗi server",

    });

  }

};

// =====================================
// CẬP NHẬT HỒ SƠ
// =====================================

const updateProfile = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {

      return res.status(404).json({

        message:
          "Không tìm thấy người dùng",

      });

    }

    user.name =
      req.body.name ||
      user.name;

    user.phone =
      req.body.phone ??
      user.phone;

    user.address =
      req.body.address ??
      user.address;

    user.avatar =
      req.body.avatar ??
      user.avatar;

    await user.save();

    res.json({

      _id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      address: user.address,

      avatar: user.avatar,

      role: user.role,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Lỗi server",

    });

  }

};

// =====================================
// ĐỔI MẬT KHẨU
// =====================================

const changePassword = async (
  req,
  res
) => {

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

        message:
          "Vui lòng nhập đầy đủ thông tin",

      });

    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {

      return res.status(404).json({

        message:
          "Không tìm thấy người dùng",

      });

    }

    const match =
      await bcrypt.compare(

        currentPassword,

        user.password

      );

    if (!match) {

      return res.status(400).json({

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

      message:
        "Lỗi server",

    });

  }

};
// =====================================
// QUÊN MẬT KHẨU
// =====================================

const forgotPassword = async (
  req,
  res
) => {

  try {

    const { email } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res.json({

        message:
          "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.",

      });

    }

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    user.resetPasswordToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordExpire =
      Date.now() +
      15 * 60 * 1000;

    await user.save();

    const resetUrl =

`${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(

      user.email,

      "Đặt lại mật khẩu DAT MOBILE",

      `
      <h2>Xin chào ${user.name}</h2>

      <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>

      <p>Nhấn vào liên kết bên dưới:</p>

      <a href="${resetUrl}">
      ${resetUrl}
      </a>

      <p>Liên kết sẽ hết hạn sau 15 phút.</p>
      `

    );

    res.json({

      message:
        "Liên kết đặt lại mật khẩu đã được gửi.",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Lỗi server",

    });

  }

};

// =====================================
// RESET MẬT KHẨU
// =====================================

const resetPassword = async (
  req,
  res
) => {

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

        message:
          "Liên kết không hợp lệ hoặc đã hết hạn",

      });

    }

    if (
      !req.body.password ||
      req.body.password.length < 6
    ) {

      return res.status(400).json({

        message:
          "Mật khẩu tối thiểu 6 ký tự",

      });

    }

    user.password =
      await bcrypt.hash(
        req.body.password,
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

      message:
        "Lỗi server",

    });

  }

};
// =====================================
// LẤY DANH SÁCH NGƯỜI DÙNG (ADMIN)
// =====================================

const getAllUsers = async (
  req,
  res
) => {

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

      message:
        "Lỗi server",

    });

  }

};

// =====================================
// CẬP NHẬT QUYỀN NGƯỜI DÙNG
// =====================================

const updateUserRole = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({

        message:
          "Không tìm thấy người dùng",

      });

    }

    const { role } =
      req.body;

    if (
      role !== "user" &&
      role !== "admin"
    ) {

      return res.status(400).json({

        message:
          "Quyền không hợp lệ",

      });

    }

    user.role = role;

    await user.save();

    res.json({

      success: true,

      message:
        "Cập nhật quyền thành công",

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Lỗi server",

    });

  }

};
// =====================================
// XÓA NGƯỜI DÙNG
// =====================================

const deleteUser = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({

        message:
          "Không tìm thấy người dùng",

      });

    }

    if (user.role === "admin") {

      return res.status(400).json({

        message:
          "Không thể xóa tài khoản Admin",

      });

    }

    await user.deleteOne();

    res.json({

      success: true,

      message:
        "Xóa người dùng thành công",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Lỗi server",

    });

  }

};
module.exports = {

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

};