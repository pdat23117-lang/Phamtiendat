<template>

  <div class="container">

    <!-- =========================
         HEADER
    ========================== -->
    <div class="page-header">

      <div>
        <h1>Quản lý doanh thu</h1>

        <p>
          Theo dõi doanh thu và tình trạng đơn hàng của DAT MOBILE
        </p>
      </div>

      <div class="actions">

        <button
          class="refresh-btn"
          @click="loadData"
          :disabled="loading"
        >
          {{ loading ? "⏳ Đang tải..." : "🔄 Làm mới" }}
        </button>

        <button
          class="print-btn"
          @click="printReport"
        >
          🖨 In báo cáo
        </button>

      </div>

    </div>


    <!-- =========================
         THỐNG KÊ
    ========================== -->
    <div class="stats-grid">


      <!-- DOANH THU -->
      <div class="stat-card revenue-card">

        <div class="stat-icon">
          💰
        </div>

        <div>

          <span>
            Tổng doanh thu
          </span>

          <strong>
            {{ formatMoney(doanhThu) }}
          </strong>

          <small>
            Chỉ tính đơn đã giao
          </small>

        </div>

      </div>


      <!-- TỔNG ĐƠN -->
      <div class="stat-card">

        <div class="stat-icon blue">
          🛒
        </div>

        <div>

          <span>
            Tổng đơn hàng
          </span>

          <strong>
            {{ orders.length }}
          </strong>

          <small>
            Tất cả đơn hàng
          </small>

        </div>

      </div>


      <!-- HOÀN THÀNH -->
      <div class="stat-card">

        <div class="stat-icon green">
          ✓
        </div>

        <div>

          <span>
            Đơn hoàn thành
          </span>

          <strong>
            {{ donHoanThanh }}
          </strong>

          <small>
            Đã giao thành công
          </small>

        </div>

      </div>


      <!-- HỦY -->
      <div class="stat-card">

        <div class="stat-icon red">
          ✕
        </div>

        <div>

          <span>
            Đơn đã hủy
          </span>

          <strong>
            {{ donHuy }}
          </strong>

          <small>
            Không tính doanh thu
          </small>

        </div>

      </div>

    </div>


    <!-- =========================
         PAYMENT STATS
    ========================== -->
    <div class="payment-grid">


      <div class="payment-card">

        <div class="payment-title">

          <span class="payment-dot green-dot"></span>

          Đã thanh toán

        </div>

        <strong>
          {{ daThanhToan }}
        </strong>

        <small>
          đơn hàng
        </small>

      </div>


      <div class="payment-card">

        <div class="payment-title">

          <span class="payment-dot yellow-dot"></span>

          Chờ thanh toán

        </div>

        <strong>
          {{ choThanhToan }}
        </strong>

        <small>
          đơn hàng
        </small>

      </div>


      <div class="payment-card">

        <div class="payment-title">

          <span class="payment-dot red-dot"></span>

          Chưa thanh toán

        </div>

        <strong>
          {{ chuaThanhToan }}
        </strong>

        <small>
          đơn hàng
        </small>

      </div>


      <div class="payment-card">

        <div class="payment-title">

          📊 Tỷ lệ hoàn thành

        </div>

        <strong>
          {{ tyLeHoanThanh }}%
        </strong>

        <small>
          trên tổng đơn
        </small>

      </div>

    </div>


    <!-- =========================
         DOANH THU TỔNG QUAN
    ========================== -->
    <div class="overview">

      <div class="overview-left">

        <div class="overview-header">

          <div>

            <h2>
              Tổng quan doanh thu
            </h2>

            <p>
              Doanh thu được tính từ các đơn hàng đã giao
            </p>

          </div>

          <span class="money-icon">
            💰
          </span>

        </div>


        <div class="big-money">

          {{ formatMoney(doanhThu) }}

        </div>


        <div class="overview-info">

          <div>

            <span>
              Đơn hoàn thành
            </span>

            <strong>
              {{ donHoanThanh }}
            </strong>

          </div>


          <div>

            <span>
              Giá trị đơn TB
            </span>

            <strong>
              {{ formatMoney(giaTriDonTrungBinh) }}
            </strong>

          </div>

        </div>

      </div>


      <!-- TỶ LỆ -->
      <div class="overview-right">

        <h3>
          Tỷ lệ đơn hàng
        </h3>

        <p>
          Tỷ lệ giao thành công và hủy đơn
        </p>


        <div class="progress-item">

          <div class="progress-label">

            <span>
              Đã giao
            </span>

            <strong>
              {{ tyLeHoanThanh }}%
            </strong>

          </div>

          <div class="progress">

            <div
              class="progress-fill green-fill"
              :style="{
                width: tyLeHoanThanh + '%'
              }"
            ></div>

          </div>

        </div>


        <div class="progress-item">

          <div class="progress-label">

            <span>
              Đã hủy
            </span>

            <strong>
              {{ tyLeHuy }}%
            </strong>

          </div>

          <div class="progress">

            <div
              class="progress-fill red-fill"
              :style="{
                width: tyLeHuy + '%'
              }"
            ></div>

          </div>

        </div>

      </div>

    </div>


    <!-- =========================
         BỘ LỌC
    ========================== -->
    <div class="filter-box">

      <div class="search-box">

        <span>
          🔎
        </span>

        <input
          v-model="search"
          type="text"
          placeholder="Tìm mã đơn, tên khách hàng..."
        />

      </div>


      <select v-model="statusFilter">

        <option value="">
          Tất cả trạng thái
        </option>

        <option value="pending">
          Chờ xác nhận
        </option>

        <option value="processing">
          Đang xử lý
        </option>

        <option value="shipping">
          Đang giao
        </option>

        <option value="delivered">
          Đã giao
        </option>

        <option value="cancelled">
          Đã hủy
        </option>

      </select>


      <select v-model="paymentFilter">

        <option value="">
          Tất cả thanh toán
        </option>

        <option value="paid">
          Đã thanh toán
        </option>

        <option value="unpaid">
          Chưa thanh toán
        </option>

        <option value="waiting">
          Chờ xác nhận
        </option>

      </select>


      <button
        class="clear-filter"
        @click="clearFilter"
      >
        ↻ Đặt lại
      </button>

    </div>


    <!-- =========================
         BẢNG ĐƠN HÀNG
    ========================== -->
    <div class="table-section">

      <div class="table-header-title">

        <div>

          <h2>
            Chi tiết doanh thu
          </h2>

          <p>
            Hiển thị
            <strong>{{ filteredOrders.length }}</strong>
            đơn hàng
          </p>

        </div>

      </div>


      <div class="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>
                Mã đơn
              </th>

              <th>
                Khách hàng
              </th>

              <th>
                Ngày đặt
              </th>

              <th>
                Thanh toán
              </th>

              <th>
                Trạng thái
              </th>

              <th>
                Thành tiền
              </th>

            </tr>

          </thead>


          <tbody>

            <tr
              v-for="order in filteredOrders"
              :key="order._id"
            >

              <!-- MÃ ĐƠN -->
              <td>

                <div class="order-id">

                  <strong>
                    #{{ shortId(order._id) }}
                  </strong>

                  <small>
                    {{ order._id }}
                  </small>

                </div>

              </td>


              <!-- KHÁCH HÀNG -->
              <td>

                <div class="customer">

                  <div class="avatar">

                    {{
                      getCustomerName(order)
                        .charAt(0)
                        .toUpperCase()
                    }}

                  </div>

                  <span>
                    {{ getCustomerName(order) }}
                  </span>

                </div>

              </td>


              <!-- NGÀY -->
              <td>

                <span class="date">

                  {{ formatDate(order.createdAt) }}

                </span>

              </td>


              <!-- THANH TOÁN -->
              <td>

                <span
                  class="payment-badge"
                  :class="
                    getPaymentClass(order)
                  "
                >

                  {{ getPaymentText(order) }}

                </span>

              </td>


              <!-- TRẠNG THÁI -->
              <td>

                <span
                  class="status-badge"
                  :class="
                    getStatusClass(order.status)
                  "
                >

                  {{ getStatusText(order.status) }}

                </span>

              </td>


              <!-- THÀNH TIỀN -->
              <td>

                <strong
                  class="order-money"
                  :class="{
                    cancelledMoney:
                      order.status ===
                      'cancelled'
                  }"
                >

                  {{ formatMoney(order.thanhTien) }}

                </strong>

                <small
                  v-if="
                    order.status ===
                    'cancelled'
                  "
                  class="not-revenue"
                >
                  Không tính doanh thu
                </small>

              </td>

            </tr>


            <!-- KHÔNG CÓ -->
            <tr
              v-if="
                filteredOrders.length === 0
              "
            >

              <td
                colspan="6"
                class="empty"
              >

                <div class="empty-icon">
                  📭
                </div>

                <strong>
                  Không tìm thấy đơn hàng
                </strong>

                <p>
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>


    <!-- =========================
         FOOTER
    ========================== -->
    <div class="footer">

      <strong>
        DAT MOBILE
      </strong>

      <span>
        Báo cáo doanh thu -
        {{ new Date().toLocaleString("vi-VN") }}
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
   DATA
========================= */

const orders =
  ref([]);


const loading =
  ref(false);


const search =
  ref("");


const statusFilter =
  ref("");


const paymentFilter =
  ref("");


/* =========================
   LOAD DATA
========================= */

const loadData =
  async () => {

    loading.value =
      true;

    try {

      const res =
        await axios.get(
          "/dathang/admin/all",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      orders.value =
        res.data || [];

    }

    catch (err) {

      console.error(
        "Lỗi tải doanh thu:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Không thể tải dữ liệu doanh thu"
      );

    }

    finally {

      loading.value =
        false;

    }

  };


/* =========================
   DOANH THU
========================= */

const doanhThu =
  computed(() => {

    return orders.value

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

  });


/* =========================
   ĐƠN HOÀN THÀNH
========================= */

const donHoanThanh =
  computed(() => {

    return orders.value.filter(
      order =>
        order.status ===
        "delivered"
    ).length;

  });


/* =========================
   ĐƠN HỦY
========================= */

const donHuy =
  computed(() => {

    return orders.value.filter(
      order =>
        order.status ===
        "cancelled"
    ).length;

  });


/* =========================
   THANH TOÁN
========================= */

const daThanhToan =
  computed(() => {

    return orders.value.filter(
      order =>
        order.isPaid === true ||
        order.paymentStatus ===
          "paid"
    ).length;

  });


const choThanhToan =
  computed(() => {

    return orders.value.filter(
      order =>
        order.paymentStatus ===
        "waiting"
    ).length;

  });


const chuaThanhToan =
  computed(() => {

    return orders.value.filter(
      order =>
        order.isPaid !== true &&
        order.paymentStatus !==
          "paid" &&
        order.paymentStatus !==
          "waiting"
    ).length;

  });


/* =========================
   TỶ LỆ HOÀN THÀNH
========================= */

const tyLeHoanThanh =
  computed(() => {

    if (
      orders.value.length ===
      0
    )
      return 0;


    return Math.round(

      (
        donHoanThanh.value /
        orders.value.length
      ) * 100

    );

  });


/* =========================
   TỶ LỆ HỦY
========================= */

const tyLeHuy =
  computed(() => {

    if (
      orders.value.length ===
      0
    )
      return 0;


    return Math.round(

      (
        donHuy.value /
        orders.value.length
      ) * 100

    );

  });


/* =========================
   GIÁ TRỊ ĐƠN TRUNG BÌNH
========================= */

const giaTriDonTrungBinh =
  computed(() => {

    if (
      donHoanThanh.value ===
      0
    )
      return 0;


    return Math.round(

      doanhThu.value /
      donHoanThanh.value

    );

  });


/* =========================
   FILTER
========================= */

const filteredOrders =
  computed(() => {

    let result =
      [...orders.value];


    /* TÌM KIẾM */

    const keyword =
      search.value
        .trim()
        .toLowerCase();


    if (keyword) {

      result =
        result.filter(
          order => {

            const id =
              order._id
                ?.toLowerCase() ||
              "";


            const name =
              getCustomerName(order)
                .toLowerCase();


            return (
              id.includes(keyword) ||
              name.includes(keyword)
            );

          }
        );

    }


    /* STATUS */

    if (
      statusFilter.value
    ) {

      result =
        result.filter(
          order =>
            order.status ===
            statusFilter.value
        );

    }


    /* PAYMENT */

    if (
      paymentFilter.value
    ) {

      result =
        result.filter(
          order => {

            if (
              paymentFilter.value ===
              "paid"
            ) {

              return (
                order.isPaid ===
                  true ||
                order.paymentStatus ===
                  "paid"
              );

            }


            if (
              paymentFilter.value ===
              "waiting"
            ) {

              return (
                order.paymentStatus ===
                "waiting"
              );

            }


            if (
              paymentFilter.value ===
              "unpaid"
            ) {

              return (
                order.isPaid !==
                  true &&
                order.paymentStatus !==
                  "paid" &&
                order.paymentStatus !==
                  "waiting"
              );

            }


            return true;

          }
        );

    }


    /* MỚI NHẤT */

    result.sort(

      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )

    );


    return result;

  });


/* =========================
   CUSTOMER NAME
========================= */

const getCustomerName =
  (order) => {

    return (
      order.shippingAddress
        ?.ten ||
      "Khách hàng"
    );

  };


/* =========================
   SHORT ID
========================= */

const shortId =
  (id) => {

    if (!id)
      return "";

    return id.slice(-8);

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
   PAYMENT TEXT
========================= */

const getPaymentText =
  (order) => {

    if (
      order.isPaid === true ||
      order.paymentStatus ===
        "paid"
    ) {

      return "✓ Đã thanh toán";

    }


    if (
      order.paymentStatus ===
      "waiting"
    ) {

      return "⏳ Chờ xác nhận";

    }


    return "● Chưa thanh toán";

  };


/* =========================
   PAYMENT CLASS
========================= */

const getPaymentClass =
  (order) => {

    if (
      order.isPaid === true ||
      order.paymentStatus ===
        "paid"
    ) {

      return "payment-paid";

    }


    if (
      order.paymentStatus ===
      "waiting"
    ) {

      return "payment-waiting";

    }


    return "payment-unpaid";

  };


/* =========================
   RESET FILTER
========================= */

const clearFilter =
  () => {

    search.value =
      "";

    statusFilter.value =
      "";

    paymentFilter.value =
      "";

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
  loadData
);

</script>


<style scoped>

/* =====================================
   CONTAINER
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

  justify-content:
    space-between;

  align-items:
    center;

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


.actions {

  display:
    flex;

  gap:
    10px;

}


.actions button {

  border:
    none;

  padding:
    11px 17px;

  border-radius:
    9px;

  cursor:
    pointer;

  font-weight:
    600;

}


.refresh-btn {

  background:
    #111827;

  color:
    white;

}


.refresh-btn:hover {

  background:
    #2563eb;

}


.print-btn {

  background:
    #2563eb;

  color:
    white;

}


.print-btn:hover {

  background:
    #1d4ed8;

}


/* =====================================
   STATS
===================================== */

.stats-grid {

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    18px;

  margin-bottom:
    20px;

}


.stat-card {

  background:
    white;

  border-radius:
    15px;

  padding:
    22px;

  display:
    flex;

  align-items:
    center;

  gap:
    16px;

  box-shadow:
    0 4px 14px
    rgba(15,23,42,.06);

}


.stat-icon {

  width:
    55px;

  height:
    55px;

  border-radius:
    13px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    25px;

  background:
    #dcfce7;

}


.stat-icon.blue {

  background:
    #dbeafe;

}


.stat-icon.green {

  background:
    #dcfce7;

}


.stat-icon.red {

  background:
    #fee2e2;

}


.stat-card span {

  display:
    block;

  color:
    #6b7280;

  font-size:
    13px;

}


.stat-card strong {

  display:
    block;

  margin:
    5px 0;

  font-size:
    23px;

}


.stat-card small {

  color:
    #9ca3af;

  font-size:
    12px;

}


.revenue-card strong {

  color:
    #16a34a;

}


/* =====================================
   PAYMENT
===================================== */

.payment-grid {

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    18px;

  margin-bottom:
    25px;

}


.payment-card {

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


.payment-title {

  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  color:
    #6b7280;

  font-size:
    14px;

}


.payment-dot {

  width:
    9px;

  height:
    9px;

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


.payment-card strong {

  display:
    inline-block;

  margin-top:
    10px;

  font-size:
    27px;

}


.payment-card small {

  color:
    #9ca3af;

}


/* =====================================
   OVERVIEW
===================================== */

.overview {

  display:
    grid;

  grid-template-columns:
    1.5fr 1fr;

  gap:
    20px;

  margin-bottom:
    28px;

}


.overview-left,
.overview-right {

  background:
    white;

  border-radius:
    16px;

  padding:
    25px;

  box-shadow:
    0 4px 14px
    rgba(15,23,42,.05);

}


.overview-header {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

}


.overview-header h2 {

  margin:
    0;

  font-size:
    20px;

}


.overview-header p {

  margin:
    5px 0 0;

  color:
    #6b7280;

  font-size:
    13px;

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

  margin:
    28px 0;

  font-size:
    37px;

  font-weight:
    800;

  color:
    #16a34a;

}


.overview-info {

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

  gap:
    20px;

}


.overview-info div {

  background:
    #f8fafc;

  padding:
    15px;

  border-radius:
    10px;

}


.overview-info span {

  display:
    block;

  color:
    #6b7280;

  font-size:
    13px;

}


.overview-info strong {

  display:
    block;

  margin-top:
    5px;

  font-size:
    19px;

}


.overview-right h3 {

  margin:
    0;

  font-size:
    20px;

}


.overview-right > p {

  color:
    #6b7280;

  margin:
    5px 0 25px;

}


.progress-item {

  margin-bottom:
    22px;

}


.progress-label {

  display:
    flex;

  justify-content:
    space-between;

  margin-bottom:
    8px;

  font-size:
    14px;

}


.progress {

  height:
    9px;

  background:
    #eef2f7;

  border-radius:
    20px;

  overflow:
    hidden;

}


.progress-fill {

  height:
    100%;

  border-radius:
    20px;

}


.green-fill {

  background:
    #22c55e;

}


.red-fill {

  background:
    #ef4444;

}


/* =====================================
   FILTER
===================================== */

.filter-box {

  display:
    flex;

  align-items:
    center;

  gap:
    12px;

  background:
    white;

  padding:
    16px;

  border-radius:
    14px;

  margin-bottom:
    20px;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

}


.search-box {

  flex:
    1;

  min-width:
    250px;

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  border:
    1px solid #e5e7eb;

  border-radius:
    9px;

  padding:
    0 12px;

}


.search-box input {

  width:
    100%;

  border:
    none;

  outline:
    none;

  padding:
    11px 5px;

  font-size:
    14px;

}


.filter-box select {

  padding:
    11px 13px;

  border:
    1px solid #e5e7eb;

  border-radius:
    9px;

  background:
    white;

  outline:
    none;

  cursor:
    pointer;

}


.clear-filter {

  border:
    none;

  background:
    #f1f5f9;

  padding:
    11px 15px;

  border-radius:
    9px;

  cursor:
    pointer;

  font-weight:
    600;

}


.clear-filter:hover {

  background:
    #e2e8f0;

}


/* =====================================
   TABLE
===================================== */

.table-section {

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


.table-header-title {

  padding:
    23px 25px;

  border-bottom:
    1px solid #eef0f4;

}


.table-header-title h2 {

  margin:
    0;

  font-size:
    20px;

}


.table-header-title p {

  margin:
    5px 0 0;

  color:
    #6b7280;

  font-size:
    13px;

}


.table-wrapper {

  overflow-x:
    auto;

}


table {

  width:
    100%;

  border-collapse:
    collapse;

  min-width:
    1000px;

}


thead {

  background:
    #111827;

}


th {

  color:
    white;

  padding:
    16px 14px;

  text-align:
    left;

  font-size:
    13px;

}


td {

  padding:
    16px 14px;

  border-bottom:
    1px solid #eef0f4;

  font-size:
    14px;

}


tbody tr:hover {

  background:
    #f8fafc;

}


/* =====================================
   ORDER ID
===================================== */

.order-id strong {

  display:
    block;

  color:
    #111827;

}


.order-id small {

  display:
    block;

  margin-top:
    4px;

  color:
    #9ca3af;

  font-size:
    10px;

}


/* =====================================
   CUSTOMER
===================================== */

.customer {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

}


.avatar {

  width:
    36px;

  height:
    36px;

  border-radius:
    50%;

  background:
    #111827;

  color:
    white;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-weight:
    700;

}


.customer span {

  font-weight:
    600;

}


/* =====================================
   DATE
===================================== */

.date {

  color:
    #6b7280;

  white-space:
    nowrap;

}


/* =====================================
   PAYMENT BADGE
===================================== */

.payment-badge,
.status-badge {

  display:
    inline-block;

  padding:
    7px 11px;

  border-radius:
    20px;

  font-size:
    12px;

  font-weight:
    600;

  white-space:
    nowrap;

}


.payment-paid {

  background:
    #dcfce7;

  color:
    #15803d;

}


.payment-waiting {

  background:
    #fef3c7;

  color:
    #b45309;

}


.payment-unpaid {

  background:
    #fee2e2;

  color:
    #dc2626;

}


/* =====================================
   STATUS
===================================== */

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


/* =====================================
   MONEY
===================================== */

.order-money {

  color:
    #e11d48;

  display:
    block;

  white-space:
    nowrap;

}


.cancelledMoney {

  color:
    #9ca3af;

}


.not-revenue {

  display:
    block;

  margin-top:
    4px;

  color:
    #9ca3af;

  font-size:
    10px;

}


/* =====================================
   EMPTY
===================================== */

.empty {

  text-align:
    center;

  padding:
    60px !important;

}


.empty-icon {

  font-size:
    40px;

  margin-bottom:
    10px;

}


.empty p {

  color:
    #9ca3af;

}


/* =====================================
   FOOTER
===================================== */

.footer {

  display:
    flex;

  justify-content:
    space-between;

  margin-top:
    25px;

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

  .stats-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .payment-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .overview {

    grid-template-columns:
      1fr;

  }

}


@media(max-width:750px) {

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


  .stats-grid {

    grid-template-columns:
      1fr;

  }


  .payment-grid {

    grid-template-columns:
      1fr;

  }


  .filter-box {

    flex-direction:
      column;

    align-items:
      stretch;

  }


  .search-box {

    min-width:
      0;

  }


  .actions {

    width:
      100%;

  }


  .actions button {

    flex:
      1;

  }


  .footer {

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


  .actions,
  .filter-box {

    display:
      none;

  }


  .stat-card,
  .payment-card,
  .overview-left,
  .overview-right,
  .table-section {

    box-shadow:
      none;

    border:
      1px solid #ddd;

  }


  .table-section {

    overflow:
      visible;

  }


  table {

    min-width:
      0;

  }


  .order-id small {

    display:
      none;

  }


  .footer {

    margin-top:
      20px;

  }

}

</style>