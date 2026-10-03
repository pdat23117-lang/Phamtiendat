<template>

  <div class="payment-page">

    <div class="payment-container">

      <!-- HEADER -->

      <div class="payment-header">

        <div class="success-icon">
          ✓
        </div>

        <h1>
          Đặt hàng thành công
        </h1>

        <p>
          Vui lòng chuyển khoản theo thông tin bên dưới
        </p>

      </div>


      <!-- THÔNG TIN ĐƠN -->

      <div class="order-info">

        <div>
          <span>Mã đơn hàng</span>

          <strong>
            {{ orderId }}
          </strong>
        </div>

        <div>
          <span>Tổng thanh toán</span>

          <strong class="price">
            {{ formatMoney(order.thanhTien) }} đ
          </strong>
        </div>

      </div>


      <!-- THANH TOÁN -->

      <div class="payment-card">

        <div class="bank-info">

          <h2>
            🏦 Thông tin chuyển khoản
          </h2>

          <div class="info-row">

            <span>Ngân hàng</span>

            <strong>
              MB Bank
            </strong>

          </div>


          <div class="info-row">

            <span>Số tài khoản</span>

            <strong>
              0966071492
            </strong>

          </div>


          <div class="info-row">

            <span>Chủ tài khoản</span>

            <strong>
              PHAM TIEN DAT
            </strong>

          </div>


          <div class="amount-box">

            <span>
              Số tiền cần chuyển
            </span>

            <strong>
              {{ formatMoney(order.thanhTien) }} đ
            </strong>

          </div>


          <div class="transfer-content">

            <span>
              Nội dung chuyển khoản
            </span>

            <strong>
              DATMOBILE {{ shortOrderId }}
            </strong>

          </div>

        </div>


        <!-- QR -->

        <div class="qr-section">

          <h2>
            📱 Quét mã QR
          </h2>

          <img
            :src="qrUrl"
            alt="QR thanh toán"
            class="qr-image"
          />

          <p>
            Mở ứng dụng ngân hàng và quét mã QR
          </p>

        </div>

      </div>


      <!-- LƯU Ý -->

      <div class="notice">

        <strong>
          ⚠️ Lưu ý
        </strong>

        <ul>

          <li>
            Vui lòng chuyển đúng số tiền.
          </li>

          <li>
            Vui lòng ghi đúng nội dung chuyển khoản.
          </li>

          <li>
            Đơn hàng sẽ được xử lý sau khi cửa hàng xác nhận giao dịch.
          </li>

        </ul>

      </div>


      <!-- BUTTON -->

      <button
        class="confirm-btn"
        :disabled="loading"
        @click="confirmPayment"
      >

        {{
          loading
            ? "Đang xử lý..."
            : "✓ Tôi đã chuyển khoản"
        }}

      </button>


      <button
        class="back-btn"
        @click="router.push('/LichSuDonHang')"
      >

        Xem đơn hàng

      </button>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from "vue";

import axios from "axios";

import {
  useRoute,
  useRouter
} from "vue-router";


const route =
  useRoute();

const router =
  useRouter();


const token =
  localStorage.getItem(
    "token"
  );


const order =
  ref({});


const loading =
  ref(false);


const orderId =
  route.params.id;


// =============================
// MÃ ĐƠN NGẮN
// =============================

const shortOrderId =
  computed(() => {

    return orderId
      ? orderId
          .substring(0, 8)
          .toUpperCase()
      : "";

  });


// =============================
// QR VIETQR
// =============================

const qrUrl =
  computed(() => {

    const amount =
      Number(
        order.value.thanhTien
      ) || 0;

    const content =
      `DATMOBILE ${shortOrderId.value}`;

    return `https://img.vietqr.io/image/MB-0123456789-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=PHAM%20TIEN%20DAT`;

  });


// =============================
// FORMAT TIỀN
// =============================

const formatMoney =
  (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "vi-VN"
    );

  };


// =============================
// LẤY ĐƠN HÀNG
// =============================

const loadOrder =
  async () => {

    try {

      const res =
        await axios.get(
          `/dathang/${orderId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      order.value =
        res.data;

    } catch (err) {

      console.error(
        err
      );

      alert(
        "Không thể tải thông tin đơn hàng"
      );

      router.push(
        "/LichSuDonHang"
      );

    }

  };


// =============================
// XÁC NHẬN ĐÃ CHUYỂN
// =============================

const confirmPayment =
  async () => {

    if (loading.value)
      return;

    loading.value =
      true;

    try {

      const res =
        await axios.put(

          `/dathang/${orderId}/confirm-bank`,

          {},

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );

      alert(
        res.data.message
      );

      // Xóa giỏ hàng
      await axios.delete(
        "/cart",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      router.push(
        "/LichSuDonHang"
      );

    } catch (err) {

      console.error(
        err
      );

      alert(
        err.response?.data?.message ||
        "Không thể xác nhận thanh toán"
      );

    } finally {

      loading.value =
        false;

    }

  };


onMounted(
  loadOrder
);

</script>


<style scoped>

.payment-page {

  min-height: 100vh;

  background:
    #f5f7fb;

  padding:
    50px 20px;

}


.payment-container {

  max-width:
    1000px;

  margin:
    auto;

}


/* HEADER */

.payment-header {

  text-align:
    center;

  margin-bottom:
    30px;

}


.success-icon {

  width:
    70px;

  height:
    70px;

  margin:
    0 auto 15px;

  border-radius:
    50%;

  background:
    #16a34a;

  color:
    white;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    40px;

  font-weight:
    bold;

}


.payment-header h1 {

  margin:
    0 0 10px;

  font-size:
    32px;

  color:
    #111827;

}


.payment-header p {

  color:
    #6b7280;

}


/* ORDER INFO */

.order-info {

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

  gap:
    20px;

  margin-bottom:
    20px;

}


.order-info > div {

  background:
    white;

  padding:
    22px;

  border-radius:
    14px;

  box-shadow:
    0 4px 15px
    rgba(0,0,0,.06);

}


.order-info span {

  display:
    block;

  color:
    #6b7280;

  margin-bottom:
    8px;

}


.order-info strong {

  font-size:
    18px;

}


.price {

  color:
    #dc2626;

  font-size:
    24px !important;

}


/* PAYMENT CARD */

.payment-card {

  background:
    white;

  border-radius:
    16px;

  padding:
    35px;

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

  gap:
    50px;

  box-shadow:
    0 5px 20px
    rgba(0,0,0,.07);

}


.payment-card h2 {

  margin-top:
    0;

  margin-bottom:
    25px;

}


.info-row {

  display:
    flex;

  justify-content:
    space-between;

  gap:
    20px;

  padding:
    16px 0;

  border-bottom:
    1px solid #eee;

}


.info-row span {

  color:
    #6b7280;

}


.info-row strong {

  text-align:
    right;

}


.amount-box {

  margin-top:
    20px;

  padding:
    20px;

  border-radius:
    12px;

  background:
    #fff7ed;

  border:
    1px solid #fed7aa;

}


.amount-box span {

  display:
    block;

  color:
    #9a3412;

  margin-bottom:
    8px;

}


.amount-box strong {

  color:
    #dc2626;

  font-size:
    28px;

}


.transfer-content {

  margin-top:
    20px;

  padding:
    20px;

  border-radius:
    12px;

  background:
    #eff6ff;

}


.transfer-content span {

  display:
    block;

  color:
    #1d4ed8;

  margin-bottom:
    8px;

}


.transfer-content strong {

  color:
    #1e40af;

  font-size:
    20px;

}


/* QR */

.qr-section {

  text-align:
    center;

  border-left:
    1px solid #eee;

  padding-left:
    40px;

}


.qr-image {

  width:
    300px;

  max-width:
    100%;

  border:
    10px solid white;

  border-radius:
    12px;

  box-shadow:
    0 4px 15px
    rgba(0,0,0,.12);

}


.qr-section p {

  color:
    #6b7280;

  margin-top:
    15px;

}


/* NOTICE */

.notice {

  background:
    #fffbeb;

  border:
    1px solid #fde68a;

  border-radius:
    14px;

  padding:
    20px;

  margin-top:
    20px;

}


.notice strong {

  color:
    #92400e;

}


.notice ul {

  margin:
    12px 0 0;

  padding-left:
    20px;

  color:
    #78350f;

}


.notice li {

  margin-bottom:
    6px;

}


/* BUTTON */

.confirm-btn {

  width:
    100%;

  border:
    none;

  background:
    #16a34a;

  color:
    white;

  padding:
    17px;

  border-radius:
    12px;

  font-size:
    17px;

  font-weight:
    600;

  margin-top:
    25px;

  cursor:
    pointer;

}


.confirm-btn:hover {

  background:
    #15803d;

}


.confirm-btn:disabled {

  opacity:
    .6;

  cursor:
    not-allowed;

}


.back-btn {

  width:
    100%;

  border:
    1px solid #d1d5db;

  background:
    white;

  color:
    #374151;

  padding:
    15px;

  border-radius:
    12px;

  font-size:
    16px;

  margin-top:
    12px;

  cursor:
    pointer;

}


.back-btn:hover {

  background:
    #f3f4f6;

}


/* MOBILE */

@media (
  max-width: 768px
) {

  .payment-page {

    padding:
      25px 15px;

  }


  .order-info {

    grid-template-columns:
      1fr;

  }


  .payment-card {

    grid-template-columns:
      1fr;

    padding:
      22px;

  }


  .qr-section {

    border-left:
      none;

    border-top:
      1px solid #eee;

    padding-left:
      0;

    padding-top:
      30px;

  }


  .payment-header h1 {

    font-size:
      26px;

  }

}

</style>