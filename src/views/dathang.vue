<template>
  <div class="checkout-page">

    <!-- =========================
         HEADER TRANG
    ========================== -->
    <div class="page-header">
      <div>
        <h1>Đặt hàng</h1>
        <p>Kiểm tra thông tin và hoàn tất đơn hàng của bạn</p>
      </div>

      <div class="secure">
        🔒 Thanh toán an toàn
      </div>
    </div>


    <!-- =========================
         LOADING
    ========================== -->
    <div
      v-if="loadingCart"
      class="loading-box"
    >
      <div class="spinner"></div>
      <p>Đang tải thông tin đơn hàng...</p>
    </div>


    <!-- =========================
         KHÔNG CÓ SẢN PHẨM
    ========================== -->
    <div
      v-else-if="!cart.items || cart.items.length === 0"
      class="empty-box"
    >
      <div class="empty-icon">
        🛒
      </div>

      <h2>Giỏ hàng đang trống</h2>

      <p>
        Bạn chưa có sản phẩm nào để đặt hàng.
      </p>

      <button
        class="back-button"
        @click="router.push('/giohang')"
      >
        ← Quay lại giỏ hàng
      </button>
    </div>


    <!-- =========================
         CHECKOUT
    ========================== -->
    <div
      v-else
      class="checkout-layout"
    >

      <!-- =================================
           CỘT TRÁI
      ================================== -->
      <div class="checkout-left">

        <!-- THÔNG TIN NHẬN HÀNG -->
        <section class="checkout-card">

          <div class="section-title">

            <div class="title-icon">
              📍
            </div>

            <div>
              <h2>Thông tin nhận hàng</h2>

              <p>
                Nhập chính xác thông tin để chúng tôi giao hàng
              </p>
            </div>

          </div>


          <form
            @submit.prevent="datHang"
            class="shipping-form"
          >

            <!-- HỌ TÊN -->
            <div class="form-group">

              <label>
                Họ và tên
                <span>*</span>
              </label>

              <input
                v-model.trim="shipping.ten"
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                autocomplete="name"
                :class="{
                  error: errors.ten
                }"
              />

              <small
                v-if="errors.ten"
                class="error-text"
              >
                {{ errors.ten }}
              </small>

            </div>


            <!-- SỐ ĐIỆN THOẠI -->
            <div class="form-group">

              <label>
                Số điện thoại
                <span>*</span>
              </label>

              <input
                v-model.trim="shipping.sodienthoai"
                type="tel"
                placeholder="Ví dụ: 0987654321"
                autocomplete="tel"
                :class="{
                  error: errors.sodienthoai
                }"
              />

              <small
                v-if="errors.sodienthoai"
                class="error-text"
              >
                {{ errors.sodienthoai }}
              </small>

            </div>


            <!-- ĐỊA CHỈ -->
            <div class="form-group">

              <label>
                Địa chỉ nhận hàng
                <span>*</span>
              </label>

              <div class="input-with-icon">

                <span class="input-icon">
                  📍
                </span>

                <input
                  v-model.trim="shipping.diachi"
                  type="text"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  autocomplete="street-address"
                  :class="{
                    error: errors.diachi
                  }"
                />

              </div>

              <small
                v-if="errors.diachi"
                class="error-text"
              >
                {{ errors.diachi }}
              </small>

              <small
                v-else
                class="hint"
              >
                Vui lòng nhập đầy đủ địa chỉ để tránh giao hàng nhầm.
              </small>

            </div>


            <!-- GHI CHÚ -->
            <div class="form-group">

              <label>
                Ghi chú
                <em>(Không bắt buộc)</em>
              </label>

              <textarea
                v-model.trim="shipping.ghichu"
                placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao..."
              ></textarea>

            </div>


            <!-- PHƯƠNG THỨC THANH TOÁN -->
            <div class="payment-section">

              <div class="payment-title">

                <div class="title-icon">
                  💳
                </div>

                <div>
                  <h2>Phương thức thanh toán</h2>

                  <p>
                    Chọn phương thức thanh toán phù hợp
                  </p>
                </div>

              </div>


              <!-- COD -->
              <label
                class="payment-option"
                :class="{
                  active: paymentMethod === 'cod'
                }"
              >

                <input
                  type="radio"
                  value="cod"
                  v-model="paymentMethod"
                />

                <div class="payment-icon">
                  💵
                </div>

                <div class="payment-content">

                  <strong>
                    Thanh toán khi nhận hàng
                  </strong>

                  <span>
                    Thanh toán bằng tiền mặt khi nhận được sản phẩm
                  </span>

                </div>

                <div
                  v-if="paymentMethod === 'cod'"
                  class="check"
                >
                  ✓
                </div>

              </label>


              <!-- BANK -->
              <label
                class="payment-option"
                :class="{
                  active: paymentMethod === 'bank'
                }"
              >

                <input
                  type="radio"
                  value="bank"
                  v-model="paymentMethod"
                />

                <div class="payment-icon">
                  🏦
                </div>

                <div class="payment-content">

                  <strong>
                    Chuyển khoản ngân hàng
                  </strong>

                  <span>
                    Thanh toán trước bằng hình thức chuyển khoản
                  </span>

                </div>

                <div
                  v-if="paymentMethod === 'bank'"
                  class="check"
                >
                  ✓
                </div>

              </label>

            </div>


            <!-- BUTTON -->
            <button
              type="submit"
              class="order-button"
              :disabled="loading"
            >

              <span v-if="loading">
                ⏳ Đang xử lý đơn hàng...
              </span>

              <span v-else>
                🛍️ Đặt hàng ngay
              </span>

            </button>


            <p class="secure-note">
              🔒 Thông tin của bạn được sử dụng để xử lý đơn hàng và giao hàng.
            </p>

          </form>

        </section>

      </div>


      <!-- =================================
           CỘT PHẢI
      ================================== -->
      <div class="checkout-right">

        <section class="summary-card">

          <div class="summary-header">

            <div>
              <h2>Đơn hàng của bạn</h2>

              <p>
                {{ tongSoLuong }} sản phẩm
              </p>
            </div>

            <button
              class="edit-cart"
              type="button"
              @click="router.push('/giohang')"
            >
              Sửa
            </button>

          </div>


          <!-- DANH SÁCH SẢN PHẨM -->
          <div class="product-list">

            <div
              v-for="item in cart.items"
              :key="item._id"
              class="order-item"
            >

              <div class="product-image">

                <img
                  :src="item.sanpham?.hinh"
                  :alt="item.sanpham?.ten"
                />

                <span class="quantity-badge">
                  {{ item.soluong }}
                </span>

              </div>


              <div class="product-info">

                <h3>
                  {{ item.sanpham?.ten }}
                </h3>

                <div class="variant">

                  <span>
                    Bộ nhớ:
                    <strong>
                      {{ item.bonho }}
                    </strong>
                  </span>

                  <span>
                    Màu:
                    <strong>
                      {{ item.mau }}
                    </strong>
                  </span>

                </div>

                <div class="price">

                  {{
                    formatPrice(
                      getItemPrice(item)
                    )
                  }}
                  đ

                </div>

              </div>

            </div>

          </div>


          <!-- TÍNH TIỀN -->
          <div class="price-detail">

            <div class="price-row">

              <span>
                Tạm tính
              </span>

              <strong>
                {{ formatPrice(tongTien) }} đ
              </strong>

            </div>


            <div class="price-row">

              <span>
                Phí vận chuyển
              </span>

              <strong class="free">
                Miễn phí
              </strong>

            </div>


            <div class="divider"></div>


            <div class="total-row">

              <div>

                <span>
                  Tổng cộng
                </span>

                <small>
                  Đã bao gồm VAT nếu có
                </small>

              </div>

              <strong>
                {{ formatPrice(tongTien) }} đ
              </strong>

            </div>

          </div>


          <!-- CAM KẾT -->
          <div class="benefits">

            <div>
              <span class="benefit-icon">
                🚚
              </span>

              <div>
                <strong>
                  Giao hàng tận nơi
                </strong>

                <small>
                  Đóng gói cẩn thận
                </small>
              </div>
            </div>


            <div>
              <span class="benefit-icon">
                🛡️
              </span>

              <div>
                <strong>
                  Bảo hành chính hãng
                </strong>

                <small>
                  Hỗ trợ sau mua hàng
                </small>
              </div>
            </div>


            <div>
              <span class="benefit-icon">
                🔄
              </span>

              <div>
                <strong>
                  Hỗ trợ đổi trả
                </strong>

                <small>
                  Theo chính sách cửa hàng
                </small>
              </div>
            </div>

          </div>

        </section>

      </div>

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


/* =========================
   TOKEN
========================= */

const token =
  localStorage.getItem("token");


/* =========================
   TRẠNG THÁI
========================= */

const loading =
  ref(false);

const loadingCart =
  ref(true);


/* =========================
   GIỎ HÀNG
========================= */

const cart =
  ref({
    items: []
  });


/* =========================
   THÔNG TIN NHẬN HÀNG
========================= */

const shipping =
  ref({

    ten: "",

    sodienthoai: "",

    diachi: "",

    ghichu: ""

  });


/* =========================
   LỖI FORM
========================= */

const errors =
  ref({

    ten: "",

    sodienthoai: "",

    diachi: ""

  });


/* =========================
   THANH TOÁN
========================= */

const paymentMethod =
  ref("cod");


/* =========================
   FORMAT TIỀN
========================= */

const formatPrice = (value) => {

  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {

    return "0";

  }

  return number.toLocaleString(
    "vi-VN"
  );

};


/* =========================
   LẤY GIÁ SẢN PHẨM
========================= */

const getItemPrice = (item) => {

  const product =
    item?.sanpham;


  if (
    !product ||
    product.gia == null
  ) {

    return 0;

  }


  // gia là Number

  if (
    typeof product.gia === "number"
  ) {

    return product.gia;

  }


  // gia là String

  if (
    typeof product.gia === "string"
  ) {

    return Number(
      product.gia
        .replace(/[^\d.-]/g, "")
    ) || 0;

  }


  // gia là Object theo bộ nhớ

  if (
    typeof product.gia === "object"
  ) {

    return Number(
      product.gia[item.bonho]
    ) || 0;

  }


  return 0;

};


/* =========================
   TỔNG SỐ LƯỢNG
========================= */

const tongSoLuong =
  computed(() => {

    const items =
      Array.isArray(cart.value.items)
        ? cart.value.items
        : [];


    return items.reduce(
      (sum, item) => {

        return (
          sum +
          Number(item.soluong || 0)
        );

      },
      0
    );

  });


/* =========================
   TỔNG TIỀN
========================= */

const tongTien =
  computed(() => {

    const items =
      Array.isArray(cart.value.items)
        ? cart.value.items
        : [];


    return items.reduce(
      (sum, item) => {

        const price =
          getItemPrice(item);

        const quantity =
          Number(item.soluong || 0);


        return (
          sum +
          price * quantity
        );

      },
      0
    );

  });


/* =========================
   LẤY GIỎ HÀNG
========================= */

const loadCart =
  async () => {

    loadingCart.value = true;


    try {

      const res =
        await axios.get(
          "/cart",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      cart.value = {

        ...res.data,

        items:
          Array.isArray(
            res.data?.items
          )
            ? res.data.items
            : []

      };


      console.log(
        "Giỏ hàng:",
        cart.value
      );

    }
    catch (err) {

      console.error(
        "Lỗi lấy giỏ hàng:",
        err
      );


      cart.value = {
        items: []
      };

    }
    finally {

      loadingCart.value = false;

    }

  };


/* =========================
   KIỂM TRA FORM
========================= */

const validateForm =
  () => {

    errors.value = {

      ten: "",

      sodienthoai: "",

      diachi: ""

    };


    let valid = true;


    // HỌ TÊN

    if (
      !shipping.value.ten
    ) {

      errors.value.ten =
        "Vui lòng nhập họ và tên";

      valid = false;

    }
    else if (
      shipping.value.ten.length < 2
    ) {

      errors.value.ten =
        "Họ và tên không hợp lệ";

      valid = false;

    }


    // SỐ ĐIỆN THOẠI

    if (
      !shipping.value.sodienthoai
    ) {

      errors.value.sodienthoai =
        "Vui lòng nhập số điện thoại";

      valid = false;

    }
    else if (
      !/^(0|\+84)[0-9]{9,10}$/.test(
        shipping.value.sodienthoai
      )
    ) {

      errors.value.sodienthoai =
        "Số điện thoại không hợp lệ";

      valid = false;

    }


    // ĐỊA CHỈ

    if (
      !shipping.value.diachi
    ) {

      errors.value.diachi =
        "Vui lòng nhập địa chỉ nhận hàng";

      valid = false;

    }
    else if (
      shipping.value.diachi.length < 10
    ) {

      errors.value.diachi =
        "Vui lòng nhập địa chỉ đầy đủ hơn";

      valid = false;

    }


    return valid;

  };


/* =========================
   ĐẶT HÀNG
========================= */

const datHang =
  async () => {


    // Kiểm tra form

    if (
      !validateForm()
    ) {

      return;

    }


    // Kiểm tra giỏ hàng

    if (
      !cart.value.items ||
      cart.value.items.length === 0
    ) {

      alert(
        "Giỏ hàng đang trống"
      );

      return;

    }


    loading.value = true;


    try {


      /* =========================
         CHUẨN BỊ SẢN PHẨM
      ========================= */

      const items =
        cart.value.items.map(
          (item) => ({

            productId:
              item.sanpham?._id,

            soluong:
              Number(item.soluong),

            bonho:
              item.bonho,

            mau:
              item.mau

          })
        );


      /* =========================
         TẠO ĐƠN HÀNG
      ========================= */

      const res =
        await axios.post(

          "/dathang",

          {

            items,

            shippingAddress:
              shipping.value,

            paymentMethod:
              paymentMethod.value,

            note:
              shipping.value.ghichu,

          },

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

            },

          }

        );


      /* =========================
         ĐẶT HÀNG THÀNH CÔNG
      ========================= */

      alert(

        res.data?.message ||

        "Đặt hàng thành công!"

      );


      const orderId =
        res.data.order._id;


      /* =========================
         XÓA GIỎ HÀNG
      ========================= */

      await axios.delete(

        "/cart",

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );


      /* =========================
         THANH TOÁN QR
      ========================= */

      if (
        paymentMethod.value === "bank"
      ) {

        router.push(
          `/ThanhToan/${orderId}`
        );

        return;

      }


      /* =========================
         THANH TOÁN COD
      ========================= */

      router.push(
        "/LichSuDonHang"
      );


    }
    catch (err) {

      console.error(
        "Lỗi đặt hàng:",
        err
      );


      console.error(
        "Server response:",
        err.response?.data
      );


      alert(

        err.response?.data?.message ||

        "Không thể đặt hàng. Vui lòng thử lại."

      );

    }
    finally {

      loading.value = false;

    }

  };


/* =========================
   KHỞI TẠO
========================= */

onMounted(
  loadCart
);

</script>


<style scoped>

/* ========================================
   TOÀN TRANG
======================================== */

.checkout-page {

  min-height: calc(100vh - 80px);

  padding: 35px 5% 60px;

  background:
    linear-gradient(
      180deg,
      #f8fafc 0%,
      #f1f5f9 100%
    );

  color: #111827;

}


/* ========================================
   HEADER
======================================== */

.page-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 30px;

}


.page-header h1 {

  margin: 0;

  font-size: 34px;

  font-weight: 800;

  letter-spacing: -0.5px;

}


.page-header p {

  margin: 8px 0 0;

  color: #64748b;

  font-size: 15px;

}


.secure {

  background: #ecfdf5;

  color: #15803d;

  padding: 11px 18px;

  border-radius: 999px;

  font-size: 14px;

  font-weight: 600;

}


/* ========================================
   LAYOUT
======================================== */

.checkout-layout {

  display: grid;

  grid-template-columns:
    minmax(0, 1.7fr)
    minmax(340px, .9fr);

  gap: 28px;

  align-items: start;

}


/* ========================================
   CARD
======================================== */

.checkout-card,
.summary-card {

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 18px;

  box-shadow:
    0 8px 30px
    rgba(15, 23, 42, .06);

}


/* ========================================
   LEFT
======================================== */

.checkout-card {

  padding: 30px;

}


.section-title,
.payment-title {

  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 28px;

}


.title-icon {

  width: 46px;

  height: 46px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #eff6ff;

  border-radius: 12px;

  font-size: 21px;

}


.section-title h2,
.payment-title h2 {

  margin: 0;

  font-size: 21px;

  font-weight: 750;

}


.section-title p,
.payment-title p {

  margin: 5px 0 0;

  color: #64748b;

  font-size: 13px;

}


/* ========================================
   FORM
======================================== */

.shipping-form {

  display: flex;

  flex-direction: column;

  gap: 4px;

}


.form-group {

  margin-bottom: 18px;

}


.form-group label {

  display: block;

  margin-bottom: 8px;

  font-size: 14px;

  font-weight: 650;

  color: #334155;

}


.form-group label span {

  color: #ef4444;

  margin-left: 3px;

}


.form-group label em {

  color: #94a3b8;

  font-size: 12px;

  font-style: normal;

  font-weight: 400;

}


.form-group input,
.form-group textarea {

  width: 100%;

  box-sizing: border-box;

  border: 1px solid #dbe1e8;

  background: #fff;

  border-radius: 10px;

  padding: 14px 15px;

  font-size: 15px;

  color: #111827;

  transition: .2s;

}


.form-group input {

  height: 50px;

}


.form-group textarea {

  min-height: 110px;

  resize: vertical;

}


.form-group input:focus,
.form-group textarea:focus {

  outline: none;

  border-color: #2563eb;

  box-shadow:
    0 0 0 4px
    rgba(37, 99, 235, .08);

}


.form-group input.error {

  border-color: #ef4444;

  background: #fffafa;

}


.input-with-icon {

  position: relative;

}


.input-with-icon input {

  padding-left: 44px;

}


.input-icon {

  position: absolute;

  left: 15px;

  top: 50%;

  transform: translateY(-50%);

  font-size: 17px;

}


.error-text {

  display: block;

  margin-top: 6px;

  color: #dc2626;

  font-size: 12px;

}


.hint {

  display: block;

  margin-top: 6px;

  color: #94a3b8;

  font-size: 12px;

}


/* ========================================
   PAYMENT
======================================== */

.payment-section {

  margin-top: 20px;

  padding-top: 25px;

  border-top: 1px solid #e5e7eb;

}


.payment-title {

  margin-bottom: 18px;

}


.payment-option {

  position: relative;

  display: flex;

  align-items: center;

  gap: 14px;

  padding: 17px;

  margin-bottom: 12px;

  border: 1px solid #e2e8f0;

  border-radius: 12px;

  cursor: pointer;

  transition: .2s;

}


.payment-option:hover {

  border-color: #94a3b8;

  background: #f8fafc;

}


.payment-option.active {

  border-color: #2563eb;

  background: #eff6ff;

}


.payment-option input {

  position: absolute;

  opacity: 0;

}


.payment-icon {

  width: 42px;

  height: 42px;

  display: flex;

  justify-content: center;

  align-items: center;

  background: #fff;

  border-radius: 10px;

  font-size: 20px;

}


.payment-content {

  display: flex;

  flex-direction: column;

  gap: 4px;

}


.payment-content strong {

  font-size: 14px;

  color: #1e293b;

}


.payment-content span {

  color: #64748b;

  font-size: 12px;

}


.check {

  margin-left: auto;

  width: 25px;

  height: 25px;

  display: flex;

  justify-content: center;

  align-items: center;

  background: #2563eb;

  color: white;

  border-radius: 50%;

  font-size: 13px;

  font-weight: bold;

}


/* ========================================
   BUTTON ĐẶT HÀNG
======================================== */

.order-button {

  width: 100%;

  height: 55px;

  margin-top: 15px;

  border: none;

  border-radius: 11px;

  background:
    linear-gradient(
      135deg,
      #16a34a,
      #15803d
    );

  color: white;

  font-size: 16px;

  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 8px 20px
    rgba(22, 163, 74, .2);

  transition: .2s;

}


.order-button:hover {

  transform: translateY(-1px);

  box-shadow:
    0 10px 25px
    rgba(22, 163, 74, .28);

}


.order-button:disabled {

  opacity: .65;

  cursor: not-allowed;

  transform: none;

}


.secure-note {

  text-align: center;

  margin: 13px 0 0;

  color: #94a3b8;

  font-size: 12px;

}


/* ========================================
   SUMMARY
======================================== */

.summary-card {

  padding: 25px;

  position: sticky;

  top: 20px;

}


.summary-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding-bottom: 18px;

  border-bottom: 1px solid #e5e7eb;

}


.summary-header h2 {

  margin: 0;

  font-size: 21px;

}


.summary-header p {

  margin: 5px 0 0;

  color: #64748b;

  font-size: 13px;

}


.edit-cart {

  border: none;

  background: #eff6ff;

  color: #2563eb;

  padding: 8px 13px;

  border-radius: 8px;

  font-weight: 600;

  cursor: pointer;

}


/* ========================================
   PRODUCT
======================================== */

.product-list {

  max-height: 430px;

  overflow-y: auto;

}


.order-item {

  display: flex;

  gap: 14px;

  padding: 18px 0;

  border-bottom: 1px solid #f1f5f9;

}


.product-image {

  width: 76px;

  height: 76px;

  flex-shrink: 0;

  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #f8fafc;

  border-radius: 12px;

}


.product-image img {

  width: 65px;

  height: 65px;

  object-fit: contain;

}


.quantity-badge {

  position: absolute;

  top: -7px;

  right: -7px;

  min-width: 22px;

  height: 22px;

  padding: 0 5px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #111827;

  color: white;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 700;

}


.product-info {

  min-width: 0;

  flex: 1;

}


.product-info h3 {

  margin: 0 0 7px;

  font-size: 15px;

  color: #111827;

}


.variant {

  display: flex;

  flex-direction: column;

  gap: 3px;

  color: #64748b;

  font-size: 12px;

}


.variant strong {

  color: #334155;

}


.price {

  margin-top: 8px;

  font-size: 14px;

  font-weight: 700;

  color: #dc2626;

}


/* ========================================
   PRICE
======================================== */

.price-detail {

  padding-top: 20px;

}


.price-row {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 13px;

  color: #64748b;

  font-size: 14px;

}


.price-row strong {

  color: #334155;

}


.price-row .free {

  color: #16a34a;

}


.divider {

  height: 1px;

  background: #e5e7eb;

  margin: 18px 0;

}


.total-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

}


.total-row div {

  display: flex;

  flex-direction: column;

  gap: 4px;

}


.total-row span {

  font-size: 17px;

  font-weight: 700;

}


.total-row small {

  color: #94a3b8;

  font-size: 11px;

}


.total-row strong {

  color: #dc2626;

  font-size: 24px;

}


/* ========================================
   BENEFITS
======================================== */

.benefits {

  margin-top: 22px;

  padding-top: 20px;

  border-top: 1px solid #e5e7eb;

}


.benefits > div {

  display: flex;

  gap: 12px;

  padding: 10px 0;

}


.benefit-icon {

  width: 34px;

  height: 34px;

  flex-shrink: 0;

  display: flex;

  justify-content: center;

  align-items: center;

  background: #f8fafc;

  border-radius: 9px;

}


.benefits div div {

  display: flex;

  flex-direction: column;

  gap: 3px;

}


.benefits strong {

  font-size: 12px;

  color: #334155;

}


.benefits small {

  color: #94a3b8;

  font-size: 11px;

}


/* ========================================
   LOADING
======================================== */

.loading-box {

  min-height: 400px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  color: #64748b;

}


.spinner {

  width: 38px;

  height: 38px;

  border: 4px solid #e2e8f0;

  border-top-color: #2563eb;

  border-radius: 50%;

  animation:
    spin .8s linear infinite;

}


@keyframes spin {

  to {

    transform: rotate(360deg);

  }

}


/* ========================================
   EMPTY
======================================== */

.empty-box {

  max-width: 600px;

  margin: 50px auto;

  padding: 60px 30px;

  text-align: center;

  background: white;

  border-radius: 18px;

  box-shadow:
    0 8px 30px
    rgba(15, 23, 42, .06);

}


.empty-icon {

  font-size: 55px;

  margin-bottom: 15px;

}


.empty-box h2 {

  margin-bottom: 8px;

}


.empty-box p {

  color: #64748b;

}


.back-button {

  margin-top: 20px;

  padding: 12px 22px;

  border: none;

  border-radius: 9px;

  background: #111827;

  color: white;

  cursor: pointer;

  font-weight: 600;

}


/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 1000px) {

  .checkout-layout {

    grid-template-columns: 1fr;

  }

  .summary-card {

    position: static;

  }

}


@media (max-width: 700px) {

  .checkout-page {

    padding: 25px 15px 40px;

  }


  .page-header {

    flex-direction: column;

    align-items: flex-start;

    gap: 15px;

  }


  .page-header h1 {

    font-size: 28px;

  }


  .secure {

    font-size: 12px;

  }


  .checkout-card,
  .summary-card {

    padding: 20px;

    border-radius: 14px;

  }


  .section-title h2,
  .payment-title h2 {

    font-size: 18px;

  }


  .product-image {

    width: 65px;

    height: 65px;

  }


  .product-image img {

    width: 55px;

    height: 55px;

  }


  .total-row strong {

    font-size: 20px;

  }

}

</style>