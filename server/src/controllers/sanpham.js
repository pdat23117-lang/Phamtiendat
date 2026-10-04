const mongoose = require("mongoose");
const Product = require("../models/sanpham");
const Order = require("../models/dathang");
// Tìm sản phẩm theo ID
const findProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findById(id);
};

// Kiểm tra dữ liệu
const validateProduct = (gia, stock) => {
  if (gia !== undefined && Number(gia) < 0) {
    return "Giá sản phẩm không hợp lệ";
  }

  if (stock !== undefined && Number(stock) < 0) {
    return "Số lượng tồn kho không hợp lệ";
  }

  return null;
};

// ========================
// LẤY DANH SÁCH SẢN PHẨM
// ========================
// ========================
// LẤY DANH SÁCH SẢN PHẨM
// ========================
const getProducts = async (req, res) => {
  try {
    const filter = {};

    // Tìm kiếm
    if (req.query.search) {
      filter.ten = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    // Lọc hãng
    if (req.query.hang) {
      filter.hang = req.query.hang;
    }

    // Lấy toàn bộ sản phẩm
    const products = await Product.find(filter);

    // Đảm bảo gia luôn là object JSON
    const result = products.map((product) => {
      const data = product.toObject();

      if (data.gia instanceof Map) {
        data.gia = Object.fromEntries(data.gia);
      }

      return data;
    });

    res.json({
      products: result,
      total: result.length,
    });

  } catch (error) {
    console.log("Lỗi getProducts:", error);

    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// ========================
// CHI TIẾT SẢN PHẨM
// ========================
const getProductById = async (req, res) => {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// THÊM SẢN PHẨM
// ========================
const createProduct = async (req, res) => {
  try {
    const {
      ten,
      gia,
      hang,
      hinh,
      ram,
      bonho,
      mau,
      baohanh,
      mota,
      stock,
      noibat,
    } = req.body;

    if (!ten || !gia || !hang || !hinh) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const check = validateProduct(gia, stock);

    if (check) {
      return res.status(400).json({
        message: check,
      });
    }

    const product = await Product.create({
      ten,
      gia: Number(gia),
      hang,
      hinh,
      ram,
      bonho,
      mau,
      baohanh,
      mota,
      stock: Number(stock) || 0,
      noibat,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// SỬA SẢN PHẨM
// ========================
const updateProduct = async (req, res) => {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    const check = validateProduct(req.body.gia, req.body.stock);

    if (check) {
      return res.status(400).json({
        message: check,
      });
    }

    Object.assign(product, req.body);

    const updated = await product.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// XÓA SẢN PHẨM
// ========================
const deleteProduct = async (req, res) => {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Đã xóa sản phẩm",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// ĐÁNH GIÁ
// ========================
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const daMua = await Order.findOne({
  user: req.user._id,
  status: "delivered",
  "items.product": req.params.id,
});

if (!daMua) {
  return res.status(400).json({
    message: "Bạn chỉ được đánh giá sản phẩm đã mua và đã giao",
  });
}

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    const reviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (reviewed) {
      return res.status(400).json({
        message: "Bạn đã đánh giá rồi",
      });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    product.numReviews = product.reviews.length;

    product.averageRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Đánh giá thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// ========================
// LẤY TOÀN BỘ ĐÁNH GIÁ
// ========================
const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({
      "reviews.0": { $exists: true },
    });

    const reviews = [];

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        reviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.ten,
          productImage: product.hinh,
          ...review.toObject(),
        });
      });
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};
const checkReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        reviewed: false,
      });
    }

    const reviewed = product.reviews.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    res.json({
      reviewed,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
// ========================
// ADMIN TRẢ LỜI
// ========================
// ==========================================
// ADMIN - PHẢN HỒI ĐÁNH GIÁ
// ==========================================
const replyReview = async (req, res) => {
  try {

    const { productId, reviewId } = req.params;

    const { reply } = req.body;


    // Kiểm tra nội dung
    if (!reply || !reply.trim()) {

      return res.status(400).json({
        success: false,
        message: "Nội dung phản hồi không được để trống",
      });

    }


    // Tìm sản phẩm
    const product =
      await Product.findById(productId);


    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });

    }


    // Tìm review
    const review =
      product.reviews.id(reviewId);


    if (!review) {

      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });

    }


    // ======================================
    // QUAN TRỌNG
    // LƯU VÀO adminReply
    // ======================================

    review.adminReply =
      reply.trim();


    // Lưu sản phẩm
    await product.save();


    return res.status(200).json({

      success: true,

      message: "Đã lưu phản hồi",

      review: {

        _id: review._id,

        adminReply:
          review.adminReply,

      },

    });

  }
  catch (error) {

    console.error(
      "Lỗi replyReview:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Lỗi server khi lưu phản hồi",

      error:
        error.message,

    });

  }
};
// ========================
// XÓA ĐÁNH GIÁ
// ========================
const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );

    product.numReviews = product.reviews.length;

    product.averageRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    await product.save();

    res.json({
      message: "Đã xóa đánh giá",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getAllReviews,
  replyReview,
  deleteReview,
  checkReview,
};