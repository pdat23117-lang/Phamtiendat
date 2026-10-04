<template>
  <div class="container">

    <!-- =========================
         HEADER
    ========================== -->
    <div class="page-header">

      <div>
        <h1>Báo cáo hệ thống</h1>

        <p>
          Báo cáo tổng hợp hoạt động kinh doanh của DAT MOBILE
        </p>
      </div>

      <div class="header-actions">

        <button
          class="refresh"
          @click="loadReport"
          :disabled="loading"
        >
          {{ loading ? "⏳ Đang tải..." : "🔄 Làm mới" }}
        </button>

        <button
          class="print"
          @click="printReport"
        >
          🖨 In báo cáo
        </button>

      </div>

    </div>


    <!-- =========================
         TỔNG QUAN
    ========================== -->
    <div class="summary-grid">

      <!-- SẢN PHẨM -->
      <div class="summary-card">

        <div class="summary-icon blue">
          📱
        </div>

        <div>

          <span>
            Tổng sản phẩm
          </span>

          <strong>
            {{ report.products }}
          </strong>

          <small>
            Sản phẩm
          </small>

        </div>

      </div>


      <!-- NGƯỜI DÙNG -->
      <div class="summary-card">

        <div class="summary-icon purple">
          👥
        </div>

        <div>

          <span>
            Tổng người dùng
          </span>

          <strong>
            {{ report.users }}
          </strong>

          <small>
            Tài khoản
          </small>

        </div>

      </div>


      <!-- ĐƠN HÀNG -->
      <div class="summary-card">

        <div class="summary-icon orange">
          🛒
        </div>

        <div>

          <span>
            Tổng đơn hàng
          </span>

          <strong>
            {{ report.orders }}
          </strong>

          <small>
            Đơn hàng
          </small>

        </div>

      </div>


      <!-- DOANH THU -->
      <div class="summary-card">

        <div class="summary-icon green">
          💰
        </div>

        <div>

          <span>
            Tổng doanh thu
          </span>

          <strong>
            {{ formatMoney(report.revenue) }}
          </strong>

          <small>
            Đơn đã giao
          </small>

        </div>

      </div>

    </div>


    <!-- =========================
         TRẠNG THÁI ĐƠN HÀNG
    ========================== -->
    <div class="section">

      <div class="section-title">

        <div>
          <h2>
            Báo cáo đơn hàng
          </h2>

          <p>
            Phân loại đơn hàng theo trạng thái
          </p>
        </div>

      </div>


      <div class="order-report">

        <!-- CHỜ -->
        <div class="report-box pending">

          <div class="report-box-top">

            <span class="report-icon">
              ⏳
            </span>

            <span>
              Chờ xác nhận
            </span>

          </div>

          <strong>
            {{ report.pending }}
          </strong>

          <div class="bar">

            <div
              class="bar-fill yellow"
              :style="{
                width:
                  orderPercent(report.pending) + '%'
              }"
            ></div>

          </div>

          <small>
            {{ orderPercent(report.pending) }}%
            tổng đơn
          </small>

        </div>


        <!-- XỬ LÝ -->
        <div class="report-box processing">

          <div class="report-box-top">

            <span class="report-icon">
              ⚙️
            </span>

            <span>
              Đang xử lý
            </span>

          </div>

          <strong>
            {{ report.processing }}
          </strong>

          <div class="bar">

            <div
              class="bar-fill blue"
              :style="{
                width:
                  orderPercent(report.processing) + '%'
              }"
            ></div>

          </div>

          <small>
            {{ orderPercent(report.processing) }}%
            tổng đơn
          </small>

        </div>


        <!-- ĐANG GIAO -->
        <div class="report-box shipping">

          <div class="report-box-top">

            <span class="report-icon">
              🚚
            </span>

            <span>
              Đang giao
            </span>

          </div>

          <strong>
            {{ report.shipping }}
          </strong>

          <div class="bar">

            <div
              class="bar-fill purple"
              :style="{
                width:
                  orderPercent(report.shipping) + '%'
              }"
            ></div>

          </div>

          <small>
            {{ orderPercent(report.shipping) }}%
            tổng đơn
          </small>

        </div>


        <!-- ĐÃ GIAO -->
        <div class="report-box delivered">

          <div class="report-box-top">

            <span class="report-icon">
              ✓
            </span>

            <span>
              Đã giao
            </span>

          </div>

          <strong>
            {{ report.delivered }}
          </strong>

          <div class="bar">

            <div
              class="bar-fill green"
              :style="{
                width:
                  orderPercent(report.delivered) + '%'
              }"
            ></div>

          </div>

          <small>
            {{ orderPercent(report.delivered) }}%
            tổng đơn
          </small>

        </div>


        <!-- ĐÃ HỦY -->
        <div class="report-box cancelled">

          <div class="report-box-top">

            <span class="report-icon">
              ✕
            </span>

            <span>
              Đã hủy
            </span>

          </div>

          <strong>
            {{ report.cancelled }}
          </strong>

          <div class="bar">

            <div
              class="bar-fill red"
              :style="{
                width:
                  orderPercent(report.cancelled) + '%'
              }"
            ></div>

          </div>

          <small>
            {{ orderPercent(report.cancelled) }}%
            tổng đơn
          </small>

        </div>

      </div>

    </div>


    <!-- =========================
         CHỈ SỐ KINH DOANH
    ========================== -->
    <div class="section">

      <div class="section-title">

        <div>

          <h2>
            Chỉ số kinh doanh
          </h2>

          <p>
            Các chỉ số quan trọng của hệ thống
          </p>

        </div>

      </div>


      <div class="business-grid">

        <!-- GIÁ TRỊ ĐƠN -->
        <div class="business-card">

          <div class="business-icon">
            💵
          </div>

          <div>

            <span>
              Giá trị đơn trung bình
            </span>

            <strong>
              {{ formatMoney(report.averageOrder) }}
            </strong>

          </div>

        </div>


        <!-- TỶ LỆ GIAO -->
        <div class="business-card">

          <div class="business-icon">
            📦
          </div>

          <div>

            <span>
              Tỷ lệ giao thành công
            </span>

            <strong>
              {{ deliveryRate }}%
            </strong>

          </div>

        </div>


        <!-- TỶ LỆ HỦY -->
        <div class="business-card">

          <div class="business-icon">
            ❌
          </div>

          <div>

            <span>
              Tỷ lệ hủy đơn
            </span>

            <strong>
              {{ cancelRate }}%
            </strong>

          </div>

        </div>


        <!-- SẢN PHẨM -->
        <div class="business-card">

          <div class="business-icon">
            📱
          </div>

          <div>

            <span>
              Sản phẩm đang kinh doanh
            </span>

            <strong>
              {{ report.products }}
            </strong>

          </div>

        </div>

      </div>

    </div>


    <!-- =========================
         THANH TOÁN
    ========================== -->
    <div class="two-column">

      <div class="panel">

        <div class="panel-header">

          <div>

            <h2>
              Tình trạng thanh toán
            </h2>

            <p>
              Tổng hợp tình trạng thanh toán
            </p>

          </div>

          <span class="panel-icon">
            💳
          </span>

        </div>


        <div class="payment-list">

          <div class="payment-row">

            <div class="payment-name">

              <span class="dot green-dot"></span>

              Đã thanh toán

            </div>

            <strong>
              {{ report.paid }}
            </strong>

          </div>


          <div class="payment-row">

            <div class="payment-name">

              <span class="dot yellow-dot"></span>

              Chờ thanh toán

            </div>

            <strong>
              {{ report.waiting }}
            </strong>

          </div>


          <div class="payment-row">

            <div class="payment-name">

              <span class="dot red-dot"></span>

              Chưa thanh toán

            </div>

            <strong>
              {{ report.unpaid }}
            </strong>

          </div>

        </div>

      </div>


      <!-- DOANH THU -->
      <div class="panel revenue-panel">

        <div class="panel-header">

          <div>

            <h2>
              Tổng doanh thu
            </h2>

            <p>
              Chỉ tính đơn hàng đã giao
            </p>

          </div>

          <span class="panel-icon">
            💰
          </span>

        </div>


        <div class="revenue-number">

          {{ formatMoney(report.revenue) }}

        </div>


        <div class="revenue-note">

          ✓ {{ report.delivered }}
          đơn hàng đã hoàn thành

        </div>

      </div>

    </div>


    <!-- =========================
         SẢN PHẨM BÁN CHẠY
    ========================== -->
    <div class="section">

      <div class="section-title">

        <div>

          <h2>
            Sản phẩm bán chạy
          </h2>

          <p>
            Số lượng sản phẩm đã bán trong các đơn hàng
          </p>

        </div>

      </div>


      <div class="products-table">

        <div class="table-header">

          <span>
            STT
          </span>

          <span>
            Sản phẩm
          </span>

          <span>
            Số lượng bán
          </span>

          <span>
            Doanh thu
          </span>

        </div>


        <div
          v-for="(item, index) in topProducts"
          :key="item.name"
          class="table-row"
        >

          <span class="rank">
            {{ index + 1 }}
          </span>


          <div class="product-name">

            <div class="product-icon">
              📱
            </div>

            <strong>
              {{ item.name }}
            </strong>

          </div>


          <strong>
            {{ item.quantity }}
          </strong>


          <strong class="product-money">
            {{ formatMoney(item.revenue) }}
          </strong>

        </div>


        <div
          v-if="topProducts.length === 0"
          class="empty"
        >

          📭 Chưa có dữ liệu sản phẩm bán

        </div>

      </div>

    </div>


    <!-- =========================
         ĐƠN HÀNG GẦN ĐÂY
    ========================== -->
    <div class="section">

      <div class="section-title">

        <div>

          <h2>
            Đơn hàng gần đây
          </h2>

          <p>
            5 đơn hàng mới nhất
          </p>

        </div>

      </div>


      <div class="recent-table">

        <div class="recent-header">

          <span>
            Mã đơn
          </span>

          <span>
            Khách hàng
          </span>

          <span>
            Tổng tiền
          </span>

          <span>
            Trạng thái
          </span>

          <span>
            Ngày đặt
          </span>

        </div>


        <div
          v-for="order in recentOrders"
          :key="order._id"
          class="recent-row"
        >

          <strong>
            #{{ order._id.slice(-8) }}
          </strong>


          <span>
            {{
              order.shippingAddress?.ten ||
              "Khách hàng"
            }}
          </span>


          <strong class="price">
            {{ formatMoney(order.thanhTien) }}
          </strong>


          <span
            class="status"
            :class="getStatusClass(order.status)"
          >
            {{ getStatusText(order.status) }}
          </span>


          <span>
            {{ formatDate(order.createdAt) }}
          </span>

        </div>


        <div
          v-if="recentOrders.length === 0"
          class="empty"
        >

          📭 Chưa có đơn hàng

        </div>

      </div>

    </div>


    <!-- =========================
         CHÂN BÁO CÁO
    ========================== -->
    <div class="report-footer">

      <strong>
        DAT MOBILE
      </strong>

      <span>
        Báo cáo được tạo lúc:
        {{ currentDate }}
      </span>

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


/* =========================
   TOKEN
========================= */

const token =
  localStorage.getItem("token");


/* =========================
   REPORT
========================= */

const report =
  ref({

    products: 0,

    users: 0,

    orders: 0,

    pending: 0,

    processing: 0,

    shipping: 0,

    delivered: 0,

    cancelled: 0,

    revenue: 0,

    paid: 0,

    waiting: 0,

    unpaid: 0,

    averageOrder: 0,

  });


/* =========================
   ORDERS
========================= */

const allOrders =
  ref([]);


/* =========================
   LOADING
========================= */

const loading =
  ref(false);


/* =========================
   CURRENT DATE
========================= */

const currentDate =
  new Date().toLocaleString(
    "vi-VN"
  );


/* =========================
   RECENT ORDERS
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
   TOP PRODUCTS
========================= */

const topProducts =
  computed(() => {

    const products = {};


    allOrders.value

      .filter(
        order =>
          order.status === "delivered"
      )

      .forEach(order => {

        if (!order.items)
          return;


        order.items.forEach(item => {

          const name =
            item.ten ||
            "Sản phẩm";


          if (!products[name]) {

            products[name] = {

              name,

              quantity: 0,

              revenue: 0,

            };

          }


          const quantity =
            Number(
              item.soluong || 0
            );


          const price =
            Number(
              item.gia || 0
            );


          products[name].quantity +=
            quantity;


          products[name].revenue +=
            quantity * price;

        });

      });


    return Object.values(
      products
    )

      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      )

      .slice(0, 5);

  });


/* =========================
   DELIVERY RATE
========================= */

const deliveryRate =
  computed(() => {

    if (
      report.value.orders === 0
    )
      return 0;


    return Math.round(

      (
        report.value.delivered /
        report.value.orders
      ) * 100

    );

  });


/* =========================
   CANCEL RATE
========================= */

const cancelRate =
  computed(() => {

    if (
      report.value.orders === 0
    )
      return 0;


    return Math.round(

      (
        report.value.cancelled /
        report.value.orders
      ) * 100

    );

  });


/* =========================
   LOAD REPORT
========================= */

const loadReport =
  async () => {

    loading.value =
      true;


    try {

      /* =====================
         PRODUCTS
      ===================== */

      const sp =
        await axios.get(
          "/sanpham"
        );


      report.value.products =
        sp.data.products?.length ||
        0;


      /* =====================
         USERS
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


      report.value.users =
        us.data.length;


      /* =====================
         ORDERS
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


      report.value.orders =
        allOrders.value.length;


      /* =====================
         ORDER STATUS
      ===================== */

      report.value.pending =
        allOrders.value.filter(
          order =>
            order.status === "pending"
        ).length;


      report.value.processing =
        allOrders.value.filter(
          order =>
            order.status === "processing"
        ).length;


      report.value.shipping =
        allOrders.value.filter(
          order =>
            order.status === "shipping"
        ).length;


      report.value.delivered =
        allOrders.value.filter(
          order =>
            order.status === "delivered"
        ).length;


      report.value.cancelled =
        allOrders.value.filter(
          order =>
            order.status === "cancelled"
        ).length;


      /* =====================
         REVENUE
      ===================== */

      report.value.revenue =
        allOrders.value

          .filter(
            order =>
              order.status ===
              "delivered"
          )

          .reduce(

            (sum, order) =>

              sum +
              Number(
                order.thanhTien || 0
              ),

            0

          );


      /* =====================
         AVERAGE ORDER
      ===================== */

      if (
        report.value.delivered > 0
      ) {

        report.value.averageOrder =
          Math.round(

            report.value.revenue /
            report.value.delivered

          );

      }
      else {

        report.value.averageOrder =
          0;

      }


      /* =====================
         PAYMENT
      ===================== */

      report.value.paid =
        allOrders.value.filter(
          order =>
            order.isPaid === true ||
            order.paymentStatus ===
              "paid"
        ).length;


      report.value.waiting =
        allOrders.value.filter(
          order =>
            order.paymentStatus ===
            "waiting"
        ).length;


      report.value.unpaid =
        allOrders.value.filter(
          order =>
            !order.isPaid &&
            (
              !order.paymentStatus ||
              order.paymentStatus ===
                "unpaid"
            )
        ).length;

    }

    catch (err) {

      console.error(
        "Lỗi tải báo cáo:",
        err
      );

    }

    finally {

      loading.value =
        false;

    }

  };


/* =========================
   ORDER PERCENT
========================= */

const orderPercent =
  (value) => {

    if (
      report.value.orders === 0
    )
      return 0;


    return Math.round(

      (
        value /
        report.value.orders
      ) * 100

    );

  };


/* =========================
   MONEY
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
   DATE
========================= */

const formatDate =
  (date) => {

    if (!date)
      return "";

    return new Date(
      date
    ).toLocaleString(
      "vi-VN"
    );

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
   PRINT
========================= */

const printReport =
  () => {

    window.print();

  };


/* =========================
   START
========================= */

onMounted(
  loadReport
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
    30px;

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


.header-actions {

  display:
    flex;

  gap:
    10px;

}


.header-actions button {

  border:
    none;

  padding:
    11px 18px;

  border-radius:
    9px;

  cursor:
    pointer;

  font-weight:
    600;

}


.refresh {

  background:
    #111827;

  color:
    white;

}


.refresh:hover {

  background:
    #2563eb;

}


.print {

  background:
    #2563eb;

  color:
    white;

}


.print:hover {

  background:
    #1d4ed8;

}


/* =====================================
   SUMMARY
===================================== */

.summary-grid {

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    20px;

  margin-bottom:
    35px;

}


.summary-card {

  background:
    white;

  padding:
    22px;

  border-radius:
    16px;

  display:
    flex;

  align-items:
    center;

  gap:
    17px;

  box-shadow:
    0 4px 16px
    rgba(15,23,42,.06);

}


.summary-icon {

  width:
    58px;

  height:
    58px;

  border-radius:
    14px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    26px;

}


.summary-icon.blue {

  background:
    #dbeafe;

}


.summary-icon.purple {

  background:
    #ede9fe;

}


.summary-icon.orange {

  background:
    #fef3c7;

}


.summary-icon.green {

  background:
    #dcfce7;

}


.summary-card span {

  display:
    block;

  color:
    #6b7280;

  font-size:
    14px;

}


.summary-card strong {

  display:
    block;

  font-size:
    27px;

  margin:
    5px 0;

}


.summary-card small {

  color:
    #9ca3af;

}


/* =====================================
   SECTION
===================================== */

.section {

  margin-bottom:
    30px;

}


.section-title {

  margin-bottom:
    16px;

}


.section-title h2 {

  margin:
    0;

  font-size:
    21px;

}


.section-title p {

  margin:
    5px 0 0;

  color:
    #6b7280;

}


/* =====================================
   ORDER REPORT
===================================== */

.order-report {

  display:
    grid;

  grid-template-columns:
    repeat(5, 1fr);

  gap:
    16px;

}


.report-box {

  background:
    white;

  padding:
    20px;

  border-radius:
    14px;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

}


.report-box-top {

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


.report-icon {

  width:
    36px;

  height:
    36px;

  border-radius:
    9px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

}


.pending .report-icon {

  background:
    #fef3c7;

}


.processing .report-icon {

  background:
    #dbeafe;

}


.shipping .report-icon {

  background:
    #ede9fe;

}


.delivered .report-icon {

  background:
    #dcfce7;

}


.cancelled .report-icon {

  background:
    #fee2e2;

}


.report-box > strong {

  display:
    block;

  font-size:
    30px;

  margin:
    17px 0 12px;

}


.bar {

  width:
    100%;

  height:
    7px;

  background:
    #f1f5f9;

  border-radius:
    10px;

  overflow:
    hidden;

}


.bar-fill {

  height:
    100%;

  border-radius:
    10px;

}


.bar-fill.yellow {

  background:
    #f59e0b;

}


.bar-fill.blue {

  background:
    #3b82f6;

}


.bar-fill.purple {

  background:
    #8b5cf6;

}


.bar-fill.green {

  background:
    #22c55e;

}


.bar-fill.red {

  background:
    #ef4444;

}


.report-box small {

  display:
    block;

  color:
    #9ca3af;

  margin-top:
    7px;

}


/* =====================================
   BUSINESS
===================================== */

.business-grid {

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    18px;

}


.business-card {

  background:
    white;

  border-radius:
    14px;

  padding:
    20px;

  display:
    flex;

  align-items:
    center;

  gap:
    15px;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

}


.business-icon {

  width:
    48px;

  height:
    48px;

  background:
    #f1f5f9;

  border-radius:
    12px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    22px;

}


.business-card span {

  display:
    block;

  color:
    #6b7280;

  font-size:
    13px;

}


.business-card strong {

  display:
    block;

  font-size:
    20px;

  margin-top:
    5px;

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
    22px;

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

  align-items:
    center;

  justify-content:
    space-between;

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


.panel-icon {

  width:
    48px;

  height:
    48px;

  background:
    #dcfce7;

  border-radius:
    12px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    23px;

}


/* =====================================
   PAYMENT
===================================== */

.payment-list {

  margin-top:
    20px;

}


.payment-row {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  padding:
    15px 0;

  border-bottom:
    1px solid #eef0f4;

}


.payment-row:last-child {

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


.payment-row strong {

  font-size:
    19px;

}


/* =====================================
   REVENUE
===================================== */

.revenue-panel {

  background:
    #111827;

  color:
    white;

}


.revenue-panel
.panel-header p {

  color:
    #9ca3af;

}


.revenue-panel
.panel-icon {

  background:
    rgba(255,255,255,.1);

}


.revenue-number {

  font-size:
    35px;

  font-weight:
    800;

  margin:
    35px 0 15px;

}


.revenue-note {

  color:
    #86efac;

}


/* =====================================
   PRODUCTS TABLE
===================================== */

.products-table {

  background:
    white;

  border-radius:
    15px;

  overflow:
    hidden;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

}


.table-header,
.table-row {

  display:
    grid;

  grid-template-columns:
    80px 2fr 1fr 1fr;

  align-items:
    center;

  gap:
    15px;

}


.table-header {

  padding:
    16px 22px;

  background:
    #111827;

  color:
    white;

  font-weight:
    600;

}


.table-row {

  padding:
    17px 22px;

  border-bottom:
    1px solid #eef0f4;

}


.table-row:last-child {

  border-bottom:
    none;

}


.rank {

  font-weight:
    700;

  color:
    #6b7280;

}


.product-name {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

}


.product-icon {

  width:
    38px;

  height:
    38px;

  border-radius:
    9px;

  background:
    #eff6ff;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

}


.product-money {

  color:
    #e11d48;

}


/* =====================================
   RECENT TABLE
===================================== */

.recent-table {

  background:
    white;

  border-radius:
    15px;

  overflow:
    hidden;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

}


.recent-header,
.recent-row {

  display:
    grid;

  grid-template-columns:
    1.2fr 1.5fr 1.2fr 1fr 1.5fr;

  align-items:
    center;

  gap:
    15px;

}


.recent-header {

  padding:
    16px 22px;

  background:
    #111827;

  color:
    white;

  font-weight:
    600;

}


.recent-row {

  padding:
    17px 22px;

  border-bottom:
    1px solid #eef0f4;

}


.recent-row:last-child {

  border-bottom:
    none;

}


.price {

  color:
    #e11d48;

}


.status {

  display:
    inline-block;

  width:
    fit-content;

  padding:
    6px 11px;

  border-radius:
    20px;

  font-size:
    12px;

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


.empty {

  padding:
    40px;

  text-align:
    center;

  color:
    #9ca3af;

}


/* =====================================
   FOOTER
===================================== */

.report-footer {

  display:
    flex;

  justify-content:
    space-between;

  margin-top:
    30px;

  padding:
    20px 5px;

  color:
    #9ca3af;

  font-size:
    13px;

}


/* =====================================
   RESPONSIVE
===================================== */

@media(max-width:1200px) {

  .summary-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .order-report {

    grid-template-columns:
      repeat(3, 1fr);

  }


  .business-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


@media(max-width:850px) {

  .two-column {

    grid-template-columns:
      1fr;

  }


  .recent-header,
  .recent-row {

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

    flex-direction:
      column;

    align-items:
      flex-start;

    gap:
      15px;

  }


  .summary-grid {

    grid-template-columns:
      1fr;

  }


  .order-report {

    grid-template-columns:
      1fr;

  }


  .business-grid {

    grid-template-columns:
      1fr;

  }


  .header-actions {

    width:
      100%;

  }


  .header-actions button {

    flex:
      1;

  }


  .table-header,
  .table-row {

    grid-template-columns:
      50px 1fr 100px;

  }


  .table-header span:nth-child(4),
  .table-row > strong:last-child {

    display:
      none;

  }


  .recent-header,
  .recent-row {

    grid-template-columns:
      1fr;

  }


  .report-footer {

    flex-direction:
      column;

    gap:
      8px;

  }

}


/* =====================================
   PRINT
===================================== */

@media print {

  .container {

    background:
      white;

    padding:
      10px;

  }


  .header-actions {

    display:
      none;

  }


  .page-header {

    margin-bottom:
      20px;

  }


  .summary-card,
  .report-box,
  .business-card,
  .panel,
  .products-table,
  .recent-table {

    box-shadow:
      none;

    border:
      1px solid #ddd;

  }


  .revenue-panel {

    background:
      #111827 !important;

    color:
      white !important;

    -webkit-print-color-adjust:
      exact;

    print-color-adjust:
      exact;

  }


  .table-header,
  .recent-header {

    background:
      #111827 !important;

    color:
      white !important;

    -webkit-print-color-adjust:
      exact;

    print-color-adjust:
      exact;

  }


  .section {

    break-inside:
      avoid;

  }


  .report-footer {

    margin-top:
      20px;

  }

}

</style>