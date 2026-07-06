const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
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

// ======================
// ĐĂNG KÝ
// ======================
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {
      return res.status(400).json({
        message:
          "Email đã được sử dụng",
      });
    }

    const user =
      await User.create({
        name,
        email,
        password,
      });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
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

// ======================
// ĐĂNG NHẬP
// ======================
const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(401).json({
        message:
          "Email hoặc mật khẩu không đúng",
      });
    }

    const isMatch =
      await user.matchPassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json({
        message:
          "Email hoặc mật khẩu không đúng",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
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

// ======================
// LẤY THÔNG TIN USER
// ======================
const getMe = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message:
        "Lỗi server",
    });
  }
};

// ======================
// LẤY DANH SÁCH USER
// ======================
const getUsers =
  async (req, res) => {
    try {
      const users =
        await User.find({}).select(
          "-password"
        );

      res.json(users);
    } catch (error) {
      res.status(500).json({
        message:
          "Lỗi server",
      });
    }
  };

// ======================
// CẬP NHẬT TÊN
// ======================
const updateProfile =
  async (req, res) => {
    try {
      const { name } =
        req.body;

      if (
        !name ||
        !name.trim()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Tên không được để trống",
          });
      }

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "Không tìm thấy người dùng",
          });
      }

      user.name =
        name.trim();

      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Lỗi server",
      });
    }
  };

// ======================
// ĐỔI MẬT KHẨU
// ======================
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
        return res
          .status(400)
          .json({
            message:
              "Vui lòng nhập đầy đủ thông tin",
          });
      }

      if (
        newPassword.length <
        6
      ) {
        return res
          .status(400)
          .json({
            message:
              "Mật khẩu mới tối thiểu 6 ký tự",
          });
      }

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "Không tìm thấy người dùng",
          });
      }

      const isMatch =
        await user.matchPassword(
          currentPassword
        );

      if (!isMatch) {
        return res
          .status(400)
          .json({
            message:
              "Mật khẩu hiện tại không đúng",
          });
      }

      user.password =
        newPassword;

      await user.save();

      res.json({
        success: true,
        message:
          "Đổi mật khẩu thành công",
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Lỗi server",
      });
    }
  };

// ======================
// QUÊN MẬT KHẨU
// ======================
const forgotPassword =
  async (req, res) => {
    try {
      const user =
        await User.findOne({
          email:
            req.body.email,
        });

      if (!user) {
        return res.json({
          message:
            "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi.",
        });
      }

      const resetToken =
        crypto
          .randomBytes(32)
          .toString(
            "hex"
          );

      user.resetPasswordToken =
        crypto
          .createHash(
            "sha256"
          )
          .update(
            resetToken
          )
          .digest(
            "hex"
          );

      user.resetPasswordExpire =
        Date.now() +
        15 *
          60 *
          1000;

      await user.save();

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await sendEmail(
        user.email,
        "Đặt lại mật khẩu - DAT MOBILE",
        `
        <p>Xin chào ${user.name}</p>
        <p>Nhấn vào link bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetUrl}">
          ${resetUrl}
        </a>
        `
      );

      res.json({
        message:
          "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi.",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Lỗi server",
      });
    }
  };

// ======================
// RESET MẬT KHẨU
// ======================
const resetPassword =
  async (req, res) => {
    try {
      const hashedToken =
        crypto
          .createHash(
            "sha256"
          )
          .update(
            req.params
              .token
          )
          .digest(
            "hex"
          );

      const user =
        await User.findOne(
          {
            resetPasswordToken:
              hashedToken,
            resetPasswordExpire:
              {
                $gt:
                  Date.now(),
              },
          }
        );

      if (!user) {
        return res
          .status(400)
          .json({
            message:
              "Link không hợp lệ hoặc đã hết hạn",
          });
      }

      if (
        !req.body
          .password ||
        req.body.password
          .length < 6
      ) {
        return res
          .status(400)
          .json({
            message:
              "Mật khẩu tối thiểu 6 ký tự",
          });
      }

      user.password =
        req.body
          .password;

      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpire =
        undefined;

      await user.save();

      res.json({
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

module.exports = {
  register,
  login,
  getMe,
  getUsers,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};