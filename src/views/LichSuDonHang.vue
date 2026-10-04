<template>
  <div class="container">

    <!-- TIÊU ĐỀ -->
    <div class="page-title">
      <h1>Lịch sử đơn hàng</h1>
      <p>Theo dõi và quản lý các đơn hàng của bạn</p>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải đơn hàng...</p>
    </div>

    <!-- CHƯA CÓ ĐƠN -->
    <div
      v-else-if="orders.length === 0"
      class="empty"
    >
      <div class="empty-icon">🛒</div>

      <h2>Bạn chưa có đơn hàng nào</h2>

      <p>
        Hãy khám phá các sản phẩm và bắt đầu mua sắm ngay!
      </p>

      <RouterLink to="/sanpham">
        <button class="buy-btn">
          🛍️ Mua ngay
        </button>
      </RouterLink>
    </div>

    <!-- DANH SÁCH ĐƠN -->
    <div
      v-else
      class="list"
    >

      <div
        class="order"
        v-for="order in orders"
        :key="order._id"
      >

        <!-- HEADER -->
        <div class="header">

          <div class="order-info">

            <h3>
              Mã đơn:
              <span>{{ order._id }}</span>
            </h3>

            <p>
              🕒 {{ formatDate(order.createdAt) }}
            </p>

          </div>

          <span
            class="status"
            :class="order.status"
          >
            {{ getStatus(order.status) }}
          </span>

        </div>


        <!-- THÔNG TIN THANH TOÁN -->
        <div class="payment-info">

          <div class="payment-method">

  <span
    v-if="
      order.paymentMethod === 'cod'
    "
    class="method cod-method"
  >
    💵 Thanh toán khi nhận hàng
  </span>


  <span
    v-if="
      order.paymentMethod === 'bank'
    "
    class="method bank-method"
  >
    📱 Thanh toán bằng QR
  </span>

</div>


          <!-- TRẠNG THÁI THANH TOÁN -->
          <span
            v-if="order.paymentMethod === 'bank'"
            class="payment-status"
            :class="getPaymentClass(order)"
          >
            {{ getPaymentText(order) }}
          </span>

        </div>


        <!-- SẢN PHẨM -->
        <div
          class="item"
          v-for="sp in order.items"
          :key="getProductId(sp)"
        >

          <!-- ẢNH -->
          <div class="image-box">

            <img
              :src="getImage(sp.hinh)"
              :alt="sp.ten"
            />

          </div>


          <!-- THÔNG TIN -->
          <div class="info">

            <h4>
              {{ sp.ten }}
            </h4>

            <p>
              Số lượng:
              <strong>{{ sp.soluong }}</strong>
            </p>

            <!-- BỘ NHỚ -->
            <p
              v-if="sp.bonho"
              class="variant"
            >
              Bộ nhớ:
              <span>{{ sp.bonho }}</span>
            </p>

            <!-- MÀU -->
            <p
              v-if="sp.mau"
              class="variant"
            >
              Màu:
              <span>{{ sp.mau }}</span>
            </p>

          </div>


          <!-- GIÁ -->
          <div class="item-price">

            <strong>
              {{
                (
                  Number(sp.gia) *
                  Number(sp.soluong)
                ).toLocaleString("vi-VN")
              }}đ
            </strong>

            <small>
              {{
                Number(sp.gia).toLocaleString("vi-VN")
              }}đ / sản phẩm
            </small>

          </div>


          <!-- ĐÁNH GIÁ -->
          <div
            v-if="order.status === 'delivered'"
            class="review-box"
          >

            <button
              v-if="!reviewed[getProductId(sp)]"
              class="review-btn"
              @click="
                router.push(
                  `/danhgia/${getProductId(sp)}`
                )
              "
            >
              ⭐ Đánh giá
            </button>

            <button
              v-else
              class="reviewed-btn"
              disabled
            >
              ✓ Đã đánh giá
            </button>

          </div>

        </div>


        <div class="footer">

  <div class="total">

    <span>
      Tổng thanh toán
    </span>

    <strong>
      {{
        Number(
          order.thanhTien || 0
        ).toLocaleString("vi-VN")
      }}đ
    </strong>

  </div>


  <div class="actions">

    <!-- =========================
         THANH TOÁN QR
    ========================== -->

    <button
      v-if="
        order.paymentMethod === 'bank' &&
        order.paymentStatus === 'unpaid' &&
        !order.isPaid &&
        order.status === 'pending'
      "
      class="pay-btn"
      @click="
        router.push(
          `/ThanhToan/${order._id}`
        )
      "
    >
      💳 Thanh toán ngay
    </button>


    <!-- =========================
         ĐỔI PHƯƠNG THỨC
    ========================== -->

    <button
  v-if="
    order.status === 'pending' &&
    !order.isPaid &&
    order.paymentStatus !== 'waiting'
  "
  class="change-payment-btn"
  @click="openPaymentModal(order)"
>
  🔄 Đổi phương thức
</button>


    <!-- =========================
         CHỜ XÁC NHẬN
    ========================== -->

    <span
      v-if="
        order.paymentMethod === 'bank' &&
        order.paymentStatus === 'waiting'
      "
      class="waiting-payment"
    >
      ⏳ Chờ nhân viên xác nhận
    </span>


    <!-- =========================
         ĐÃ THANH TOÁN
    ========================== -->

    <span
      v-if="
        order.isPaid ||
        order.paymentStatus === 'paid'
      "
      class="paid-payment"
    >
      ✓ Đã thanh toán
    </span>


    <!-- =========================
         HỦY ĐƠN
    ========================== -->

    <button
      v-if="
        order.status === 'pending'
      "
      class="cancel-btn"
      @click="
        huyDon(order._id)
      "
    >
      Hủy đơn
    </button>

  </div>

</div>

      </div>

    </div>

  </div>

  <!-- =========================
     MODAL ĐỔI PHƯƠNG THỨC
========================= -->

<div
  v-if="showPaymentModal"
  class="payment-modal-overlay"
  @click.self="closePaymentModal"
>

  <div class="payment-modal">

    <div class="modal-header">

      <div>
        <h2>
          Đổi phương thức thanh toán
        </h2>

        <p>
          Chọn phương thức bạn muốn sử dụng
        </p>
      </div>

      <button
        class="close-modal"
        @click="closePaymentModal"
      >
        ×
      </button>

    </div>


    <div class="payment-options">

      <!-- COD -->

      <button
        class="payment-option"
        :class="{
          selected:
            selectedPaymentMethod === 'cod'
        }"
        @click="
          selectedPaymentMethod = 'cod'
        "
      >

        <div class="payment-icon cod-icon">
          💵
        </div>

        <div class="payment-option-info">

          <strong>
            Thanh toán khi nhận hàng
          </strong>

          <span>
            Thanh toán tiền khi nhận được hàng
          </span>

        </div>

        <div class="radio">

          <span
            v-if="
              selectedPaymentMethod === 'cod'
            "
          >
            ✓
          </span>

        </div>

      </button>


      <!-- QR -->

      <button
        class="payment-option"
        :class="{
          selected:
            selectedPaymentMethod === 'bank'
        }"
        @click="
          selectedPaymentMethod = 'bank'
        "
      >

        <div class="payment-icon bank-icon">
          📱
        </div>

        <div class="payment-option-info">

          <strong>
            Thanh toán bằng QR
          </strong>

          <span>
            Chuyển khoản ngân hàng bằng mã QR
          </span>

        </div>

        <div class="radio">

          <span
            v-if="
              selectedPaymentMethod === 'bank'
            "
          >
            ✓
          </span>

        </div>

      </button>

    </div>


    <div class="modal-actions">

      <button
        class="modal-cancel"
        @click="closePaymentModal"
      >
        Hủy
      </button>

      <button
        class="modal-confirm"
        :disabled="
          !selectedPaymentMethod ||
          selectedPaymentMethod ===
          selectedOrder?.paymentMethod
        "
        @click="confirmChangePayment"
      >
        Xác nhận thay đổi
      </button>

    </div>

  </div>

</div>
</template>


<script setup>

import {
  ref,
  onMounted
} from "vue";

import {
  useRouter
} from "vue-router";

import axios from "axios";


const router = useRouter();


const token =
  localStorage.getItem("token");


const loading =
  ref(true);


const orders =
  ref([]);


const reviewed =
  ref({});

// ==============================
// MODAL ĐỔI PHƯƠNG THỨC
// ==============================

const showPaymentModal = ref(false);

const selectedOrder = ref(null);

const selectedPaymentMethod = ref("");

/* =========================
   LẤY ID SẢN PHẨM
========================= */

const getProductId = (sp) => {

  return (
    sp.product ||
    sp.sanpham ||
    sp.productId
  );

};



/* =========================
   XỬ LÝ ẢNH
========================= */

const getImage = (image) => {

  if (!image) {

    return "/images/no-image.png";

  }

  // Nếu backend đã trả URL đầy đủ
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {

    return image;

  }

  // Nếu đã có / ở đầu
  if (image.startsWith("/")) {

    return image;

  }

  return `/${image}`;

};



/* =========================
   LOAD ĐƠN HÀNG
========================= */

const loadOrders =
async () => {

  try {

    const res =
      await axios.get(
        "/dathang/my",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    orders.value =
      res.data;


    reviewed.value = {};


    /*
      Kiểm tra sản phẩm
      đã được đánh giá hay chưa
    */

    for (
      const order
      of orders.value
    ) {

      for (
        const sp
        of order.items
      ) {

        const productId =
          getProductId(sp);


        if (!productId) {
          continue;
        }


        try {

          const result =
            await axios.get(
              `/sanpham/${productId}/check-review`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );


          reviewed.value[productId] =
            result.data.reviewed;

        }
        catch (error) {

          console.log(
            "Không kiểm tra được đánh giá:",
            error
          );

        }

      }

    }


    console.log(
      "Danh sách đơn hàng:",
      res.data
    );

  }
  catch (err) {

    console.log(
      "Lỗi lấy đơn hàng:",
      err
    );

  }
  finally {

    loading.value = false;

  }

};


// ==============================
// MỞ MODAL
// ==============================

const openPaymentModal = (order) => {

  selectedOrder.value = order;

  selectedPaymentMethod.value =
    order.paymentMethod === "cod"
      ? "bank"
      : "cod";

  showPaymentModal.value = true;

};


// ==============================
// ĐÓNG MODAL
// ==============================

const closePaymentModal = () => {

  showPaymentModal.value = false;

  selectedOrder.value = null;

  selectedPaymentMethod.value = "";

};


// ==============================
// XÁC NHẬN ĐỔI
// ==============================

const confirmChangePayment = async () => {

  if (!selectedOrder.value) {
    return;
  }

  if (!selectedPaymentMethod.value) {
    return;
  }


  if (
    selectedPaymentMethod.value ===
    selectedOrder.value.paymentMethod
  ) {

    return;

  }


  try {

    const res =
      await axios.put(

        `/dathang/${selectedOrder.value._id}/change-payment`,

        {
          paymentMethod:
            selectedPaymentMethod.value,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


    alert(
      res.data.message ||
      "Đổi phương thức thanh toán thành công"
    );


    closePaymentModal();


    // Tải lại danh sách đơn hàng
    await loadOrders();

  }
  catch (err) {

    console.error(err);

    alert(

      err.response?.data?.message ||
      "Không thể đổi phương thức thanh toán"

    );

  }

};
/* =========================
   THANH TOÁN LẠI
========================= */

const thanhToanLai =
(orderId) => {

  router.push(
    `/ThanhToan/${orderId}`
  );

};



/* =========================
   KIỂM TRA ĐÃ THANH TOÁN
========================= */

const isPaid =
(order) => {

  return (
    order.paymentStatus === "paid" ||
    order.isPaid === true
  );

};



/* =========================
   TRẠNG THÁI THANH TOÁN
========================= */

const getPaymentText =
(order) => {

  if (
    order.paymentStatus === "paid" ||
    order.isPaid === true
  ) {

    return "Đã thanh toán";

  }


  if (
    order.paymentStatus === "waiting"
  ) {

    return "Chờ xác nhận thanh toán";

  }


  if (
    order.paymentStatus === "failed"
  ) {

    return "Thanh toán thất bại";

  }


  return "Chưa thanh toán";

};



/* =========================
   CLASS TRẠNG THÁI THANH TOÁN
========================= */

const getPaymentClass =
(order) => {

  if (isPaid(order)) {

    return "paid";

  }


  if (
    order.paymentStatus === "waiting"
  ) {

    return "waiting";

  }


  if (
    order.paymentStatus === "failed"
  ) {

    return "failed";

  }


  return "unpaid";

};



/* =========================
   DÒNG MÔ TẢ THANH TOÁN
========================= */

const getPaymentStatus =
(order) => {

  if (isPaid(order)) {

    return "Giao dịch đã được xác nhận";

  }


  if (
    order.paymentStatus === "waiting"
  ) {

    return "Đang chờ xác nhận chuyển khoản";

  }


  return "Bạn chưa hoàn tất thanh toán";

};



/* =========================
   HỦY ĐƠN
========================= */

const huyDon =
async (id) => {

  if (
    !confirm(
      "Bạn có chắc muốn hủy đơn hàng?"
    )
  ) {

    return;

  }


  try {

    await axios.put(

      `/dathang/${id}/cancel`,

      {},

      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }

    );


    alert(
      "Hủy đơn thành công"
    );


    await loadOrders();

  }
  catch (err) {

    alert(
      err.response?.data?.message ||
      "Không thể hủy đơn hàng"
    );

  }

};



/* =========================
   FORMAT NGÀY
========================= */

const formatDate =
(date) => {

  return new Date(date)
    .toLocaleString(
      "vi-VN"
    );

};



/* =========================
   TRẠNG THÁI ĐƠN
========================= */

const getStatus =
(status) => {

  switch (status) {

    case "pending":
      return "Chờ xác nhận";

    case "processing":
      return "Đang xử lý";

    case "shipping":
      return "Đang giao";

    case "delivered":
      return "Đã giao";

    case "cancelled":
      return "Đã hủy";

    default:
      return status;

  }

};



onMounted(
  loadOrders
);

</script>


<style scoped>

/* =========================
   CONTAINER
========================= */

.container {

  max-width: 1200px;

  margin: 0 auto;

  padding: 45px 25px;

  min-height: 80vh;

}


/* =========================
   TITLE
========================= */

.page-title {

  margin-bottom: 35px;

}

.page-title h1 {

  font-size: 34px;

  margin: 0 0 8px;

  font-weight: 700;

  color: #111;

}

.page-title p {

  margin: 0;

  color: #777;

  font-size: 15px;

}


/* =========================
   LOADING
========================= */

.loading {

  text-align: center;

  padding: 100px 20px;

  color: #666;

}

.spinner {

  width: 40px;

  height: 40px;

  margin: 0 auto 15px;

  border: 4px solid #eee;

  border-top-color: #111;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

}

@keyframes spin {

  to {

    transform: rotate(360deg);

  }

}


/* =========================
   EMPTY
========================= */

.empty {

  background: white;

  border-radius: 20px;

  padding: 80px 20px;

  text-align: center;

  box-shadow:
    0 5px 25px
    rgba(0,0,0,.06);

}

.empty-icon {

  font-size: 60px;

  margin-bottom: 15px;

}

.empty h2 {

  margin: 0 0 10px;

}

.empty p {

  color: #777;

}


.buy-btn {

  margin-top: 20px;

  padding: 13px 28px;

  border: none;

  border-radius: 10px;

  background: #111;

  color: white;

  cursor: pointer;

  font-size: 15px;

  font-weight: 600;

  transition: .2s;

}

.buy-btn:hover {

  background: #333;

  transform: translateY(-1px);

}


/* =========================
   LIST
========================= */

.list {

  display: flex;

  flex-direction: column;

  gap: 25px;

}


/* =========================
   ORDER
========================= */

.order {

  background: white;

  padding: 25px;

  border-radius: 18px;

  box-shadow:
    0 5px 20px
    rgba(0,0,0,.07);

  border: 1px solid #eee;

}


/* =========================
   HEADER
========================= */

.header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 20px;

  margin-bottom: 20px;

}

.order-info h3 {

  margin: 0 0 8px;

  font-size: 16px;

}

.order-info h3 span {

  font-weight: 500;

  color: #555;

  word-break: break-all;

}

.order-info p {

  margin: 0;

  color: #777;

  font-size: 14px;

}


/* =========================
   ORDER STATUS
========================= */

.status {

  padding: 8px 17px;

  border-radius: 30px;

  color: white;

  font-weight: 600;

  font-size: 13px;

  white-space: nowrap;

}

.status.pending {

  background: #f59e0b;

}

.status.processing {

  background: #3b82f6;

}

.status.shipping {

  background: #6366f1;

}

.status.delivered {

  background: #16a34a;

}

.status.cancelled {

  background: #ef4444;

}


/* =========================
   PAYMENT
========================= */

.payment-info {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 15px;

  margin-bottom: 5px;

  border-radius: 12px;

  background: #f8fafc;

  border: 1px solid #eee;

}

.payment-method {

  display: flex;

  align-items: center;

  gap: 12px;

}

.payment-icon {

  width: 42px;

  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: white;

  font-size: 21px;

}

.payment-method strong {

  display: block;

  font-size: 14px;

  margin-bottom: 4px;

}

.payment-method small {

  color: #777;

}

.payment-status {

  padding: 7px 12px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 600;

}

.payment-status.paid {

  color: #15803d;

  background: #dcfce7;

}

.payment-status.waiting {

  color: #a16207;

  background: #fef3c7;

}

.payment-status.unpaid {

  color: #b91c1c;

  background: #fee2e2;

}

.payment-status.failed {

  color: #b91c1c;

  background: #fee2e2;

}


/* =========================
   ITEM
========================= */

.item {

  display: flex;

  align-items: center;

  gap: 18px;

  padding: 20px 0;

  border-top: 1px solid #eee;

}


/* =========================
   IMAGE
========================= */

.image-box {

  width: 90px;

  height: 90px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  background: #fafafa;

  border-radius: 12px;

  overflow: hidden;

}

.image-box img {

  width: 100%;

  height: 100%;

  object-fit: contain;

}


/* =========================
   INFO
========================= */

.info {

  flex: 1;

  min-width: 150px;

}

.info h4 {

  margin: 0 0 8px;

  font-size: 17px;

  color: #111;

}

.info p {

  margin: 4px 0;

  color: #777;

  font-size: 14px;

}

.info p strong {

  color: #111;

}

.variant span {

  padding: 3px 8px;

  background: #f1f1f1;

  border-radius: 5px;

  color: #333;

}


/* =========================
   PRICE
========================= */

.item-price {

  text-align: right;

  min-width: 150px;

}

.item-price strong {

  display: block;

  color: #e11d48;

  font-size: 17px;

}

.item-price small {

  display: block;

  margin-top: 5px;

  color: #999;

}


/* =========================
   REVIEW
========================= */

.review-box {

  min-width: 110px;

}

.review-btn,
.reviewed-btn {

  padding: 9px 14px;

  border-radius: 8px;

  font-size: 13px;

  cursor: pointer;

}

.review-btn {

  border: none;

  background: #111;

  color: white;

}

.review-btn:hover {

  background: #333;

}

.reviewed-btn {

  border: 1px solid #ddd;

  background: #f5f5f5;

  color: #777;

}


/* =========================
   FOOTER
========================= */

.footer {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 20px;

  padding-top: 20px;

  border-top: 1px solid #ddd;

}


/* =========================
   TOTAL
========================= */

.total span {

  display: block;

  color: #777;

  font-size: 14px;

  margin-bottom: 5px;

}

.total strong {

  color: #e11d48;

  font-size: 24px;

}


/* =========================
   ACTIONS
========================= */

.actions {

  display: flex;

  align-items: center;

  gap: 10px;

}


/* THANH TOÁN */

.pay-btn {

  padding: 12px 20px;

  border: none;

  border-radius: 10px;

  background: #16a34a;

  color: white;

  cursor: pointer;

  font-weight: 600;

  font-size: 14px;

  transition: .2s;

}

.pay-btn:hover {

  background: #15803d;

  transform: translateY(-1px);

}


/* ĐÃ THANH TOÁN */

.paid-label {

  padding: 11px 17px;

  border-radius: 10px;

  background: #dcfce7;

  color: #15803d;

  font-weight: 600;

  font-size: 14px;

}


/* HỦY */

.cancel-btn {

  padding: 12px 20px;

  border: none;

  border-radius: 10px;

  background: #ef4444;

  color: white;

  cursor: pointer;

  font-size: 14px;

  font-weight: 600;

  transition: .2s;

}

.cancel-btn:hover {

  background: #dc2626;

}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 900px) {

  .container {

    padding: 30px 20px;

  }

  .item {

    flex-wrap: wrap;

  }

  .item-price {

    text-align: left;

  }

  .review-box {

    width: 100%;

  }

  .footer {

    flex-direction: column;

    align-items: flex-start;

  }

  .actions {

    width: 100%;

  }

}


@media (max-width: 650px) {

  .page-title h1 {

    font-size: 28px;

  }

  .header {

    flex-direction: column;

    align-items: flex-start;

  }

  .status {

    width: 100%;

    text-align: center;

  }

  .payment-info {

    flex-direction: column;

    align-items: flex-start;

  }

  .payment-status {

    width: 100%;

    text-align: center;

  }

  .item {

    align-items: flex-start;

  }

  .image-box {

    width: 75px;

    height: 75px;

  }

  .info {

    min-width: calc(100% - 100px);

  }

  .item-price {

    width: 100%;

    text-align: left;

    padding-left: 93px;

  }

  .footer {

    align-items: stretch;

  }

  .actions {

    flex-direction: column;

    align-items: stretch;

  }

  .pay-btn,
  .cancel-btn {

    width: 100%;

  }

}


@media (max-width: 480px) {

  .container {

    padding: 25px 15px;

  }

  .order {

    padding: 18px;

  }

  .item-price {

    padding-left: 0;

  }

  .total strong {

    font-size: 21px;

  }

}
/* =========================
   PAYMENT MODAL
========================= */

.payment-modal-overlay {
  position: fixed;

  inset: 0;

  background: rgba(15, 23, 42, 0.55);

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 20px;

  z-index: 9999;
}


.payment-modal {
  width: 100%;

  max-width: 520px;

  background: white;

  border-radius: 18px;

  padding: 26px;

  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.2);

  animation: modalShow 0.2s ease;
}


@keyframes modalShow {

  from {
    opacity: 0;
    transform: translateY(10px) scale(.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

}


.modal-header {
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 15px;

  margin-bottom: 22px;
}


.modal-header h2 {
  margin: 0 0 6px;

  font-size: 21px;

  color: #111827;
}


.modal-header p {
  margin: 0;

  color: #6b7280;

  font-size: 14px;
}


.close-modal {
  width: 36px;

  height: 36px;

  border: none;

  border-radius: 50%;

  background: #f3f4f6;

  color: #4b5563;

  font-size: 24px;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;
}


.close-modal:hover {
  background: #e5e7eb;
}


/* =========================
   PAYMENT OPTIONS
========================= */

.payment-options {
  display: flex;

  flex-direction: column;

  gap: 12px;
}


.payment-option {
  width: 100%;

  display: flex;

  align-items: center;

  gap: 14px;

  padding: 16px;

  border: 2px solid #e5e7eb;

  border-radius: 14px;

  background: white;

  text-align: left;

  cursor: pointer;

  transition: all 0.2s ease;
}


.payment-option:hover {
  border-color: #93c5fd;

  background: #f8fbff;
}


.payment-option.selected {
  border-color: #2563eb;

  background: #eff6ff;
}


.payment-icon {
  width: 46px;

  height: 46px;

  flex-shrink: 0;

  border-radius: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 23px;
}


.cod-icon {
  background: #fef3c7;
}


.bank-icon {
  background: #dcfce7;
}


.payment-option-info {
  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 5px;
}


.payment-option-info strong {
  color: #111827;

  font-size: 15px;
}


.payment-option-info span {
  color: #6b7280;

  font-size: 13px;

  line-height: 1.4;
}


/* =========================
   RADIO
========================= */

.radio {
  width: 24px;

  height: 24px;

  flex-shrink: 0;

  border: 2px solid #d1d5db;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  color: white;

  font-size: 13px;
}


.payment-option.selected .radio {
  border-color: #2563eb;

  background: #2563eb;
}


/* =========================
   MODAL BUTTONS
========================= */

.modal-actions {
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 24px;

  padding-top: 20px;

  border-top: 1px solid #eee;
}


.modal-cancel {
  padding: 11px 20px;

  border: 1px solid #d1d5db;

  border-radius: 9px;

  background: white;

  color: #374151;

  font-weight: 600;

  cursor: pointer;
}


.modal-cancel:hover {
  background: #f3f4f6;
}


.modal-confirm {
  padding: 11px 20px;

  border: none;

  border-radius: 9px;

  background: #2563eb;

  color: white;

  font-weight: 600;

  cursor: pointer;
}


.modal-confirm:hover:not(:disabled) {
  background: #1d4ed8;
}


.modal-confirm:disabled {
  background: #cbd5e1;

  cursor: not-allowed;
}
/* ==============================
   NÚT ĐỔI PHƯƠNG THỨC THANH TOÁN
================================ */

button.change-payment-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  min-width: 155px !important;
  height: 44px !important;

  padding: 0 18px !important;

  border: 1px solid #2563eb !important;
  border-radius: 10px !important;

  background: #eff6ff !important;
  color: #2563eb !important;

  font-family: Arial, sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;

  line-height: 1 !important;

  cursor: pointer !important;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease !important;
}

button.change-payment-btn:hover {
  background: #2563eb !important;
  color: #ffffff !important;
  border-color: #2563eb !important;

  transform: translateY(-1px) !important;
}

button.change-payment-btn:active {
  transform: translateY(0) !important;
}
</style>