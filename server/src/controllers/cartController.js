const Cart = require("../models/Cart");
const Product = require("../models/sanpham");

// ==============================
// Lấy giỏ hàng
// ==============================
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.sanpham");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==============================
// Thêm vào giỏ hàng
// ==============================
const addToCart = async (req, res) => {
  try {
    const { productId, soluong } = req.body;

    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message:
          "Không tìm thấy sản phẩm",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const item = cart.items.find(
      (i) =>
        i.sanpham.toString() ===
        productId
    );

    if (item) {
      item.soluong +=
        Number(soluong || 1);
    } else {
      cart.items.push({
        sanpham: productId,
        soluong:
          Number(soluong || 1),
      });
    }

    await cart.save();

    const result =
      await Cart.findById(
        cart._id
      ).populate("items.sanpham");

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==============================
// Cập nhật số lượng
// ==============================
const updateCart = async (req, res) => {
  try {
    const { soluong } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message:
          "Không có giỏ hàng",
      });
    }

    const item = cart.items.find(
      (i) =>
        i.sanpham.toString() ===
        req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        message:
          "Không tìm thấy sản phẩm",
      });
    }

    item.soluong = Number(soluong);

    if (item.soluong <= 0) {
      cart.items = cart.items.filter(
        (i) =>
          i.sanpham.toString() !==
          req.params.productId
      );
    }

    await cart.save();

    const result =
      await Cart.findById(
        cart._id
      ).populate("items.sanpham");

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==============================
// Xóa 1 sản phẩm
// ==============================
const removeCartItem =
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          user: req.user._id,
        });

      if (!cart) {
        return res
          .status(404)
          .json({
            message:
              "Không có giỏ hàng",
          });
      }

      cart.items =
        cart.items.filter(
          (i) =>
            i.sanpham.toString() !==
            req.params.productId
        );

      await cart.save();

      const result =
        await Cart.findById(
          cart._id
        ).populate(
          "items.sanpham"
        );

      res.json(result);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

// ==============================
// Xóa toàn bộ giỏ hàng
// ==============================
const clearCart =
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          user: req.user._id,
        });

      if (!cart) {
        return res
          .status(404)
          .json({
            message:
              "Không có giỏ hàng",
          });
      }

      cart.items = [];

      await cart.save();

      res.json({
        success: true,
        message:
          "Đã xóa giỏ hàng",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  clearCart,
};