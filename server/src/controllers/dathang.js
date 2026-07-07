const Order = require("../models/dathang");
const Product = require("../models/sanpham");

// =========================
// TẠO ĐƠN HÀNG
// =========================
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      note,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng đang trống",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.ten ||
      !shippingAddress.sodienthoai ||
      !shippingAddress.diachi
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin giao hàng",
      });
    }

    let tongTien = 0;

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(
        item.productId
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      if (product.stock < item.soluong) {
        return res.status(400).json({
          success: false,
          message: `${product.ten} chỉ còn ${product.stock} sản phẩm`,
        });
      }

      tongTien +=
        product.gia * item.soluong;

      orderItems.push({
        product: product._id,
        ten: product.ten,
        gia: product.gia,
        soluong: item.soluong,
        hinh: product.hinh,
      });

      product.stock -= item.soluong;

      await product.save();
    }

    const phiVanChuyen =
      tongTien >= 1000000 ? 0 : 30000;

    const thanhTien =
      tongTien + phiVanChuyen;

    const order =
      await Order.create({
        user: req.user._id,

        items: orderItems,

        shippingAddress,

        tongTien,

        phiVanChuyen,

        thanhTien,

        paymentMethod:
          paymentMethod || "cod",

        note: note || "",
      });

    res.status(201).json({
      success: true,
      message:
        "Đặt hàng thành công",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// ĐƠN HÀNG CỦA TÔI
// =========================
const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// CHI TIẾT ĐƠN HÀNG
// =========================
const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      ).populate(
        "user",
        "name email"
      );

    if (!order) {
      return res.status(404).json({
        message:
          "Không tìm thấy đơn hàng",
      });
    }

    if (
      order.user._id.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Không có quyền",
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// ADMIN LẤY TOÀN BỘ ĐƠN
// =========================
const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({})
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// ADMIN CẬP NHẬT TRẠNG THÁI
// =========================
const updateOrderStatus =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Không tìm thấy đơn hàng",
          });
      }

      order.status =
        req.body.status;

      if (
        req.body.status ===
        "delivered"
      ) {
        order.isPaid = true;
        order.paidAt =
          new Date();
      }

      await order.save();

      res.json({
        success: true,
        message:
          "Đã cập nhật trạng thái",
        order,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

// =========================
// USER HỦY ĐƠN
// =========================
const cancelOrder = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message:
          "Không tìm thấy đơn",
      });
    }

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Không có quyền",
      });
    }

    if (
      order.status !==
      "pending"
    ) {
      return res.status(400).json({
        message:
          "Đơn đang xử lý, không thể hủy",
      });
    }

    for (const item of order.items) {
      const product =
        await Product.findById(
          item.product
        );

      if (product) {
        product.stock +=
          item.soluong;

        await product.save();
      }
    }

    order.status =
      "cancelled";

    await order.save();

    res.json({
      success: true,
      message:
        "Đã hủy đơn hàng",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// DASHBOARD
// =========================
const getThongKe = async (
  req,
  res
) => {
  try {
    const tongDon =
      await Order.countDocuments();

    const doanhThu =
      await Order.aggregate([
        {
          $match: {
            status:
              "delivered",
          },
        },
        {
          $group: {
            _id: null,
            tong: {
              $sum:
                "$thanhTien",
            },
          },
        },
      ]);

    const choXuLy =
      await Order.countDocuments({
        status: "pending",
      });

    const dangGiao =
      await Order.countDocuments({
        status:
          "shipping",
      });

    const daGiao =
      await Order.countDocuments({
        status:
          "delivered",
      });

    res.json({
      tongDon,
      choXuLy,
      dangGiao,
      daGiao,
      doanhThu:
        doanhThu.length
          ? doanhThu[0].tong
          : 0,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getThongKe,
};