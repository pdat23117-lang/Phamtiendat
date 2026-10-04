<template>

  <div class="admin-page">

    <!-- =========================
         HEADER
    ========================== -->

    <div class="page-header">

      <div class="header-left">

        <div class="header-icon">
          📱
        </div>

        <div>

          <h1>
            Quản lý sản phẩm
          </h1>

          <p>
            Quản lý danh sách điện thoại của DAT MOBILE
          </p>

        </div>

      </div>


      <button
        class="add-btn"
        @click="themSanPham"
      >

        <span class="add-icon">
          +
        </span>

        Thêm sản phẩm

      </button>

    </div>


    <!-- =========================
         THỐNG KÊ
    ========================== -->

    <div class="stats">

      <div class="stat-card">

        <div class="stat-icon blue">
          📱
        </div>

        <div>

          <span>
            Tổng sản phẩm
          </span>

          <strong>
            {{ products.length }}
          </strong>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon green">
          📦
        </div>

        <div>

          <span>
            Còn hàng
          </span>

          <strong>
            {{ totalStock }}
          </strong>

        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon orange">
          ⭐
        </div>

        <div>

          <span>
            Sản phẩm nổi bật
          </span>

          <strong>
            {{ featuredCount }}
          </strong>

        </div>

      </div>

    </div>


    <!-- =========================
         DANH SÁCH
    ========================== -->

    <div class="product-card">


      <div class="card-header">

        <div>

          <h2>
            Danh sách sản phẩm
          </h2>

          <p>
            {{ products.length }}
            sản phẩm đang được quản lý
          </p>

        </div>


        <button
          class="refresh-btn"
          @click="loadData"
        >

          ↻

          Làm mới

        </button>

      </div>


      <!-- =========================
           LOADING
      ========================== -->

      <div
        v-if="loading"
        class="loading"
      >

        <div class="spinner"></div>

        <p>
          Đang tải danh sách sản phẩm...
        </p>

      </div>


      <!-- =========================
           KHÔNG CÓ SẢN PHẨM
      ========================== -->

      <div
        v-else-if="products.length === 0"
        class="empty"
      >

        <div class="empty-icon">
          📦
        </div>

        <h3>
          Chưa có sản phẩm
        </h3>

        <p>
          Hãy thêm sản phẩm đầu tiên vào hệ thống.
        </p>

        <button
          class="add-btn empty-btn"
          @click="themSanPham"
        >
          + Thêm sản phẩm
        </button>

      </div>


      <!-- =========================
           TABLE
      ========================== -->

      <div
        v-else
        class="table-wrapper"
      >

        <table>

          <thead>

            <tr>

              <th class="stt">
                #
              </th>

              <th class="image-col">
                Sản phẩm
              </th>

              <th>
                Tên sản phẩm
              </th>

              <th>
                Hãng
              </th>

              <th class="price-col">
                Giá
              </th>

              <th>
                Tồn kho
              </th>

              <th>
                Nổi bật
              </th>

              <th>
                Thao tác
              </th>

            </tr>

          </thead>


          <tbody>

            <tr
              v-for="(sp, index) in products"
              :key="sp._id"
            >


              <!-- STT -->

              <td class="stt">

                <span class="number">
                  {{ index + 1 }}
                </span>

              </td>


              <!-- ẢNH -->

              <td>

                <div class="product-image">

                  <img
                    :src="sp.hinh"
                    :alt="sp.ten"
                    @error="handleImageError"
                  />

                </div>

              </td>


              <!-- TÊN -->

              <td class="name-cell">

                <strong>
                  {{ sp.ten }}
                </strong>

                <small>
                  ID: {{ sp._id }}
                </small>

              </td>


              <!-- HÃNG -->

              <td>

                <span class="brand">
                  {{ sp.hang }}
                </span>

              </td>


              <!-- GIÁ -->

              <td class="price-cell">

                <!-- Nếu giá là object -->

                <div
                  v-if="
                    typeof sp.gia === 'object' &&
                    sp.gia !== null
                  "
                  class="price-list"
                >

                  <div
                    v-for="(gia, bonho) in sp.gia"
                    :key="bonho"
                    class="price-item"
                  >

                    <span class="storage">
                      {{ bonho }}
                    </span>

                    <strong>
                      {{ formatPrice(gia) }} đ
                    </strong>

                  </div>

                </div>


                <!-- Nếu giá là số -->

                <div
                  v-else
                  class="single-price"
                >

                  {{ formatPrice(sp.gia) }} đ

                </div>

              </td>


              <!-- TỒN KHO -->

              <td>

                <span
                  class="stock"
                  :class="getStockClass(sp.stock)"
                >

                  <span class="stock-dot"></span>

                  {{ sp.stock }}

                </span>

              </td>


              <!-- NỔI BẬT -->

              <td>

                <span
                  v-if="sp.noibat"
                  class="featured"
                >

                  ⭐ Nổi bật

                </span>


                <span
                  v-else
                  class="normal"
                >

                  Thường

                </span>

              </td>


              <!-- THAO TÁC -->

              <td>

                <div class="actions">

                  <button
                    class="edit-btn"
                    @click="sua(sp)"
                    title="Sửa sản phẩm"
                  >

                    ✏️

                    <span>
                      Sửa
                    </span>

                  </button>


                  <button
                    class="delete-btn"
                    @click="xoa(sp._id)"
                    title="Xóa sản phẩm"
                  >

                    🗑️

                    <span>
                      Xóa
                    </span>

                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

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
  localStorage.getItem(
    "token"
  );


/* =========================
   DATA
========================= */

const products =
  ref([]);


const loading =
  ref(false);


/* =========================
   TỔNG TỒN KHO
========================= */

const totalStock =
  computed(() => {

    return products.value.reduce(
      (total, sp) => {

        return (
          total +
          Number(sp.stock || 0)
        );

      },
      0
    );

  });


/* =========================
   SẢN PHẨM NỔI BẬT
========================= */

const featuredCount =
  computed(() => {

    return products.value.filter(
      sp => sp.noibat
    ).length;

  });


/* =========================
   FORMAT GIÁ
========================= */

const formatPrice =
  (value) => {

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
   CLASS TỒN KHO
========================= */

const getStockClass =
  (stock) => {

    const value =
      Number(stock || 0);


    if (value <= 0) {

      return "out";

    }


    if (value <= 5) {

      return "low";

    }


    return "good";

  };


/* =========================
   LOAD SẢN PHẨM
========================= */

const loadData =
  async () => {

    loading.value = true;


    try {

      const res =
        await axios.get(
          "/sanpham"
        );


      products.value =
        Array.isArray(
          res.data?.products
        )
          ? res.data.products
          : [];


    }
    catch (err) {

      console.error(
        "Lỗi lấy sản phẩm:",
        err
      );


      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text:
          "Không thể tải danh sách sản phẩm."
      });

    }
    finally {

      loading.value = false;

    }

  };


/* =========================
   THÊM SẢN PHẨM
========================= */

const themSanPham =
  () => {

    router.push(
      "/them-san-pham"
    );

  };


/* =========================
   SỬA SẢN PHẨM
========================= */

const sua =
  (sp) => {

    router.push(
      `/sua-san-pham/${sp._id}`
    );

  };


/* =========================
   XÓA SẢN PHẨM
========================= */

const xoa =
  async (id) => {


    const result =
      await Swal.fire({

        title:
          "Xóa sản phẩm?",

        text:
          "Bạn sẽ không thể khôi phục sau khi xóa!",

        icon:
          "warning",

        showCancelButton:
          true,

        confirmButtonText:
          "Xóa sản phẩm",

        cancelButtonText:
          "Hủy",

        confirmButtonColor:
          "#ef4444",

        cancelButtonColor:
          "#64748b",

        reverseButtons:
          true

      });


    if (
      !result.isConfirmed
    ) {

      return;

    }


    try {

      await axios.delete(

        `/sanpham/${id}`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );


      await Swal.fire({

        icon:
          "success",

        title:
          "Đã xóa sản phẩm",

        text:
          "Sản phẩm đã được xóa khỏi hệ thống.",

        timer:
          1500,

        showConfirmButton:
          false

      });


      loadData();

    }
    catch (err) {

      console.error(
        err
      );


      Swal.fire({

        icon:
          "error",

        title:
          "Không thể xóa",

        text:
          err.response?.data?.message ||
          "Có lỗi xảy ra khi xóa sản phẩm."

      });

    }

  };


/* =========================
   LỖI ẢNH
========================= */

const handleImageError =
  (event) => {

    event.target.style.display =
      "none";

  };


/* =========================
   KHỞI TẠO
========================= */

onMounted(
  loadData
);

</script>


<style scoped>

/* =========================
   PAGE
========================= */

.admin-page {

  min-height: 100vh;

  padding: 35px 45px;

  background:
    #f5f7fb;

  color:
    #111827;

}


/* =========================
   HEADER
========================= */

.page-header {

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom:
    28px;

}


.header-left {

  display: flex;

  align-items:
    center;

  gap:
    16px;

}


.header-icon {

  width:
    52px;

  height:
    52px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    14px;

  background:
    #111827;

  font-size:
    25px;

}


.page-header h1 {

  margin:
    0 0 5px;

  font-size:
    30px;

  font-weight:
    800;

}


.page-header p {

  margin:
    0;

  color:
    #64748b;

  font-size:
    14px;

}


/* =========================
   ADD BUTTON
========================= */

.add-btn {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    8px;

  padding:
    12px 20px;

  border:
    none;

  border-radius:
    10px;

  background:
    #16a34a;

  color:
    white;

  font-size:
    14px;

  font-weight:
    700;

  cursor:
    pointer;

  box-shadow:
    0 4px 12px
    rgba(22,163,74,.2);

  transition:
    .2s;

}


.add-btn:hover {

  background:
    #15803d;

  transform:
    translateY(-1px);

}


.add-icon {

  font-size:
    20px;

  line-height:
    1;

}


/* =========================
   STATS
========================= */

.stats {

  display:
    grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap:
    18px;

  margin-bottom:
    25px;

}


.stat-card {

  display:
    flex;

  align-items:
    center;

  gap:
    15px;

  padding:
    20px;

  background:
    white;

  border:
    1px solid #e5e7eb;

  border-radius:
    14px;

  box-shadow:
    0 4px 15px
    rgba(15,23,42,.04);

}


.stat-icon {

  width:
    48px;

  height:
    48px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    12px;

  font-size:
    22px;

}


.stat-icon.blue {

  background:
    #eff6ff;

}


.stat-icon.green {

  background:
    #f0fdf4;

}


.stat-icon.orange {

  background:
    #fff7ed;

}


.stat-card span {

  display:
    block;

  color:
    #64748b;

  font-size:
    13px;

  margin-bottom:
    5px;

}


.stat-card strong {

  display:
    block;

  font-size:
    22px;

  font-weight:
    800;

}


/* =========================
   PRODUCT CARD
========================= */

.product-card {

  background:
    white;

  border:
    1px solid #e5e7eb;

  border-radius:
    16px;

  overflow:
    hidden;

  box-shadow:
    0 5px 20px
    rgba(15,23,42,.05);

}


.card-header {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  padding:
    22px 25px;

  border-bottom:
    1px solid #e5e7eb;

}


.card-header h2 {

  margin:
    0 0 5px;

  font-size:
    19px;

}


.card-header p {

  margin:
    0;

  color:
    #64748b;

  font-size:
    13px;

}


.refresh-btn {

  padding:
    9px 15px;

  border:
    1px solid #dbe2ea;

  border-radius:
    8px;

  background:
    white;

  color:
    #334155;

  cursor:
    pointer;

  font-weight:
    600;

}


.refresh-btn:hover {

  background:
    #f8fafc;

}


/* =========================
   TABLE
========================= */

.table-wrapper {

  width:
    100%;

  overflow-x:
    auto;

}


table {

  width:
    100%;

  min-width:
    1100px;

  border-collapse:
    collapse;

}


thead {

  background:
    #111827;

}


th {

  padding:
    15px 14px;

  color:
    white;

  font-size:
    13px;

  font-weight:
    700;

  text-align:
    center;

  white-space:
    nowrap;

}


td {

  padding:
    14px;

  border-bottom:
    1px solid #edf0f3;

  text-align:
    center;

  vertical-align:
    middle;

}


tbody tr {

  transition:
    .2s;

}


tbody tr:hover {

  background:
    #f8fafc;

}


/* =========================
   STT
========================= */

.stt {

  width:
    50px;

}


.number {

  display:
    inline-flex;

  width:
    28px;

  height:
    28px;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    #f1f5f9;

  color:
    #64748b;

  font-size:
    12px;

  font-weight:
    700;

}


/* =========================
   PRODUCT IMAGE
========================= */

.product-image {

  width:
    78px;

  height:
    78px;

  margin:
    auto;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid #e5e7eb;

  border-radius:
    12px;

  background:
    #f8fafc;

  overflow:
    hidden;

}


.product-image img {

  width:
    100%;

  height:
    100%;

  object-fit:
    contain;

  padding:
    6px;

}


/* =========================
   NAME
========================= */

.name-cell {

  min-width:
    180px;

  text-align:
    left;

}


.name-cell strong {

  display:
    block;

  font-size:
    14px;

  color:
    #111827;

  margin-bottom:
    5px;

}


.name-cell small {

  display:
    block;

  max-width:
    180px;

  overflow:
    hidden;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;

  color:
    #94a3b8;

  font-size:
    10px;

}


/* =========================
   BRAND
========================= */

.brand {

  display:
    inline-block;

  padding:
    6px 11px;

  border-radius:
    20px;

  background:
    #eff6ff;

  color:
    #2563eb;

  font-size:
    12px;

  font-weight:
    700;

}


/* =========================
   PRICE
========================= */

.price-cell {

  min-width:
    210px;

}


.price-list {

  display:
    flex;

  flex-direction:
    column;

  gap:
    6px;

}


.price-item {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    10px;

  padding:
    6px 9px;

  border-radius:
    7px;

  background:
    #f8fafc;

}


.storage {

  padding:
    3px 7px;

  border-radius:
    5px;

  background:
    #e2e8f0;

  color:
    #475569;

  font-size:
    11px;

  font-weight:
    700;

}


.price-item strong {

  color:
    #e11d48;

  font-size:
    12px;

  white-space:
    nowrap;

}


.single-price {

  color:
    #e11d48;

  font-size:
    15px;

  font-weight:
    800;

}


/* =========================
   STOCK
========================= */

.stock {

  display:
    inline-flex;

  align-items:
    center;

  gap:
    7px;

  padding:
    6px 10px;

  border-radius:
    20px;

  font-size:
    12px;

  font-weight:
    700;

}


.stock-dot {

  width:
    7px;

  height:
    7px;

  border-radius:
    50%;

}


.stock.good {

  background:
    #f0fdf4;

  color:
    #15803d;

}


.stock.good .stock-dot {

  background:
    #22c55e;

}


.stock.low {

  background:
    #fff7ed;

  color:
    #c2410c;

}


.stock.low .stock-dot {

  background:
    #f97316;

}


.stock.out {

  background:
    #fef2f2;

  color:
    #dc2626;

}


.stock.out .stock-dot {

  background:
    #ef4444;

}


/* =========================
   FEATURED
========================= */

.featured {

  display:
    inline-block;

  padding:
    6px 10px;

  border-radius:
    20px;

  background:
    #fef3c7;

  color:
    #b45309;

  font-size:
    11px;

  font-weight:
    700;

}


.normal {

  color:
    #94a3b8;

  font-size:
    12px;

}


/* =========================
   ACTIONS
========================= */

.actions {

  display:
    flex;

  justify-content:
    center;

  gap:
    8px;

}


.edit-btn,
.delete-btn {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    5px;

  min-width:
    72px;

  padding:
    8px 11px;

  border:
    none;

  border-radius:
    8px;

  color:
    white;

  font-size:
    12px;

  font-weight:
    700;

  cursor:
    pointer;

  transition:
    .2s;

}


.edit-btn {

  background:
    #2563eb;

}


.edit-btn:hover {

  background:
    #1d4ed8;

  transform:
    translateY(-1px);

}


.delete-btn {

  background:
    #ef4444;

}


.delete-btn:hover {

  background:
    #dc2626;

  transform:
    translateY(-1px);

}


/* =========================
   LOADING
========================= */

.loading {

  min-height:
    350px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  color:
    #64748b;

}


.spinner {

  width:
    38px;

  height:
    38px;

  margin-bottom:
    15px;

  border:
    4px solid #e5e7eb;

  border-top-color:
    #2563eb;

  border-radius:
    50%;

  animation:
    spin .8s linear infinite;

}


@keyframes spin {

  to {

    transform:
      rotate(360deg);

  }

}


/* =========================
   EMPTY
========================= */

.empty {

  padding:
    80px 20px;

  text-align:
    center;

}


.empty-icon {

  font-size:
    55px;

  margin-bottom:
    15px;

}


.empty h3 {

  margin:
    0 0 8px;

  font-size:
    20px;

}


.empty p {

  margin:
    0 0 20px;

  color:
    #64748b;

}


.empty-btn {

  border:
    none;

}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 900px) {

  .admin-page {

    padding:
      25px 20px;

  }


  .stats {

    grid-template-columns:
      1fr;

  }


  .page-header {

    align-items:
      flex-start;

    gap:
      20px;

  }


  .page-header h1 {

    font-size:
      25px;

  }

}


@media (max-width: 600px) {

  .page-header {

    flex-direction:
      column;

  }


  .add-btn {

    width:
      100%;

  }


  .card-header {

    padding:
      18px;

  }


  .card-header {

    align-items:
      flex-start;

    gap:
      15px;

  }

}

</style>