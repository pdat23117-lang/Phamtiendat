const LienHe = require("../models/lienhe");

// ==============================
// Gửi liên hệ
// ==============================
const createLienHe = async (
  req,
  res
) => {
  try {
    const {
      hoTen,
      email,
      soDienThoai,
      tieuDe,
      noiDung,
    } = req.body;

    if (
      !hoTen ||
      !email ||
      !tieuDe ||
      !noiDung
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const lienHe =
      await LienHe.create({
        hoTen,
        email,
        soDienThoai,
        tieuDe,
        noiDung,
      });

    res.status(201).json({
      success: true,
      message:
        "Gửi liên hệ thành công",
      data: lienHe,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Danh sách liên hệ
// ==============================
const getAllLienHe =
  async (req, res) => {
    try {
      const data =
        await LienHe.find().sort({
          createdAt: -1,
        });

      res.json(data);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

// ==============================
// Chi tiết liên hệ
// ==============================
const getLienHeById =
  async (req, res) => {
    try {
      const lienHe =
        await LienHe.findById(
          req.params.id
        );

      if (!lienHe) {
        return res
          .status(404)
          .json({
            message:
              "Không tìm thấy liên hệ",
          });
      }

      res.json(lienHe);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

// ==============================
// Cập nhật trạng thái
// ==============================
const updateTrangThai =
  async (req, res) => {
    try {
      const lienHe =
        await LienHe.findById(
          req.params.id
        );

      if (!lienHe) {
        return res
          .status(404)
          .json({
            message:
              "Không tìm thấy liên hệ",
          });
      }

      if (
        req.body.trangThai
      ) {
        lienHe.trangThai =
          req.body.trangThai;
      }

      if (
        req.body.ghiChuAdmin
      ) {
        lienHe.ghiChuAdmin =
          req.body.ghiChuAdmin;
      }

      await lienHe.save();

      res.json({
        success: true,
        message:
          "Đã cập nhật",
        data: lienHe,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

// ==============================
// Xóa liên hệ
// ==============================
const deleteLienHe =
  async (req, res) => {
    try {
      const lienHe =
        await LienHe.findById(
          req.params.id
        );

      if (!lienHe) {
        return res
          .status(404)
          .json({
            message:
              "Không tìm thấy liên hệ",
          });
      }

      await lienHe.deleteOne();

      res.json({
        success: true,
        message:
          "Đã xóa liên hệ",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

module.exports = {
  createLienHe,
  getAllLienHe,
  getLienHeById,
  updateTrangThai,
  deleteLienHe,
};