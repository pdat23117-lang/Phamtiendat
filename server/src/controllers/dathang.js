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

    // =========================
    // KIỂM TRA GIỎ HÀNG
    // =========================
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng đang trống",
      });
    }

    // =========================
    // KIỂM TRA ĐỊA CHỈ
    // =========================
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

    // =========================
    // TỔNG TIỀN
    // =========================
    let tongTien = 0;

    const orderItems = [];

    // =========================
    // XỬ LÝ TỪNG SẢN PHẨM
    // =========================
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

      // =========================
      // KIỂM TRA SỐ LƯỢNG
      // =========================
      const soLuong = Number(item.soluong);

      if (!Number.isInteger(soLuong) || soLuong < 1) {
        return res.status(400).json({
          success: false,
          message: `Số lượng sản phẩm ${product.ten} không hợp lệ`,
        });
      }

      // =========================
      // KIỂM TRA BỘ NHỚ
      // =========================
      if (!item.bonho) {
        return res.status(400).json({
          success: false,
          message: `Vui lòng chọn bộ nhớ cho ${product.ten}`,
        });
      }

      // =========================
      // KIỂM TRA MÀU
      // =========================
      if (!item.mau) {
        return res.status(400).json({
          success: false,
          message: `Vui lòng chọn màu cho ${product.ten}`,
        });
      }

      // =========================
      // LẤY GIÁ THEO BỘ NHỚ
      // =========================

      let gia = 0;

      // Trường hợp giá là object:
      // {
      //   "256GB": 39990000,
      //   "512GB": 40990000,
      //   "1TB": 41990000,
      //   "2TB": 42990000
      // }
      if (
        product.gia &&
        typeof product.gia === "object" &&
        !Array.isArray(product.gia)
      ) {

        gia = Number(
          product.gia[item.bonho]
        );

      } else {

        // Trường hợp sản phẩm cũ chỉ có một giá
        gia = Number(product.gia);

      }

      // =========================
      // KIỂM TRA GIÁ
      // =========================
      if (!Number.isFinite(gia) || gia <= 0) {
        return res.status(400).json({
          success: false,
          message:
            `Không tìm thấy giá của ${product.ten} - ${item.bonho}`,
        });
      }

      // =========================
      // KIỂM TRA TỒN KHO
      // =========================
      if (soLuong > Number(product.stock)) {
        return res.status(400).json({
          success: false,
          message:
            `${product.ten} chỉ còn ${product.stock} sản phẩm`,
        });
      }

      // =========================
      // TÍNH THÀNH TIỀN
      // =========================
      const thanhTienItem =
        gia * soLuong;

      tongTien += thanhTienItem;

      // =========================
      // THÊM VÀO ORDER
      // =========================
      orderItems.push({
        product: product._id,

        ten: product.ten,

        gia: gia,

        soluong: soLuong,

        bonho: item.bonho,

        mau: item.mau,

        hinh: product.hinh,
      });
    }

    // =========================
    // PHÍ VẬN CHUYỂN
    // =========================

    const phiVanChuyen =
      tongTien >= 1000000
        ? 0
        : 30000;

    // =========================
    // GIẢM GIÁ
    // =========================

    const giamGia = 0;

    // =========================
    // THÀNH TIỀN
    // =========================

    const thanhTien =
      tongTien +
      phiVanChuyen -
      giamGia;

    // =========================
    // TẠO ĐƠN HÀNG
    // =========================

    const order = await Order.create({

  user: req.user._id,

  items: orderItems,

  shippingAddress: {
    ten: shippingAddress.ten,
    sodienthoai: shippingAddress.sodienthoai,
    diachi: shippingAddress.diachi,
    ghichu: shippingAddress.ghichu || "",
  },

  tongTien: tongTien,

  phiVanChuyen: phiVanChuyen,

  giamGia: giamGia,

  thanhTien: thanhTien,

  paymentMethod:
  paymentMethod || "cod",

paymentStatus: "unpaid",

isPaid: false,

note: note || "",
});
    // =========================
    // TRẢ KẾT QUẢ
    // =========================

    res.status(201).json({
      success: true,

      message:
        "Đặt hàng thành công",

      order,
    });

  } catch (err) {

    console.error(
      "Lỗi tạo đơn hàng:",
      err
    );

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


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // =========================
    // KIỂM TRA TRẠNG THÁI
    // =========================

    const allowedStatus = [
      "pending",
      "processing",
      "shipping",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    // =========================
    // TÌM ĐƠN HÀNG
    // =========================

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // =========================
    // ĐƠN ĐÃ HỦY
    // =========================

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Đơn hàng đã hủy, không thể thay đổi trạng thái",
      });
    }

    // =========================
    // ĐƠN ĐÃ GIAO
    // =========================

    if (order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message:
          "Đơn hàng đã giao, không thể thay đổi trạng thái",
      });
    }

    // =========================
    // BANK CHƯA THANH TOÁN
    // KHÔNG CHO GIAO
    // =========================

    if (
      order.paymentMethod === "bank" &&
      !order.isPaid &&
      (
        status === "shipping" ||
        status === "delivered"
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Khách hàng chưa thanh toán, không thể chuyển sang trạng thái giao hàng",
      });
    }

    // =========================
    // LƯU TRẠNG THÁI
    // =========================

    order.status = status;

    await order.save();

    // =========================
    // KIỂM TRA LẠI DB
    // =========================

    const savedOrder = await Order.findById(id);

    console.log(
      "Đã lưu trạng thái:",
      savedOrder.status
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      order: savedOrder,
    });

  } catch (err) {
    console.error(
      "Lỗi cập nhật trạng thái:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Không thể cập nhật trạng thái",
    });
  }
};
// ==============================
// ĐỔI PHƯƠNG THỨC THANH TOÁN
// ==============================
const changePaymentMethod = async (req, res) => {

  try {

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });

    }


    // Không cho đổi nếu đã thanh toán
    if (
      order.isPaid ||
      order.paymentStatus === "paid"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Đơn hàng đã thanh toán, không thể đổi phương thức.",
      });

    }


    // Không cho đổi khi khách đã báo chuyển khoản
    if (
      order.paymentStatus === "waiting"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Đơn hàng đang chờ nhân viên xác nhận thanh toán.",
      });

    }


    // Chỉ cho đổi khi đơn còn chờ xác nhận
    if (
      order.status !== "pending"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Đơn hàng đã được xử lý, không thể đổi phương thức thanh toán.",
      });

    }


    const newMethod =
      req.body.paymentMethod;


    if (
      !["cod", "bank"].includes(
        newMethod
      )
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Phương thức thanh toán không hợp lệ.",
      });

    }


    // Không cho đổi sang chính phương thức hiện tại
    if (
      order.paymentMethod === newMethod
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Đây đã là phương thức thanh toán hiện tại.",
      });

    }


    // Đổi phương thức
    order.paymentMethod =
      newMethod;


    // Reset trạng thái thanh toán
    order.paymentStatus =
      "unpaid";

    order.isPaid =
      false;

    order.paidAt =
      null;


    await order.save();


    res.json({

      success: true,

      message:
        newMethod === "bank"
          ? "Đã chuyển sang thanh toán bằng QR."
          : "Đã chuyển sang thanh toán khi nhận hàng.",

      order,

    });

  }
  catch (err) {

    console.error(
      "Lỗi đổi phương thức thanh toán:",
      err
    );

    res.status(500).json({

      success: false,

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

    // =========================
    // HOÀN LẠI TỒN KHO
    // =========================

    for (
      const item of order.items
    ) {

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
// =========================
// KHÁCH XÁC NHẬN ĐÃ CHUYỂN KHOẢN
// =========================
const confirmBankTransfer = async (
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
          "Không tìm thấy đơn hàng",
      });

    }

    // Kiểm tra quyền
    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "Bạn không có quyền",
      });

    }

    // Phải là đơn chuyển khoản
    if (
      order.paymentMethod !==
      "bank"
    ) {

      return res.status(400).json({
        message:
          "Đơn hàng này không sử dụng chuyển khoản",
      });

    }

    // Đã thanh toán rồi
    if (
      order.paymentStatus ===
      "paid"
    ) {

      return res.status(400).json({
        message:
          "Đơn hàng đã được xác nhận thanh toán",
      });

    }

    order.paymentStatus =
      "waiting";

    await order.save();

    res.json({

      success: true,

      message:
        "Đã ghi nhận yêu cầu xác nhận thanh toán. Cửa hàng sẽ kiểm tra giao dịch.",

      order,

    });

  } catch (err) {

    console.error(
      "Lỗi xác nhận chuyển khoản:",
      err
    );

    res.status(500).json({
      message: err.message,
    });

  }
};
// =========================
// ADMIN XÁC NHẬN ĐÃ NHẬN TIỀN
// =========================
// ==============================
// ADMIN XÁC NHẬN ĐÃ NHẬN TIỀN
// ==============================
const confirmPayment = async (req, res) => {
  try {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Chỉ cho phép xác nhận đơn thanh toán bằng QR
    if (order.paymentMethod !== "bank") {
      return res.status(400).json({
        success: false,
        message:
          "Đơn hàng này không phải thanh toán bằng QR",
      });
    }

    // Nếu đã thanh toán rồi
    if (order.isPaid === true) {
      return res.status(400).json({
        success: false,
        message:
          "Đơn hàng này đã được xác nhận thanh toán",
      });
    }

    // =========================
    // XÁC NHẬN THANH TOÁN
    // =========================

    order.isPaid = true;

    order.paymentStatus = "paid";

    order.paidAt = new Date();

    await order.save();

    return res.json({
      success: true,

      message:
        "Đã xác nhận khách hàng thanh toán thành công",

      order,
    });

  } catch (err) {

    console.error(
      "Lỗi xác nhận thanh toán:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Không thể xác nhận thanh toán",
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
  
  confirmBankTransfer,

  confirmPayment,

  changePaymentMethod,

};