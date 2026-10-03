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

    // Nếu chưa có giỏ hàng
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json(cart);
  } catch (err) {
    console.error("Lỗi lấy giỏ hàng:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// ==============================
// Thêm sản phẩm vào giỏ hàng
// ==============================
const addToCart = async (req, res) => {
  try {

    const {
      productId,
      soluong,
      bonho,
      mau,
    } = req.body;


    // ==============================
    // Kiểm tra productId
    // ==============================
    if (!productId) {
      return res.status(400).json({
        message: "Thiếu mã sản phẩm",
      });
    }


    // ==============================
    // Tìm sản phẩm
    // ==============================
    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }


    // ==============================
    // Kiểm tra bộ nhớ
    // ==============================
    if (!bonho) {
      return res.status(400).json({
        message: "Vui lòng chọn bộ nhớ",
      });
    }


    // ==============================
    // Kiểm tra màu
    // ==============================
    if (!mau) {
      return res.status(400).json({
        message: "Vui lòng chọn màu sắc",
      });
    }


    // ==============================
    // Kiểm tra bộ nhớ hợp lệ
    // ==============================
    if (
      Array.isArray(product.bonho) &&
      product.bonho.length > 0 &&
      !product.bonho.includes(bonho)
    ) {
      return res.status(400).json({
        message: "Bộ nhớ không hợp lệ",
      });
    }


    // ==============================
    // Kiểm tra màu hợp lệ
    // ==============================
    if (
      Array.isArray(product.mau) &&
      product.mau.length > 0 &&
      !product.mau.includes(mau)
    ) {
      return res.status(400).json({
        message: "Màu sắc không hợp lệ",
      });
    }


    // ==============================
    // Kiểm tra tồn kho
    // ==============================
    const soLuongThem =
      Number(soluong || 1);

    if (soLuongThem <= 0) {
      return res.status(400).json({
        message: "Số lượng không hợp lệ",
      });
    }

    if (soLuongThem > product.stock) {
      return res.status(400).json({
        message: "Số lượng vượt quá tồn kho",
      });
    }


    // ==============================
    // Tìm giỏ hàng của người dùng
    // ==============================
    let cart =
      await Cart.findOne({
        user: req.user._id,
      });


    // ==============================
    // Nếu chưa có giỏ hàng
    // ==============================
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }


    // ==============================
    // Tìm đúng biến thể:
    //
    // Cùng sản phẩm
    // + Cùng bộ nhớ
    // + Cùng màu
    // ==============================
    const item =
      cart.items.find(
        (i) =>
          i.sanpham.toString() ===
            productId &&
          i.bonho === bonho &&
          i.mau === mau
      );


    // ==============================
    // Nếu đã tồn tại
    // ==============================
    if (item) {

      const soLuongMoi =
        item.soluong +
        soLuongThem;


      // Kiểm tra tồn kho
      if (soLuongMoi > product.stock) {
        return res.status(400).json({
          message:
            "Số lượng sản phẩm trong giỏ vượt quá tồn kho",
        });
      }


      item.soluong =
        soLuongMoi;

    } else {

      // ==============================
      // Tạo item mới
      // ==============================
      cart.items.push({
        sanpham: productId,
        bonho: bonho,
        mau: mau,
        soluong: soLuongThem,
      });
    }


    // ==============================
    // Lưu giỏ hàng
    // ==============================
    await cart.save();


    // ==============================
    // Lấy lại giỏ hàng
    // ==============================
    const result =
      await Cart.findById(
        cart._id
      ).populate(
        "items.sanpham"
      );


    res.json(result);

  } catch (err) {

    console.error(
      "Lỗi thêm vào giỏ:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};


// ==============================
// Cập nhật số lượng
// PUT /cart/item/:itemId
// ==============================
// ==============================
// Cập nhật số lượng
// PUT /cart/item/:itemId
// ==============================
const updateCart = async (req, res) => {
  try {
    const { soluong } = req.body;
    const itemId = req.params.itemId;

    console.log("========== UPDATE CART ==========");
    console.log("itemId nhận được:", itemId);
    console.log("soluong:", soluong);

    // Tìm giỏ hàng
    const cart = await Cart.findOne({
      user: req.user._id
    });

    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng"
      });
    }

    console.log(
      "Các item trong giỏ:",
      cart.items.map(item => ({
        id: item._id?.toString(),
        sanpham: item.sanpham?.toString(),
        bonho: item.bonho,
        mau: item.mau,
        soluong: item.soluong
      }))
    );

    // ==============================
    // Tìm item bằng _id
    // ==============================
    const item = cart.items.find(
      item =>
        item._id &&
        item._id.toString() === itemId
    );

    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm trong giỏ hàng"
      });
    }

    // ==============================
    // Kiểm tra số lượng
    // ==============================
    const soLuongMoi = Number(soluong);

    if (!Number.isInteger(soLuongMoi) || soLuongMoi < 1) {
      return res.status(400).json({
        message: "Số lượng không hợp lệ"
      });
    }

    // ==============================
    // Tìm sản phẩm
    // ==============================
    const product = await Product.findById(
      item.sanpham
    );

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm"
      });
    }

    // ==============================
    // Kiểm tra tồn kho
    // ==============================
    if (soLuongMoi > product.stock) {
      return res.status(400).json({
        message: `Chỉ còn ${product.stock} sản phẩm`
      });
    }

    // ==============================
    // Cập nhật
    // ==============================
    item.soluong = soLuongMoi;

    await cart.save();

    // ==============================
    // Lấy lại giỏ hàng
    // ==============================
    const updatedCart = await Cart
      .findById(cart._id)
      .populate("items.sanpham");

    console.log(
      "Cập nhật thành công:",
      item._id.toString()
    );

    res.json(updatedCart);

  } catch (error) {

    console.error(
      "Lỗi updateCart:",
      error
    );

    res.status(500).json({
      message: "Lỗi cập nhật giỏ hàng",
      error: error.message
    });
  }
};


// ==============================
// Xóa một item khỏi giỏ hàng
// DELETE /cart/item/:itemId
// ==============================
const removeCartItem =
  async (req, res) => {

    try {

      // ==============================
      // Tìm giỏ hàng
      // ==============================
      const cart =
        await Cart.findOne({
          user: req.user._id,
        });


      if (!cart) {
        return res.status(404).json({
          message:
            "Không có giỏ hàng",
        });
      }


      // ==============================
      // Tìm item
      // ==============================
      const item =
        cart.items.id(
          req.params.itemId
        );


      if (!item) {
        return res.status(404).json({
          message:
            "Không tìm thấy sản phẩm trong giỏ hàng",
        });
      }


      // ==============================
      // Xóa đúng item
      // ==============================
      item.deleteOne();


      // ==============================
      // Lưu giỏ hàng
      // ==============================
      await cart.save();


      // ==============================
      // Lấy lại giỏ hàng
      // ==============================
      const result =
        await Cart.findById(
          cart._id
        ).populate(
          "items.sanpham"
        );


      res.json(result);

    } catch (err) {

      console.error(
        "Lỗi xóa sản phẩm:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  };


// ==============================
// Xóa toàn bộ giỏ hàng
// DELETE /cart
// ==============================
const clearCart =
  async (req, res) => {

    try {

      // ==============================
      // Tìm giỏ hàng
      // ==============================
      const cart =
        await Cart.findOne({
          user: req.user._id,
        });


      if (!cart) {
        return res.status(404).json({
          message:
            "Không có giỏ hàng",
        });
      }


      // ==============================
      // Xóa toàn bộ
      // ==============================
      cart.items = [];


      // ==============================
      // Lưu
      // ==============================
      await cart.save();


      res.json({
        success: true,
        message:
          "Đã xóa giỏ hàng",
      });

    } catch (err) {

      console.error(
        "Lỗi xóa giỏ hàng:",
        err
      );

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