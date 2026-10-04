<template>
  <div class="contact-page">

    <!-- HEADER -->
    <div class="page-header">

      <div>
        <h1>Quản lý liên hệ</h1>

        <p>
          Quản lý và xử lý các yêu cầu liên hệ từ khách hàng
        </p>
      </div>

      <button
        class="refresh-btn"
        @click="loadData"
      >
        🔄 Làm mới
      </button>

    </div>


    <!-- THỐNG KÊ -->
    <div class="stats">

      <div class="stat-card">

        <div class="stat-icon blue">
          💬
        </div>

        <div>
          <p>Tổng liên hệ</p>

          <h2>
            {{ contacts.length }}
          </h2>
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon orange">
          ⏳
        </div>

        <div>
          <p>Chưa xử lý</p>

          <h2>
            {{ chuaXuLy }}
          </h2>
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon green">
          ✓
        </div>

        <div>
          <p>Đã xử lý</p>

          <h2>
            {{ daXuLy }}
          </h2>
        </div>

      </div>

    </div>


    <!-- TOOLBAR -->
    <div class="toolbar">

      <div class="search-box">

        🔍

        <input
          v-model="search"
          type="text"
          placeholder="Tìm theo tên, email, tiêu đề..."
        />

      </div>


      <select
        v-model="filterStatus"
        class="filter"
      >

        <option value="all">
          Tất cả trạng thái
        </option>

        <option value="chuaxuly">
          Chưa xử lý
        </option>

        <option value="daxuly">
          Đã xử lý
        </option>

      </select>

    </div>


    <!-- TABLE -->
    <div class="table-card">

      <div class="table-header">

        <div>
          <h2>Danh sách liên hệ</h2>

          <p>
            {{ filteredContacts.length }}
            liên hệ
          </p>
        </div>

      </div>


      <div class="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Khách hàng</th>

              <th>Email</th>

              <th>SĐT</th>

              <th>Tiêu đề</th>

              <th>Trạng thái</th>

              <th>Ngày gửi</th>

              <th>Thao tác</th>

            </tr>

          </thead>


          <tbody>

            <tr
              v-for="item in filteredContacts"
              :key="item._id"
            >

              <!-- KHÁCH HÀNG -->
              <td>

                <div class="customer">

                  <div class="avatar">
                    {{ getInitial(item.hoTen) }}
                  </div>

                  <div>

                    <strong>
                      {{ item.hoTen }}
                    </strong>

                    <small>
                      Khách hàng
                    </small>

                  </div>

                </div>

              </td>


              <!-- EMAIL -->
              <td>

                <span class="email">
                  {{ item.email }}
                </span>

              </td>


              <!-- SĐT -->
              <td>

                <span class="phone">
                  {{ item.soDienThoai }}
                </span>

              </td>


              <!-- TIÊU ĐỀ -->
              <td>

                <div class="subject">

                  {{ item.tieuDe }}

                </div>

              </td>


              <!-- TRẠNG THÁI -->
              <td>

                <select
                  v-model="item.trangThai"
                  class="status-select"
                  :class="item.trangThai"
                  @change="update(item)"
                >

                  <option value="chuaxuly">
                    Chưa xử lý
                  </option>

                  <option value="daxuly">
                    Đã xử lý
                  </option>

                </select>

              </td>


              <!-- NGÀY -->
              <td>

                <span class="date">
                  {{ formatDate(item.createdAt) }}
                </span>

              </td>


              <!-- THAO TÁC -->
              <td>

                <div class="actions">

                  <button
                    class="view-btn"
                    @click="detail(item)"
                  >
                    👁 Xem
                  </button>


                  <button
                    class="delete-btn"
                    @click="remove(item._id)"
                  >
                    🗑
                  </button>

                </div>

              </td>

            </tr>


            <!-- KHÔNG CÓ DỮ LIỆU -->
            <tr
              v-if="filteredContacts.length === 0"
            >

              <td
                colspan="7"
                class="empty"
              >

                <div class="empty-icon">
                  📭
                </div>

                <h3>
                  Không tìm thấy liên hệ
                </h3>

                <p>
                  Chưa có dữ liệu phù hợp với tìm kiếm.
                </p>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>


    <!-- MODAL CHI TIẾT -->
    <div
      v-if="selectedContact"
      class="modal-overlay"
      @click.self="closeDetail"
    >

      <div class="modal">

        <div class="modal-header">

          <div>

            <h2>
              Chi tiết liên hệ
            </h2>

            <p>
              Thông tin khách hàng
            </p>

          </div>

          <button
            class="close-btn"
            @click="closeDetail"
          >
            ✕
          </button>

        </div>


        <div class="detail-content">

          <!-- THÔNG TIN KHÁCH -->
          <div class="detail-user">

            <div class="detail-avatar">

              {{ getInitial(selectedContact.hoTen) }}

            </div>

            <div>

              <h3>
                {{ selectedContact.hoTen }}
              </h3>

              <p>
                {{ selectedContact.email }}
              </p>

            </div>

          </div>


          <div class="detail-grid">

            <div class="detail-item">

              <label>
                📧 Email
              </label>

              <span>
                {{ selectedContact.email }}
              </span>

            </div>


            <div class="detail-item">

              <label>
                📱 Số điện thoại
              </label>

              <span>
                {{ selectedContact.soDienThoai }}
              </span>

            </div>


            <div class="detail-item">

              <label>
                📌 Tiêu đề
              </label>

              <span>
                {{ selectedContact.tieuDe }}
              </span>

            </div>


            <div class="detail-item">

              <label>
                🕐 Ngày gửi
              </label>

              <span>
                {{ formatDate(selectedContact.createdAt) }}
              </span>

            </div>

          </div>


          <!-- NỘI DUNG -->
          <div class="message-box">

            <label>
              💬 Nội dung liên hệ
            </label>

            <div class="message">

              {{ selectedContact.noiDung }}

            </div>

          </div>


          <!-- STATUS -->
          <div class="modal-status">

            <label>
              Trạng thái xử lý
            </label>

            <select
              v-model="selectedContact.trangThai"
              class="modal-select"
              @change="update(selectedContact)"
            >

              <option value="chuaxuly">
                Chưa xử lý
              </option>

              <option value="daxuly">
                Đã xử lý
              </option>

            </select>

          </div>

        </div>


        <div class="modal-footer">

          <button
            class="close-modal"
            @click="closeDetail"
          >
            Đóng
          </button>

          <button
            class="delete-modal"
            @click="remove(selectedContact._id)"
          >
            🗑 Xóa liên hệ
          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup>

import axios from "axios";

import Swal from "sweetalert2";

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

const contacts =
  ref([]);


const search =
  ref("");


const filterStatus =
  ref("all");


const selectedContact =
  ref(null);


/* =========================
   LOAD DATA
========================= */

const loadData =
  async () => {

    try {

      const res =
        await axios.get(
          "/lienhe/admin",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      contacts.value =
        res.data;

    }

    catch (err) {

      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text:
          err.response?.data?.message ||
          "Không thể tải danh sách liên hệ",
      });

    }

  };


/* =========================
   THỐNG KÊ
========================= */

const chuaXuLy =
  computed(() => {

    return contacts.value.filter(
      item =>
        item.trangThai === "chuaxuly"
    ).length;

  });


const daXuLy =
  computed(() => {

    return contacts.value.filter(
      item =>
        item.trangThai === "daxuly"
    ).length;

  });


/* =========================
   TÌM KIẾM + LỌC
========================= */

const filteredContacts =
  computed(() => {

    const keyword =
      search.value
        .toLowerCase()
        .trim();


    return contacts.value.filter(
      item => {

        const matchSearch =

          !keyword ||

          item.hoTen
            ?.toLowerCase()
            .includes(keyword) ||

          item.email
            ?.toLowerCase()
            .includes(keyword) ||

          item.tieuDe
            ?.toLowerCase()
            .includes(keyword);


        const matchStatus =

          filterStatus.value === "all" ||

          item.trangThai ===
            filterStatus.value;


        return (
          matchSearch &&
          matchStatus
        );

      }
    );

  });


/* =========================
   CẬP NHẬT TRẠNG THÁI
========================= */

const update =
  async (item) => {

    try {

      await axios.put(
        `/lienhe/admin/${item._id}`,
        {
          trangThai:
            item.trangThai,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      Swal.fire({
        icon: "success",
        title: "Đã cập nhật",
        text:
          item.trangThai === "daxuly"
            ? "Liên hệ đã được đánh dấu đã xử lý."
            : "Liên hệ đã chuyển về chưa xử lý.",
        timer: 1300,
        showConfirmButton: false,
      });

    }

    catch (err) {

      Swal.fire({
        icon: "error",
        title: "Không thể cập nhật",
        text:
          err.response?.data?.message ||
          "Có lỗi xảy ra",
      });

      await loadData();

    }

  };


/* =========================
   XEM CHI TIẾT
========================= */

const detail =
  (item) => {

    selectedContact.value =
      item;

  };


/* =========================
   ĐÓNG MODAL
========================= */

const closeDetail =
  () => {

    selectedContact.value =
      null;

  };


/* =========================
   XÓA
========================= */

const remove =
  async (id) => {

    const result =
      await Swal.fire({

        title:
          "Xóa liên hệ?",

        text:
          "Liên hệ này sẽ bị xóa khỏi hệ thống.",

        icon:
          "warning",

        showCancelButton:
          true,

        confirmButtonText:
          "Xóa",

        cancelButtonText:
          "Hủy",

        confirmButtonColor:
          "#ef4444",

        cancelButtonColor:
          "#64748b",

      });


    if (!result.isConfirmed)
      return;


    try {

      await axios.delete(
        `/lienhe/admin/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      contacts.value =
        contacts.value.filter(
          item =>
            item._id !== id
        );


      selectedContact.value =
        null;


      Swal.fire({
        icon: "success",
        title: "Đã xóa",
        text:
          "Liên hệ đã được xóa.",
        timer: 1300,
        showConfirmButton: false,
      });

    }

    catch (err) {

      Swal.fire({
        icon: "error",
        title: "Không thể xóa",
        text:
          err.response?.data?.message ||
          "Có lỗi xảy ra",
      });

    }

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
   START
========================= */

onMounted(
  loadData
);

</script>


<style scoped>

/* =================================
   PAGE
================================= */

.contact-page {

  min-height: 100vh;

  padding: 35px 40px;

  background:
    #f5f7fb;

  color:
    #111827;

}


/* =================================
   HEADER
================================= */

.page-header {

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom:
    25px;

}


.page-header h1 {

  margin: 0;

  font-size:
    30px;

  font-weight:
    800;

}


.page-header p {

  margin-top:
    7px;

  color:
    #6b7280;

  font-size:
    15px;

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

  transition:
    .2s;

}


.refresh-btn:hover {

  background:
    #2563eb;

  transform:
    translateY(-1px);

}


/* =================================
   STATS
================================= */

.stats {

  display:
    grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap:
    20px;

  margin-bottom:
    25px;

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
    0 4px 15px
    rgba(15,23,42,.06);

}


.stat-icon {

  width:
    55px;

  height:
    55px;

  border-radius:
    14px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    25px;

}


.stat-icon.blue {

  background:
    #dbeafe;

}


.stat-icon.orange {

  background:
    #fef3c7;

}


.stat-icon.green {

  background:
    #dcfce7;

}


.stat-card p {

  margin:
    0 0 5px;

  color:
    #6b7280;

}


.stat-card h2 {

  margin:
    0;

  font-size:
    28px;

}


/* =================================
   TOOLBAR
================================= */

.toolbar {

  background:
    white;

  padding:
    18px;

  border-radius:
    14px;

  display:
    flex;

  gap:
    15px;

  margin-bottom:
    20px;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

}


.search-box {

  flex:
    1;

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  border:
    1px solid #e5e7eb;

  border-radius:
    9px;

  padding:
    0 14px;

}


.search-box input {

  flex:
    1;

  border:
    none;

  outline:
    none;

  padding:
    12px 0;

  font-size:
    14px;

}


.filter {

  min-width:
    190px;

  border:
    1px solid #e5e7eb;

  border-radius:
    9px;

  padding:
    0 15px;

  background:
    white;

  outline:
    none;

}


/* =================================
   TABLE CARD
================================= */

.table-card {

  background:
    white;

  border-radius:
    16px;

  overflow:
    hidden;

  box-shadow:
    0 4px 15px
    rgba(15,23,42,.06);

}


.table-header {

  padding:
    22px 25px;

  border-bottom:
    1px solid #eef0f4;

}


.table-header h2 {

  margin:
    0;

  font-size:
    20px;

}


.table-header p {

  margin:
    5px 0 0;

  color:
    #6b7280;

  font-size:
    14px;

}


/* =================================
   TABLE
================================= */

.table-wrapper {

  overflow-x:
    auto;

}


table {

  width:
    100%;

  border-collapse:
    collapse;

}


th {

  background:
    #111827;

  color:
    white;

  padding:
    15px;

  text-align:
    left;

  font-size:
    14px;

}


td {

  padding:
    16px;

  border-bottom:
    1px solid #edf0f4;

  font-size:
    14px;

}


tbody tr {

  transition:
    .2s;

}


tbody tr:hover {

  background:
    #f8fafc;

}


/* =================================
   CUSTOMER
================================= */

.customer {

  display:
    flex;

  align-items:
    center;

  gap:
    12px;

}


.avatar,
.detail-avatar {

  width:
    42px;

  height:
    42px;

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
    800;

}


.customer strong {

  display:
    block;

}


.customer small {

  display:
    block;

  margin-top:
    3px;

  color:
    #9ca3af;

}


.email {

  color:
    #2563eb;

}


.phone {

  color:
    #374151;

}


.subject {

  max-width:
    190px;

  font-weight:
    600;

}


/* =================================
   STATUS
================================= */

.status-select {

  padding:
    8px 12px;

  border-radius:
    8px;

  font-weight:
    600;

  outline:
    none;

  cursor:
    pointer;

}


.status-select.chuaxuly {

  border:
    1px solid #f59e0b;

  background:
    #fffbeb;

  color:
    #b45309;

}


.status-select.daxuly {

  border:
    1px solid #22c55e;

  background:
    #f0fdf4;

  color:
    #15803d;

}


.date {

  color:
    #6b7280;

  white-space:
    nowrap;

}


/* =================================
   ACTION
================================= */

.actions {

  display:
    flex;

  gap:
    8px;

}


.view-btn,
.delete-btn {

  border:
    none;

  border-radius:
    8px;

  padding:
    9px 13px;

  cursor:
    pointer;

  font-weight:
    600;

}


.view-btn {

  background:
    #2563eb;

  color:
    white;

}


.delete-btn {

  background:
    #fee2e2;

  color:
    #dc2626;

}


.view-btn:hover,
.delete-btn:hover {

  opacity:
    .85;

}


/* =================================
   EMPTY
================================= */

.empty {

  padding:
    60px !important;

  text-align:
    center !important;

}


.empty-icon {

  font-size:
    45px;

}


.empty h3 {

  margin:
    10px 0 5px;

}


.empty p {

  color:
    #9ca3af;

}


/* =================================
   MODAL
================================= */

.modal-overlay {

  position:
    fixed;

  inset:
    0;

  background:
    rgba(15,23,42,.55);

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  z-index:
    9999;

  padding:
    20px;

}


.modal {

  width:
    min(700px, 100%);

  max-height:
    90vh;

  overflow-y:
    auto;

  background:
    white;

  border-radius:
    18px;

  box-shadow:
    0 20px 60px
    rgba(0,0,0,.25);

}


.modal-header {

  display:
    flex;

  justify-content:
    space-between;

  padding:
    25px;

  border-bottom:
    1px solid #eee;

}


.modal-header h2 {

  margin:
    0;

}


.modal-header p {

  margin:
    5px 0 0;

  color:
    #6b7280;

}


.close-btn {

  width:
    38px;

  height:
    38px;

  border:
    none;

  border-radius:
    50%;

  background:
    #f3f4f6;

  cursor:
    pointer;

  font-size:
    18px;

}


.detail-content {

  padding:
    25px;

}


.detail-user {

  display:
    flex;

  align-items:
    center;

  gap:
    14px;

  margin-bottom:
    25px;

}


.detail-user h3 {

  margin:
    0 0 5px;

}


.detail-user p {

  margin:
    0;

  color:
    #6b7280;

}


.detail-grid {

  display:
    grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap:
    15px;

}


.detail-item {

  background:
    #f8fafc;

  padding:
    15px;

  border-radius:
    10px;

}


.detail-item label,
.modal-status label,
.message-box label {

  display:
    block;

  color:
    #6b7280;

  font-size:
    13px;

  margin-bottom:
    7px;

}


.detail-item span {

  font-weight:
    600;

}


.message-box {

  margin-top:
    20px;

}


.message {

  background:
    #f8fafc;

  border:
    1px solid #e5e7eb;

  border-radius:
    10px;

  padding:
    18px;

  line-height:
    1.7;

  white-space:
    pre-wrap;

}


.modal-status {

  margin-top:
    20px;

}


.modal-select {

  width:
    100%;

  padding:
    12px;

  border:
    1px solid #ddd;

  border-radius:
    8px;

}


.modal-footer {

  display:
    flex;

  justify-content:
    flex-end;

  gap:
    10px;

  padding:
    20px 25px;

  border-top:
    1px solid #eee;

}


.close-modal,
.delete-modal {

  border:
    none;

  padding:
    11px 18px;

  border-radius:
    8px;

  cursor:
    pointer;

  font-weight:
    600;

}


.close-modal {

  background:
    #e5e7eb;

  color:
    #374151;

}


.delete-modal {

  background:
    #fee2e2;

  color:
    #dc2626;

}


/* =================================
   RESPONSIVE
================================= */

@media(max-width:1000px) {

  .stats {

    grid-template-columns:
      1fr;

  }

}


@media(max-width:700px) {

  .contact-page {

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


  .toolbar {

    flex-direction:
      column;

  }


  .filter {

    height:
      45px;

  }


  .detail-grid {

    grid-template-columns:
      1fr;

  }

}

</style>