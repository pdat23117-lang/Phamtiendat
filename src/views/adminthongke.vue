<template>
  <div class="container">

    <!-- =========================
         HEADER
    ========================== -->
    <div class="page-header">

      <div>
        <h1>Thống kê hệ thống</h1>

        <p>
          Tổng quan hoạt động kinh doanh của DAT MOBILE
        </p>
      </div>

      <button
        class="refresh-btn"
        @click="loadData"
        :disabled="loading"
      >
        {{ loading ? "⏳ Đang tải..." : "🔄 Làm mới" }}
      </button>

    </div>


    <!-- =========================
         TỔNG QUAN
    ========================== -->
    <div class="stats-grid">

      <!-- SẢN PHẨM -->
      <div class="stat-card">

        <div class="icon blue">
          📱
        </div>

        <div class="stat-info">

          <span>
            Tổng sản phẩm
          </span>

          <strong>
            {{ products }}
          </strong>

          <small>
            Sản phẩm đang kinh doanh
          </small>

        </div>

      </div>


      <!-- NGƯỜI DÙNG -->
      <div class="stat-card">

        <div class="icon purple">
          👥
        </div>

        <div class="stat-info">

          <span>
            Tổng người dùng
          </span>

          <strong>
            {{ users }}
          </strong>

          <small>
            Tài khoản trong hệ thống
          </small>

        </div>

      </div>


      <!-- ĐƠN HÀNG -->
      <div class="stat-card">

        <div class="icon orange">
          🛒
        </div>

        <div class="stat-info">

          <span>
            Tổng đơn hàng
          </span>

          <strong>
            {{ orders }}
          </strong>

          <small>
            Tất cả đơn hàng
          </small>

        </div>

      </div>


      <!-- DOANH THU -->
      <div class="stat-card revenue-card">

        <div class="icon green">
          💰
        </div>

        <div class="stat-info">

          <span>
            Doanh thu
          </span>

          <strong>
            {{ formatMoney(revenue) }}
          </strong>

          <small>
            Từ các đơn đã giao
          </small>

        </div>

      </div>

    </div>


    <!-- =========================
         TRẠNG THÁI ĐƠN HÀNG
    ========================== -->
    <div class="section-title">

      <div>
        <h2>
          Tình trạng đơn hàng
        </h2>

        <p>
          Theo dõi tiến trình xử lý đơn hàng
        </p>
      </div>

    </div>


    <div class="order-grid">

      <!-- CHỜ XỬ LÝ -->
      <div class="order-card pending">

        <div class="order-top">

          <div class="order-icon">
            ⏳
          </div>

          <span>
            Chờ xử lý
          </span>

        </div>

        <strong>
          {{ pending }}
        </strong>

        <div class="progress">

          <div
            class="progress-bar yellow"
            :style="{
              width: orderPercent(pending) + '%'
            }"
          ></div>

        </div>

        <small>
          {{ orderPercent(pending) }}% tổng đơn
        </small>

      </div>


      <!-- ĐANG XỬ LÝ -->
      <div class="order-card processing">

        <div class="order-top">

          <div class="order-icon">
            ⚙️
          </div>

          <span>
            Đang xử lý
          </span>

        </div>

        <strong>
          {{ processing }}
        </strong>

        <div class="progress">

          <div
            class="progress-bar blue-bar"
            :style="{
              width: orderPercent(processing) + '%'
            }"
          ></div>

        </div>

        <small>
          {{ orderPercent(processing) }}% tổng đơn
        </small>

      </div>


      <!-- ĐANG GIAO -->
      <div class="order-card shipping">

        <div class="order-top">

          <div class="order-icon">
            🚚
          </div>

          <span>
            Đang giao
          </span>

        </div>

        <strong>
          {{ shipping }}
        </strong>

        <div class="progress">

          <div
            class="progress-bar purple-bar"
            :style="{
              width: orderPercent(shipping) + '%'
            }"
          ></div>

        </div>

        <small>
          {{ orderPercent(shipping) }}% tổng đơn
        </small>

      </div>


      <!-- ĐÃ GIAO -->
      <div class="order-card delivered">

        <div class="order-top">

          <div class="order-icon">
            ✓
          </div>

          <span>
            Đã giao
          </span>

        </div>

        <strong>
          {{ delivered }}
        </strong>

        <div class="progress">

          <div
            class="progress-bar green-bar"
            :style="{
              width: orderPercent(delivered) + '%'
            }"
          ></div>

        </div>

        <small>
          {{ orderPercent(delivered) }}% tổng đơn
        </small>

      </div>


      <!-- ĐÃ HỦY -->
      <div class="order-card cancelled">

        <div class="order-top">

          <div class="order-icon">
            ✕
          </div>

          <span>
            Đã hủy
          </span>

        </div>

        <strong>
          {{ cancelled }}
        </strong>

        <div class="progress">

          <div
            class="progress-bar red-bar"
            :style="{
              width: orderPercent(cancelled) + '%'
            }"
          ></div>

        </div>

        <small>
          {{ orderPercent(cancelled) }}% tổng đơn
        </small>

      </div>

    </div>


    <!-- =========================
         DOANH THU + THANH TOÁN
    ========================== -->
    <div class="two-column">


      <!-- DOANH THU -->
      <div class="panel">

        <div class="panel-header">

          <div>
            <h2>
              Tổng quan doanh thu
            </h2>

            <p>
              Doanh thu từ đơn hàng đã giao
            </p>
          </div>

          <div class="money-icon">
            💰
          </div>

        </div>


        <div class="big-money">

          {{ formatMoney(revenue) }}

        </div>


        <div class="money-row">

          <div>

            <span>
              Giá trị đơn trung bình
            </span>

            <strong>
              {{ formatMoney(averageOrder) }}
            </strong>

          </div>


          <div>

            <span>
              Đơn đã giao
            </span>

            <strong>
              {{ delivered }}
            </strong>

          </div>

        </div>

      </div>


      <!-- THANH TOÁN -->
      <div class="panel">

        <div class="panel-header">

          <div>
            <h2>
              Tình trạng thanh toán
            </h2>

            <p>
              Theo dõi tình trạng thanh toán
            </p>
          </div>

          <div class="money-icon">
            💳
          </div>

        </div>


        <div class="payment-list">

          <div class="payment-item">

            <div class="payment-name">

              <span class="dot green-dot"></span>

              <span>
                Đã thanh toán
              </span>

            </div>

            <strong>
              {{ paidOrders }}
            </strong>

          </div>


          <div class="payment-item">

            <div class="payment-name">

              <span class="dot yellow-dot"></span>

              <span>
                Chờ thanh toán
              </span>

            </div>

            <strong>
              {{ waitingPayment }}
            </strong>

          </div>


          <div class="payment-item">

            <div class="payment-name">

              <span class="dot red-dot"></span>

              <span>
                Chưa thanh toán
              </span>

            </div>

            <strong>
              {{ unpaidOrders }}
            </strong>

          </div>

        </div>

      </div>

    </div>


    <!-- =========================
         ĐƠN HÀNG GẦN ĐÂY
    ========================== -->
    <div class="recent-panel">

      <div class="panel-header">

        <div>
          <h2>
            Đơn hàng gần đây
          </h2>

          <p>
            5 đơn hàng mới nhất
          </p>
        </div>

        <button
          class="view-orders"
          @click="goOrders"
        >
          Xem tất cả →
        </button>

      </div>


      <div class="recent-list">

        <div
          v-for="order in recentOrders"
          :key="order._id"
          class="recent-item"
        >

          <!-- MÃ ĐƠN -->
          <div class="recent-code">

            <strong>
              #{{ order._id.slice(-8) }}
            </strong>

            <small>
              {{ formatDate(order.createdAt) }}
            </small>

          </div>


          <!-- KHÁCH HÀNG -->
          <div class="recent-customer">

            <div class="customer-avatar">

              {{
                getInitial(
                  order.shippingAddress?.ten
                )
              }}

            </div>

            <div>

              <strong>
                {{
                  order.shippingAddress?.ten ||
                  "Khách hàng"
                }}
              </strong>

              <small>
                {{
                  order.items?.length || 0
                }}
                sản phẩm
              </small>

            </div>

          </div>


          <!-- TIỀN -->
          <div class="recent-price">

            {{ formatMoney(order.thanhTien) }}

          </div>


          <!-- STATUS -->
          <div>

            <span
              class="status-badge"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>

          </div>

        </div>


        <!-- KHÔNG CÓ ĐƠN -->
        <div
          v-if="recentOrders.length === 0"
          class="no-data"
        >

          📭 Chưa có đơn hàng

        </div>

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


/* =========================
   ROUTER
========================= */

const router =
  useRouter();


/* =========================
   TOKEN
========================= */

const token =
  localStorage.getItem("token");


/* =========================
   DATA
========================= */

const products =
  ref(0);

const users =
  ref(0);

const orders =
  ref(0);

const pending =
  ref(0);

const processing =
  ref(0);

const shipping =
  ref(0);

const delivered =
  ref(0);

const cancelled =
  ref(0);

const revenue =
  ref(0);

const allOrders =
  ref([]);

const loading =
  ref(false);


/* =========================
   THANH TOÁN
========================= */

const paidOrders =
  computed(() => {

    return allOrders.value.filter(
      order =>
        order.isPaid === true ||
        order.paymentStatus === "paid"
    ).length;

  });


const waitingPayment =
  computed(() => {

    return allOrders.value.filter(
      order =>
        order.paymentStatus === "waiting"
    ).length;

  });


const unpaidOrders =
  computed(() => {

    return allOrders.value.filter(
      order =>
        !order.isPaid &&
        (!order.paymentStatus ||
          order.paymentStatus === "unpaid")
    ).length;

  });


/* =========================
   ĐƠN GẦN ĐÂY
========================= */

const recentOrders =
  computed(() => {

    return [...allOrders.value]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);

  });


/* =========================
   ĐƠN TRUNG BÌNH
========================= */

const averageOrder =
  computed(() => {

    if (delivered.value === 0)
      return 0;

    return Math.round(
      revenue.value /
      delivered.value
    );

  });


/* =========================
   LOAD DATA
========================= */

const loadData =
  async () => {

    loading.value = true;

    try {

      /* =====================
         SẢN PHẨM
      ===================== */

      const sp =
        await axios.get(
          "/sanpham"
        );

      products.value =
        sp.data.products?.length || 0;


      /* =====================
         NGƯỜI DÙNG
      ===================== */

      const us =
        await axios.get(
          "/auth/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      users.value =
        us.data.length;


      /* =====================
         ĐƠN HÀNG
      ===================== */

      const od =
        await axios.get(
          "/dathang/admin/all",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      allOrders.value =
        od.data || [];


      orders.value =
        allOrders.value.length;


      /* =====================
         TRẠNG THÁI
      ===================== */

      pending.value =
        allOrders.value.filter(
          order =>
            order.status === "pending"
        ).length;


      processing.value =
        allOrders.value.filter(
          order =>
            order.status === "processing"
        ).length;


      shipping.value =
        allOrders.value.filter(
          order =>
            order.status === "shipping"
        ).length;


      delivered.value =
        allOrders.value.filter(
          order =>
            order.status === "delivered"
        ).length;


      cancelled.value =
        allOrders.value.filter(
          order =>
            order.status === "cancelled"
        ).length;


      /* =====================
         DOANH THU
      ===================== */

      revenue.value =
        allOrders.value

          .filter(
            order =>
              order.status === "delivered"
          )

          .reduce(
            (sum, order) =>
              sum +
              Number(
                order.thanhTien || 0
              ),
            0
          );

    }

    catch (err) {

      console.error(
        "Lỗi thống kê:",
        err
      );

    }

    finally {

      loading.value =
        false;

    }

  };


/* =========================
   PHẦN TRĂM ĐƠN
========================= */

const orderPercent =
  (value) => {

    if (orders.value === 0)
      return 0;

    return Math.round(
      (value / orders.value) * 100
    );

  };


/* =========================
   FORMAT TIỀN
========================= */

const formatMoney =
  (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "vi-VN"
    ) + " đ";

  };


/* =========================
   FORMAT DATE
========================= */

const formatDate =
  (date) => {

    if (!date)
      return "";

    return new Date(date)
      .toLocaleString(
        "vi-VN"
      );

  };


/* =========================
   AVATAR
========================= */

const getInitial =
  (name) => {

    if (!name)
      return "?";

    return name
      .trim()
      .charAt(0)
      .toUpperCase();

  };


/* =========================
   STATUS TEXT
========================= */

const getStatusText =
  (status) => {

    const map = {

      pending:
        "Chờ xác nhận",

      processing:
        "Đang xử lý",

      shipping:
        "Đang giao",

      delivered:
        "Đã giao",

      cancelled:
        "Đã hủy",

    };

    return (
      map[status] ||
      status ||
      "Không xác định"
    );

  };


/* =========================
   STATUS CLASS
========================= */

const getStatusClass =
  (status) => {

    const map = {

      pending:
        "status-pending",

      processing:
        "status-processing",

      shipping:
        "status-shipping",

      delivered:
        "status-delivered",

      cancelled:
        "status-cancelled",

    };

    return (
      map[status] ||
      "status-pending"
    );

  };


/* =========================
   ĐI ĐẾN QUẢN LÝ ĐƠN
========================= */

const goOrders =
  () => {

    router.push(
      "/admindonhang"
    );

  };


/* =========================
   START
========================= */

onMounted(
  loadData
);

</script>


<style scoped>

/* =====================================
   PAGE
===================================== */

.container {

  min-height:
    100vh;

  padding:
    35px 40px;

  background:
    #f5f7fb;

  color:
    #111827;

}


/* =====================================
   HEADER
===================================== */

.page-header {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-bottom:
    28px;

}


.page-header h1 {

  margin:
    0;

  font-size:
    30px;

  font-weight:
    800;

}


.page-header p {

  margin:
    7px 0 0;

  color:
    #6b7280;

}


.refresh-btn {

  border:
    none;

  background:
    #111827;

  color:
    white;

  padding:
    12px 20px;

  border-radius:
    9px;

  font-weight:
    600;

  cursor:
    pointer;

}


.refresh-btn:hover {

  background:
    #2563eb;

}


.refresh-btn:disabled {

  opacity:
    .6;

  cursor:
    not-allowed;

}


/* =====================================
   MAIN STATS
===================================== */

.stats-grid {

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    20px;

  margin-bottom:
    35px;

}


.stat-card {

  background:
    white;

  border-radius:
    16px;

  padding:
    22px;

  display:
    flex;

  align-items:
    center;

  gap:
    18px;

  box-shadow:
    0 4px 16px
    rgba(15,23,42,.06);

  transition:
    .2s;

}


.stat-card:hover {

  transform:
    translateY(-3px);

}


.icon {

  width:
    58px;

  height:
    58px;

  border-radius:
    15px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    27px;

}


.icon.blue {

  background:
    #dbeafe;

}


.icon.purple {

  background:
    #ede9fe;

}


.icon.orange {

  background:
    #fef3c7;

}


.icon.green {

  background:
    #dcfce7;

}


.stat-info {

  min-width:
    0;

}


.stat-info span {

  display:
    block;

  color:
    #6b7280;

  font-size:
    14px;

}


.stat-info strong {

  display:
    block;

  margin:
    5px 0;

  font-size:
    28px;

}


.stat-info small {

  color:
    #9ca3af;

}


/* =====================================
   SECTION
===================================== */

.section-title {

  margin-bottom:
    15px;

}


.section-title h2 {

  margin:
    0;

  font-size:
    22px;

}


.section-title p {

  margin:
    5px 0;

  color:
    #6b7280;

}


/* =====================================
   ORDER GRID
===================================== */

.order-grid {

  display:
    grid;

  grid-template-columns:
    repeat(5, 1fr);

  gap:
    16px;

  margin-bottom:
    30px;

}


.order-card {

  background:
    white;

  border-radius:
    14px;

  padding:
    20px;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

}


.order-top {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  color:
    #6b7280;

  font-size:
    14px;

}


.order-icon {

  width:
    38px;

  height:
    38px;

  border-radius:
    10px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

}


.pending .order-icon {

  background:
    #fef3c7;

}


.processing .order-icon {

  background:
    #dbeafe;

}


.shipping .order-icon {

  background:
    #ede9fe;

}


.delivered .order-icon {

  background:
    #dcfce7;

}


.cancelled .order-icon {

  background:
    #fee2e2;

}


.order-card > strong {

  display:
    block;

  font-size:
    30px;

  margin:
    18px 0 12px;

}


.progress {

  height:
    7px;

  background:
    #f1f5f9;

  border-radius:
    10px;

  overflow:
    hidden;

}


.progress-bar {

  height:
    100%;

  border-radius:
    10px;

}


.yellow {

  background:
    #f59e0b;

}


.blue-bar {

  background:
    #3b82f6;

}


.purple-bar {

  background:
    #8b5cf6;

}


.green-bar {

  background:
    #22c55e;

}


.red-bar {

  background:
    #ef4444;

}


.order-card small {

  display:
    block;

  margin-top:
    8px;

  color:
    #9ca3af;

}


/* =====================================
   TWO COLUMN
===================================== */

.two-column {

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

  gap:
    25px;

  margin-bottom:
    30px;

}


.panel {

  background:
    white;

  border-radius:
    16px;

  padding:
    25px;

  box-shadow:
    0 4px 15px
    rgba(15,23,42,.05);

}


.panel-header {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

}


.panel-header h2 {

  margin:
    0;

  font-size:
    20px;

}


.panel-header p {

  margin:
    5px 0 0;

  color:
    #6b7280;

  font-size:
    14px;

}


.money-icon {

  width:
    48px;

  height:
    48px;

  border-radius:
    12px;

  background:
    #dcfce7;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    23px;

}


.big-money {

  font-size:
    32px;

  font-weight:
    800;

  margin:
    30px 0;

  color:
    #16a34a;

}


.money-row {

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

  gap:
    20px;

}


.money-row div {

  background:
    #f8fafc;

  border-radius:
    10px;

  padding:
    15px;

}


.money-row span {

  display:
    block;

  color:
    #6b7280;

  font-size:
    13px;

}


.money-row strong {

  display:
    block;

  margin-top:
    6px;

  font-size:
    18px;

}


/* =====================================
   PAYMENT
===================================== */

.payment-list {

  margin-top:
    25px;

}


.payment-item {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  padding:
    15px 0;

  border-bottom:
    1px solid #eef0f4;

}


.payment-item:last-child {

  border-bottom:
    none;

}


.payment-name {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

}


.dot {

  width:
    10px;

  height:
    10px;

  border-radius:
    50%;

}


.green-dot {

  background:
    #22c55e;

}


.yellow-dot {

  background:
    #f59e0b;

}


.red-dot {

  background:
    #ef4444;

}


.payment-item strong {

  font-size:
    18px;

}


/* =====================================
   RECENT ORDERS
===================================== */

.recent-panel {

  background:
    white;

  border-radius:
    16px;

  overflow:
    hidden;

  box-shadow:
    0 4px 15px
    rgba(15,23,42,.05);

}


.recent-panel > .panel-header {

  padding:
    22px 25px;

  border-bottom:
    1px solid #eef0f4;

}


.view-orders {

  border:
    none;

  background:
    #eff6ff;

  color:
    #2563eb;

  padding:
    9px 14px;

  border-radius:
    8px;

  cursor:
    pointer;

  font-weight:
    600;

}


.recent-list {

  padding:
    0 25px;

}


.recent-item {

  display:
    grid;

  grid-template-columns:
    1fr 1.5fr 1fr 1fr;

  align-items:
    center;

  gap:
    20px;

  padding:
    18px 0;

  border-bottom:
    1px solid #eef0f4;

}


.recent-item:last-child {

  border-bottom:
    none;

}


.recent-code strong {

  display:
    block;

}


.recent-code small {

  color:
    #9ca3af;

  margin-top:
    4px;

  display:
    block;

}


.recent-customer {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

}


.customer-avatar {

  width:
    38px;

  height:
    38px;

  border-radius:
    50%;

  background:
    #e0e7ff;

  color:
    #3730a3;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-weight:
    700;

}


.recent-customer strong {

  display:
    block;

}


.recent-customer small {

  color:
    #9ca3af;

}


.recent-price {

  font-weight:
    700;

  color:
    #e11d48;

}


/* =====================================
   STATUS
===================================== */

.status-badge {

  display:
    inline-block;

  padding:
    7px 12px;

  border-radius:
    20px;

  font-size:
    13px;

  font-weight:
    600;

}


.status-pending {

  background:
    #fef3c7;

  color:
    #b45309;

}


.status-processing {

  background:
    #dbeafe;

  color:
    #1d4ed8;

}


.status-shipping {

  background:
    #ede9fe;

  color:
    #6d28d9;

}


.status-delivered {

  background:
    #dcfce7;

  color:
    #15803d;

}


.status-cancelled {

  background:
    #fee2e2;

  color:
    #dc2626;

}


.no-data {

  padding:
    40px;

  text-align:
    center;

  color:
    #9ca3af;

}


/* =====================================
   RESPONSIVE
===================================== */

@media(max-width:1200px) {

  .stats-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .order-grid {

    grid-template-columns:
      repeat(3, 1fr);

  }

}


@media(max-width:850px) {

  .two-column {

    grid-template-columns:
      1fr;

  }


  .recent-item {

    grid-template-columns:
      1fr 1fr;

  }

}


@media(max-width:650px) {

  .container {

    padding:
      20px;

  }


  .page-header {

    align-items:
      flex-start;

    flex-direction:
      column;

    gap:
      15px;

  }


  .stats-grid {

    grid-template-columns:
      1fr;

  }


  .order-grid {

    grid-template-columns:
      1fr;

  }


  .recent-item {

    grid-template-columns:
      1fr;

  }

}

</style>