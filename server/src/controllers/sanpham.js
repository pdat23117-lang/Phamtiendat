const mongoose = require("mongoose");
const Product = require("../models/sanpham");

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
const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.search) {
      filter.ten = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    if (req.query.hang) {
      filter.hang = req.query.hang;
    }

    if (req.query.gia === "duoi20") {
      filter.gia = { $lt: 20000000 };
    }

    if (req.query.gia === "20-30") {
      filter.gia = {
        $gte: 20000000,
        $lte: 30000000,
      };
    }

    if (req.query.gia === "tren30") {
      filter.gia = {
        $gt: 30000000,
      };
    }

    let query = Product.find(filter);

    if (req.query.sort === "tang") {
      query = query.sort({ gia: 1 });
    }

    if (req.query.sort === "giam") {
      query = query.sort({ gia: -1 });
    }

    const total = await Product.countDocuments(filter);

    const products = await query.skip(skip).limit(limit);

    res.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
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

// ========================
// ADMIN TRẢ LỜI
// ========================
const replyReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Không tìm thấy đánh giá",
      });
    }

    review.adminReply = req.body.reply;
    review.repliedAt = new Date();

    await product.save();

    res.json({
      message: "Đã trả lời đánh giá",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
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
};