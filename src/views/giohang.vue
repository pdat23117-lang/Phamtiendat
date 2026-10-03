<template>
  <div class="cart-page">

    <!-- =========================
         HEADER
    ========================== -->
    <div class="cart-header">
      <div>
        <div class="breadcrumb">
          Trang chủ <span>›</span> Giỏ hàng
        </div>

        <h1>Giỏ hàng</h1>

        <p v-if="!loading && cartItems.length > 0">
          Bạn đang có
          <strong>{{ tongSoLuong }}</strong>
          sản phẩm trong giỏ hàng
        </p>
      </div>

      <RouterLink to="/sanpham" class="continue-top">
        ← Tiếp tục mua sắm
      </RouterLink>
    </div>


    <!-- =========================
         LOADING
    ========================== -->
    <div v-if="loading" class="loading-box">

      <div class="spinner"></div>

      <p>Đang tải giỏ hàng...</p>

    </div>


    <!-- =========================
         GIỎ HÀNG TRỐNG
    ========================== -->
    <div
      v-else-if="cartItems.length === 0"
      class="empty-cart"
    >

      <div class="empty-icon">
        🛒
      </div>

      <h2>Giỏ hàng đang trống</h2>

      <p>
        Bạn chưa có sản phẩm nào trong giỏ hàng.
      </p>

      <RouterLink
        to="/sanpham"
        class="empty-button"
      >
        Khám phá sản phẩm
      </RouterLink>

    </div>


    <!-- =========================
         GIỎ HÀNG CÓ SẢN PHẨM
    ========================== -->
    <div
      v-else
      class="cart-layout"
    >

      <!-- =========================
           DANH SÁCH SẢN PHẨM
      ========================== -->
      <section class="cart-products">

        <div class="products-top">

          <div>
            <h2>Sản phẩm</h2>

            <span>
              {{ tongSoLuong }} sản phẩm
            </span>
          </div>

          <button
            class="clear-small"
            @click="clearCart"
          >
            🗑 Xóa tất cả
          </button>

        </div>


        <!-- PRODUCT ITEM -->
        <div
          v-for="item in cartItems"
          :key="item._id || `${item.sanpham?._id}-${item.bonho}-${item.mau}`"
          class="cart-item"
        >

          <!-- ẢNH -->
          <div class="product-image">

            <img
              :src="
                item.sanpham?.hinhAnh?.[0] ||
                item.sanpham?.hinh ||
                '/images/no-image.png'
              "
              :alt="item.sanpham?.ten"
            >

          </div>


          <!-- THÔNG TIN -->
          <div class="product-info">

            <div class="product-brand">
              {{ item.sanpham?.hang || "Apple" }}
            </div>

            <h3>
              {{ item.sanpham?.ten || "Sản phẩm" }}
            </h3>

            <div class="variant-list">

              <span class="variant">
                Bộ nhớ:
                <strong>{{ item.bonho }}</strong>
              </span>

              <span class="variant">
                Màu:
                <strong>{{ item.mau }}</strong>
              </span>

            </div>


            <!-- ĐƠN GIÁ -->
            <div class="unit-price">

              {{
                getItemPrice(item).toLocaleString("vi-VN")
              }}

              đ

            </div>

          </div>


          <!-- SỐ LƯỢNG -->
          <div class="quantity-section">

            <span class="quantity-label">
              Số lượng
            </span>

            <div class="quantity">

              <button
                type="button"
                class="quantity-btn"
                :disabled="item.soluong <= 1"
                @click="
                  updateQuantity(
                    item,
                    Number(item.soluong) - 1
                  )
                "
              >
                −
              </button>

              <span class="quantity-number">
                {{ item.soluong }}
              </span>

              <button
                type="button"
                class="quantity-btn"
                @click="
                  updateQuantity(
                    item,
                    Number(item.soluong) + 1
                  )
                "
              >
                +
              </button>

            </div>

          </div>


          <!-- THÀNH TIỀN -->
          <div class="item-total">

            <span>Thành tiền</span>

            <strong>
              {{
                (
                  getItemPrice(item) *
                  Number(item.soluong || 0)
                ).toLocaleString("vi-VN")
              }}
              đ
            </strong>

          </div>


          <!-- XÓA -->
          <button
            type="button"
            class="remove-btn"
            title="Xóa sản phẩm"
            @click="removeItem(item)"
          >
            ×
          </button>

        </div>


        <!-- GỢI Ý -->
        <div class="shopping-note">

          <div class="note-icon">
            💡
          </div>

          <div>
            <strong>Cần thêm sản phẩm?</strong>

            <p>
              Khám phá thêm các mẫu iPhone mới nhất tại DAT MOBILE.
            </p>
          </div>

          <RouterLink to="/sanpham">
            Xem sản phẩm →
          </RouterLink>

        </div>

      </section>


      <!-- =========================
           TÓM TẮT ĐƠN HÀNG
      ========================== -->
      <aside class="summary">

        <div class="summary-header">

          <h2>
            Tóm tắt đơn hàng
          </h2>

          <span>
            {{ tongSoLuong }} sản phẩm
          </span>

        </div>


        <!-- SỐ LƯỢNG -->
        <div class="summary-row">

          <span>
            Số sản phẩm
          </span>

          <strong>
            {{ tongSoLuong }}
          </strong>

        </div>


        <!-- TẠM TÍNH -->
        <div class="summary-row">

          <span>
            Tạm tính
          </span>

          <strong>
            {{ tongTien.toLocaleString("vi-VN") }} đ
          </strong>

        </div>


        <!-- VẬN CHUYỂN -->
        <div class="summary-row">

          <span>
            Vận chuyển
          </span>

          <strong class="free">
            Miễn phí
          </strong>

        </div>


        <div class="summary-divider"></div>


        <!-- TỔNG -->
        <div class="total-row">

          <div>

            <span>
              Tổng thanh toán
            </span>

            <small>
              Đã bao gồm sản phẩm
            </small>

          </div>

          <strong>
            {{ tongTien.toLocaleString("vi-VN") }} đ
          </strong>

        </div>


        <!-- ĐẶT HÀNG -->
        <button
          type="button"
          class="checkout-btn"
          @click="datHang"
        >
          Tiến hành đặt hàng
          <span>→</span>
        </button>


        <!-- TIẾP TỤC MUA -->
        <RouterLink
          to="/sanpham"
          class="continue-btn"
        >
          ← Tiếp tục mua sắm
        </RouterLink>


        <!-- CAM KẾT -->
        <div class="secure-box">

          <div class="secure-item">

            <span>🚚</span>

            <div>
              <strong>Giao hàng toàn quốc</strong>
              <small>Đóng gói cẩn thận</small>
            </div>

          </div>


          <div class="secure-item">

            <span>🛡️</span>

            <div>
              <strong>Bảo hành chính hãng</strong>
              <small>Cam kết sản phẩm chính hãng</small>
            </div>

          </div>


          <div class="secure-item">

            <span>💳</span>

            <div>
              <strong>Thanh toán linh hoạt</strong>
              <small>COD và chuyển khoản</small>
            </div>

          </div>

        </div>


        <!-- XÓA TẤT CẢ -->
        <button
          type="button"
          class="clear-btn"
          @click="clearCart"
        >
          🗑 Xóa toàn bộ giỏ hàng
        </button>

      </aside>

    </div>

  </div>
</template>


<script setup>

import axios from "axios";

import {
  ref,
  computed,
  onMounted
} from "vue";

import {
  useRouter
} from "vue-router";


const router = useRouter();


// ==============================
// GIỎ HÀNG
// ==============================

const cart = ref({
  items: []
});

const loading = ref(true);


// ==============================
// DANH SÁCH ITEM AN TOÀN
// ==============================

const cartItems = computed(() => {

  if (
    !cart.value ||
    !Array.isArray(cart.value.items)
  ) {
    return [];
  }

  return cart.value.items;

});


// ==============================
// TOKEN
// ==============================

const getToken = () => {

  return localStorage.getItem("token");

};


// ==============================
// HEADER AUTH
// ==============================

const authConfig = () => {

  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

};


// ==============================
// LẤY GIỎ HÀNG
// ==============================

const loadCart = async () => {

  loading.value = true;

  try {

    const res = await axios.get(
      "/cart",
      authConfig()
    );


    if (
      res.data &&
      Array.isArray(res.data.items)
    ) {

      cart.value = res.data;

    } else {

      cart.value = {
        items: []
      };

    }

  } catch (err) {

    console.error(
      "Lỗi lấy giỏ hàng:",
      err
    );


    cart.value = {
      items: []
    };

  } finally {

    loading.value = false;

  }

};


// ==============================
// LẤY GIÁ SẢN PHẨM
// ==============================

const getItemPrice = (item) => {

  const product =
    item?.sanpham;


  if (
    !product ||
    product.gia == null
  ) {
    return 0;
  }


  // Trường hợp gia là Number
  if (
    typeof product.gia === "number"
  ) {

    return product.gia;

  }


  // Trường hợp gia là String
  if (
    typeof product.gia === "string"
  ) {

    const number =
      Number(
        product.gia
          .replace(/[^\d.-]/g, "")
      );

    return isNaN(number)
      ? 0
      : number;

  }


  // Trường hợp gia là Object
  // Ví dụ:
  // {
  //   "256GB": 49990000,
  //   "512GB": 54990000
  // }

  if (
    typeof product.gia === "object"
  ) {

    const price =
      product.gia[item.bonho];

    return Number(price) || 0;

  }


  return 0;

};


// ==============================
// TỔNG SỐ SẢN PHẨM
// ==============================

const tongSoLuong = computed(() => {

  return cartItems.value.reduce(
    (tong, item) => {

      return tong +
        Number(item.soluong || 0);

    },
    0
  );

});


// ==============================
// TỔNG TIỀN
// ==============================

const tongTien = computed(() => {

  return cartItems.value.reduce(
    (tong, item) => {

      const price =
        Number(
          getItemPrice(item)
        );

      const quantity =
        Number(
          item.soluong || 0
        );

      return tong +
        price * quantity;

    },
    0
  );

});


// ==============================
// CẬP NHẬT SỐ LƯỢNG
// ==============================

const updateQuantity = async (
  item,
  quantity
) => {

  quantity =
    Number(quantity);


  if (quantity < 1) {
    return;
  }


  if (!item?._id) {

    console.error(
      "Item trong giỏ không có _id:",
      item
    );

    alert(
      "Sản phẩm trong giỏ hàng bị lỗi dữ liệu. Hãy xóa sản phẩm này và thêm lại."
    );

    return;

  }


  try {

    const res =
      await axios.put(

        `/cart/item/${item._id}`,

        {
          soluong: quantity
        },

        authConfig()

      );


    if (
      res.data &&
      Array.isArray(res.data.items)
    ) {

      cart.value =
        res.data;

    } else {

      await loadCart();

    }

  } catch (err) {

    console.error(
      "Lỗi cập nhật giỏ hàng:",
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể cập nhật số lượng"
    );

  }

};


// ==============================
// XÓA SẢN PHẨM
// ==============================

const removeItem = async (item) => {

  if (!item?._id) {

    alert(
      "Sản phẩm trong giỏ hàng bị lỗi dữ liệu. Hãy xóa giỏ hàng cũ và thêm lại sản phẩm."
    );

    return;

  }


  const productName =
    item.sanpham?.ten ||
    "sản phẩm";


  const confirmed =
    confirm(
      `Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`
    );


  if (!confirmed) {
    return;
  }


  try {

    const res =
      await axios.delete(

        `/cart/item/${item._id}`,

        authConfig()

      );


    if (
      res.data &&
      Array.isArray(res.data.items)
    ) {

      cart.value =
        res.data;

    } else {

      await loadCart();

    }

  } catch (err) {

    console.error(
      "Lỗi xóa sản phẩm:",
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể xóa sản phẩm"
    );

  }

};


// ==============================
// XÓA TOÀN BỘ
// ==============================

const clearCart = async () => {

  if (cartItems.value.length === 0) {
    return;
  }


  const confirmed =
    confirm(
      "Bạn có chắc muốn xóa toàn bộ giỏ hàng?"
    );


  if (!confirmed) {
    return;
  }


  try {

    await axios.delete(
      "/cart",
      authConfig()
    );


    cart.value = {
      items: []
    };

  } catch (err) {

    console.error(
      "Lỗi xóa giỏ hàng:",
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể xóa giỏ hàng"
    );

  }

};


// ==============================
// ĐẶT HÀNG
// ==============================

const datHang = () => {

  if (
    cartItems.value.length === 0
  ) {

    alert(
      "Giỏ hàng đang trống"
    );

    return;

  }


  router.push(
    "/Dathang"
  );

};


// ==============================
// LOAD
// ==============================

onMounted(
  loadCart
);

</script>


<style scoped>

/* =========================================
   PAGE
========================================= */

.cart-page {

  min-height: 100vh;

  background:
    linear-gradient(
      180deg,
      #f8fafc 0%,
      #f1f5f9 100%
    );

  padding:
    40px
    5%
    70px;

  box-sizing: border-box;

}


/* =========================================
   HEADER
========================================= */

.cart-header {

  max-width: 1500px;

  margin:
    0
    auto
    35px;

  display: flex;

  justify-content:
    space-between;

  align-items:
    flex-end;

  gap: 20px;

}


.breadcrumb {

  color: #64748b;

  font-size: 14px;

  margin-bottom: 10px;

}


.breadcrumb span {

  margin:
    0
    8px;

  color: #94a3b8;

}


.cart-header h1 {

  margin: 0;

  color: #0f172a;

  font-size: 38px;

  font-weight: 800;

}


.cart-header p {

  margin:
    10px
    0
    0;

  color: #64748b;

  font-size: 16px;

}


.cart-header p strong {

  color: #2563eb;

}


.continue-top {

  text-decoration: none;

  color: #2563eb;

  font-weight: 600;

  padding:
    12px
    18px;

  border:
    1px solid #dbeafe;

  border-radius: 10px;

  background: white;

  transition:
    .2s;

}


.continue-top:hover {

  background: #eff6ff;

  transform:
    translateY(-1px);

}


/* =========================================
   LOADING
========================================= */

.loading-box {

  max-width: 1500px;

  margin: 80px auto;

  background: white;

  border-radius: 20px;

  padding: 80px 20px;

  text-align: center;

  box-shadow:
    0 8px 30px
    rgba(15, 23, 42, .06);

}


.spinner {

  width: 42px;

  height: 42px;

  margin:
    0
    auto
    18px;

  border:
    4px solid #e2e8f0;

  border-top-color:
    #2563eb;

  border-radius: 50%;

  animation:
    spin .8s linear infinite;

}


.loading-box p {

  color: #64748b;

}


@keyframes spin {

  to {
    transform:
      rotate(360deg);
  }

}


/* =========================================
   EMPTY CART
========================================= */

.empty-cart {

  max-width: 700px;

  margin:
    70px
    auto;

  background: white;

  border-radius: 24px;

  padding:
    70px
    30px;

  text-align: center;

  box-shadow:
    0 10px 35px
    rgba(15, 23, 42, .07);

}


.empty-icon {

  width: 90px;

  height: 90px;

  margin:
    0
    auto
    25px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #eff6ff;

  border-radius: 50%;

  font-size: 42px;

}


.empty-cart h2 {

  margin: 0 0 10px;

  color: #0f172a;

}


.empty-cart p {

  color: #64748b;

  margin-bottom: 30px;

}


.empty-button {

  display: inline-block;

  padding:
    14px
    28px;

  background:
    #111827;

  color: white;

  text-decoration: none;

  border-radius: 10px;

  font-weight: 700;

  transition: .2s;

}


.empty-button:hover {

  background:
    #2563eb;

  transform:
    translateY(-2px);

}


/* =========================================
   LAYOUT
========================================= */

.cart-layout {

  max-width: 1500px;

  margin:
    0
    auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1.8fr)
    minmax(330px, .8fr);

  gap: 28px;

  align-items: start;

}


/* =========================================
   PRODUCTS
========================================= */

.cart-products {

  min-width: 0;

}


.products-top {

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom: 15px;

}


.products-top h2 {

  margin: 0;

  color: #0f172a;

  font-size: 22px;

}


.products-top span {

  display: block;

  margin-top: 4px;

  color: #64748b;

  font-size: 14px;

}


.clear-small {

  border: none;

  background: transparent;

  color: #ef4444;

  font-weight: 600;

  cursor: pointer;

  padding: 8px;

}


.clear-small:hover {

  text-decoration:
    underline;

}


/* =========================================
   PRODUCT ITEM
========================================= */

.cart-item {

  position: relative;

  display: grid;

  grid-template-columns:
    150px
    minmax(220px, 1fr)
    auto
    auto
    35px;

  gap: 22px;

  align-items:
    center;

  background: white;

  border:
    1px solid #e2e8f0;

  border-radius: 18px;

  padding: 22px;

  margin-bottom: 16px;

  box-shadow:
    0 5px 20px
    rgba(15, 23, 42, .05);

  transition:
    .2s;

}


.cart-item:hover {

  box-shadow:
    0 10px 30px
    rgba(15, 23, 42, .09);

  border-color:
    #dbeafe;

}


/* =========================================
   IMAGE
========================================= */

.product-image {

  width: 150px;

  height: 150px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    #f8fafc;

  border-radius: 14px;

  overflow: hidden;

}


.product-image img {

  width: 100%;

  height: 100%;

  object-fit: contain;

  padding: 10px;

  box-sizing: border-box;

}


/* =========================================
   PRODUCT INFO
========================================= */

.product-info {

  min-width: 0;

}


.product-brand {

  display: inline-block;

  padding:
    5px
    10px;

  background:
    #eff6ff;

  color:
    #2563eb;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 700;

  margin-bottom: 8px;

}


.product-info h3 {

  margin:
    0
    0
    12px;

  font-size: 20px;

  color: #111827;

}


.variant-list {

  display: flex;

  flex-wrap: wrap;

  gap: 8px;

}


.variant {

  padding:
    7px
    10px;

  background:
    #f8fafc;

  border:
    1px solid #e2e8f0;

  border-radius: 8px;

  font-size: 13px;

  color: #64748b;

}


.variant strong {

  color: #334155;

}


.unit-price {

  margin-top: 15px;

  font-size: 17px;

  font-weight: 800;

  color: #ef4444;

}


/* =========================================
   QUANTITY
========================================= */

.quantity-section {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 9px;

}


.quantity-label {

  font-size: 12px;

  color: #94a3b8;

}


.quantity {

  display: flex;

  align-items: center;

  gap: 10px;

  border:
    1px solid #e2e8f0;

  border-radius: 10px;

  padding: 4px;

}


.quantity-btn {

  width: 34px;

  height: 34px;

  border: none;

  border-radius: 8px;

  background:
    #f1f5f9;

  color:
    #0f172a;

  font-size: 20px;

  cursor: pointer;

  transition: .2s;

}


.quantity-btn:hover:not(:disabled) {

  background:
    #111827;

  color: white;

}


.quantity-btn:disabled {

  opacity: .4;

  cursor: not-allowed;

}


.quantity-number {

  min-width: 30px;

  text-align: center;

  font-size: 16px;

  font-weight: 700;

}


/* =========================================
   ITEM TOTAL
========================================= */

.item-total {

  min-width: 145px;

  text-align: right;

}


.item-total span {

  display: block;

  color: #94a3b8;

  font-size: 12px;

  margin-bottom: 7px;

}


.item-total strong {

  color: #111827;

  font-size: 17px;

}


/* =========================================
   REMOVE
========================================= */

.remove-btn {

  width: 34px;

  height: 34px;

  border: none;

  border-radius: 50%;

  background:
    #fee2e2;

  color:
    #dc2626;

  font-size: 22px;

  line-height: 1;

  cursor: pointer;

  transition: .2s;

}


.remove-btn:hover {

  background:
    #ef4444;

  color: white;

  transform:
    rotate(90deg);

}


/* =========================================
   NOTE
========================================= */

.shopping-note {

  display: flex;

  align-items: center;

  gap: 14px;

  margin-top: 20px;

  padding: 18px;

  background:
    #eff6ff;

  border:
    1px solid #dbeafe;

  border-radius: 14px;

}


.note-icon {

  font-size: 25px;

}


.shopping-note strong {

  color: #1e3a8a;

}


.shopping-note p {

  margin:
    4px
    0
    0;

  color: #64748b;

  font-size: 13px;

}


.shopping-note a {

  margin-left: auto;

  color: #2563eb;

  text-decoration: none;

  font-weight: 700;

  white-space: nowrap;

}


/* =========================================
   SUMMARY
========================================= */

.summary {

  position: sticky;

  top: 20px;

  background: white;

  border:
    1px solid #e2e8f0;

  border-radius: 20px;

  padding: 26px;

  box-shadow:
    0 8px 30px
    rgba(15, 23, 42, .07);

}


.summary-header {

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom: 25px;

}


.summary-header h2 {

  margin: 0;

  color: #0f172a;

  font-size: 22px;

}


.summary-header span {

  color: #64748b;

  font-size: 13px;

}


/* =========================================
   SUMMARY ROW
========================================= */

.summary-row {

  display: flex;

  justify-content:
    space-between;

  align-items: center;

  margin-bottom: 17px;

  color: #64748b;

  font-size: 15px;

}


.summary-row strong {

  color: #111827;

}


.summary-row .free {

  color: #16a34a;

}


/* =========================================
   DIVIDER
========================================= */

.summary-divider {

  height: 1px;

  background:
    #e2e8f0;

  margin:
    20px
    0;

}


/* =========================================
   TOTAL
========================================= */

.total-row {

  display: flex;

  justify-content:
    space-between;

  gap: 15px;

  align-items:
    center;

  margin-bottom: 25px;

}


.total-row span {

  display: block;

  color: #0f172a;

  font-weight: 700;

  font-size: 16px;

}


.total-row small {

  display: block;

  margin-top: 5px;

  color: #94a3b8;

  font-size: 11px;

}


.total-row strong {

  color: #ef4444;

  font-size: 23px;

  white-space: nowrap;

}


/* =========================================
   CHECKOUT
========================================= */

.checkout-btn {

  width: 100%;

  border: none;

  padding: 16px;

  border-radius: 11px;

  background:
    #111827;

  color: white;

  font-size: 16px;

  font-weight: 700;

  cursor: pointer;

  display: flex;

  justify-content:
    center;

  align-items: center;

  gap: 10px;

  transition: .2s;

}


.checkout-btn:hover {

  background:
    #2563eb;

  transform:
    translateY(-2px);

}


.checkout-btn span {

  font-size: 20px;

}


/* =========================================
   CONTINUE
========================================= */

.continue-btn {

  display: block;

  width: 100%;

  box-sizing: border-box;

  margin-top: 12px;

  padding: 14px;

  text-align: center;

  text-decoration: none;

  border:
    1px solid #dbeafe;

  border-radius: 11px;

  color: #2563eb;

  font-weight: 600;

  background:
    #eff6ff;

  transition: .2s;

}


.continue-btn:hover {

  background:
    #dbeafe;

}


/* =========================================
   SECURE BOX
========================================= */

.secure-box {

  margin-top: 24px;

  padding-top: 20px;

  border-top:
    1px solid #e2e8f0;

}


.secure-item {

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 17px;

}


.secure-item:last-child {

  margin-bottom: 0;

}


.secure-item > span {

  width: 38px;

  height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    #f1f5f9;

  border-radius: 10px;

  font-size: 18px;

}


.secure-item strong {

  display: block;

  color: #334155;

  font-size: 13px;

}


.secure-item small {

  display: block;

  margin-top: 3px;

  color: #94a3b8;

  font-size: 11px;

}


/* =========================================
   CLEAR BUTTON
========================================= */

.clear-btn {

  width: 100%;

  margin-top: 22px;

  padding: 12px;

  border:
    1px solid #fecaca;

  border-radius: 10px;

  background: white;

  color: #dc2626;

  font-weight: 600;

  cursor: pointer;

  transition: .2s;

}


.clear-btn:hover {

  background:
    #fef2f2;

}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 1200px) {

  .cart-item {

    grid-template-columns:
      125px
      minmax(180px, 1fr)
      auto
      35px;

  }


  .product-image {

    width: 125px;

    height: 125px;

  }


  .item-total {

    display: none;

  }

}


@media (max-width: 950px) {

  .cart-layout {

    grid-template-columns:
      1fr;

  }


  .summary {

    position: static;

  }

}


@media (max-width: 700px) {

  .cart-page {

    padding:
      25px
      15px
      50px;

  }


  .cart-header {

    flex-direction:
      column;

    align-items:
      flex-start;

  }


  .cart-header h1 {

    font-size: 30px;

  }


  .continue-top {

    width: 100%;

    box-sizing: border-box;

    text-align: center;

  }


  .cart-item {

    grid-template-columns:
      100px
      1fr
      35px;

    gap: 15px;

    padding: 15px;

  }


  .product-image {

    width: 100px;

    height: 100px;

  }


  .quantity-section {

    grid-column:
      2;

    align-items:
      flex-start;

  }


  .remove-btn {

    grid-column:
      3;

    grid-row:
      1;

  }


  .product-info h3 {

    font-size: 17px;

  }


  .variant {

    font-size: 11px;

  }


  .shopping-note {

    align-items:
      flex-start;

    flex-wrap:
      wrap;

  }


  .shopping-note a {

    width: 100%;

    margin-left: 0;

  }


  .summary {

    padding: 20px;

  }


  .total-row strong {

    font-size: 19px;

  }

}


@media (max-width: 480px) {

  .cart-item {

    grid-template-columns:
      80px
      1fr
      30px;

  }


  .product-image {

    width: 80px;

    height: 80px;

  }


  .product-brand {

    font-size: 10px;

  }


  .product-info h3 {

    font-size: 15px;

  }


  .unit-price {

    font-size: 15px;

  }


  .quantity-section {

    grid-column:
      1 / -1;

    flex-direction:
      row;

    justify-content:
      space-between;

  }


  .remove-btn {

    width: 30px;

    height: 30px;

    font-size: 18px;

  }

}

</style>