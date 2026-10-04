<template>

  <div class="page">

    <!-- =========================
         HEADER
    ========================== -->

    <div class="page-header">

      <div>

        <div class="breadcrumb">
          Admin
          <span>›</span>
          Sản phẩm
          <span>›</span>
          Cập nhật
        </div>

        <h1>
          Cập nhật sản phẩm
        </h1>

        <p>
          Chỉnh sửa thông tin và cấu hình sản phẩm
        </p>

      </div>


      <button
        type="button"
        class="back-btn"
        @click="quayLai"
      >
        ← Quay lại
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
        Đang tải thông tin sản phẩm...
      </p>

    </div>


    <!-- =========================
         FORM
    ========================== -->

    <form
      v-else
      class="form-card"
      @submit.prevent="capNhat"
    >


      <!-- =========================
           THÔNG TIN CƠ BẢN
      ========================== -->

      <div class="section">

        <div class="section-title">

          <div class="section-icon">
            📱
          </div>

          <div>

            <h2>
              Thông tin sản phẩm
            </h2>

            <p>
              Thông tin cơ bản của điện thoại
            </p>

          </div>

        </div>


        <div class="form-grid">

          <!-- TÊN -->

          <div class="form-group full">

            <label>
              Tên sản phẩm
              <span>*</span>
            </label>

            <input
              v-model.trim="product.ten"
              type="text"
              placeholder="Ví dụ: iPhone 16 Pro Max"
              required
            />

          </div>


          <!-- HÃNG -->

          <div class="form-group">

            <label>
              Hãng
              <span>*</span>
            </label>

            <input
              v-model.trim="product.hang"
              type="text"
              placeholder="Ví dụ: Apple"
              required
            />

          </div>


          <!-- BẢO HÀNH -->

          <div class="form-group">

            <label>
              Bảo hành
            </label>

            <input
              v-model.trim="product.baohanh"
              type="text"
              placeholder="Ví dụ: 12 tháng"
            />

          </div>


          <!-- ẢNH -->

          <div class="form-group full">

            <label>
              Ảnh chính
              <span>*</span>
            </label>

            <input
              v-model.trim="product.hinh"
              type="text"
              placeholder="/images/ip16-1.png"
              required
            />

            <small>
              Nhập đường dẫn ảnh trong thư mục public/images
            </small>

          </div>

        </div>

      </div>


      <!-- =========================
           GIÁ THEO BỘ NHỚ
      ========================== -->

      <div class="section">

        <div class="section-title">

          <div class="section-icon">
            💰
          </div>

          <div>

            <h2>
              Giá theo bộ nhớ
            </h2>

            <p>
              Thiết lập giá riêng cho từng phiên bản
            </p>

          </div>

        </div>


        <div
          v-if="product.bonho.length === 0"
          class="notice"
        >

          ⚠️
          Chưa có bộ nhớ. Hãy thêm bộ nhớ bên dưới.

        </div>


        <div
          v-else
          class="price-list"
        >

          <div
            v-for="bonho in product.bonho"
            :key="bonho"
            class="price-row"
          >

            <div class="storage-label">

              💾

              <strong>
                {{ bonho }}
              </strong>

            </div>


            <div class="price-input">

              <input
                v-model.number="product.gia[bonho]"
                type="number"
                min="0"
                step="1000"
                placeholder="Nhập giá"
                required
              />

              <span>
                VNĐ
              </span>

            </div>

          </div>

        </div>

      </div>


      <!-- =========================
           BỘ NHỚ
      ========================== -->

      <div class="section">

        <div class="section-title">

          <div class="section-icon">
            💾
          </div>

          <div>

            <h2>
              Bộ nhớ
            </h2>

            <p>
              Các phiên bản bộ nhớ của sản phẩm
            </p>

          </div>

        </div>


        <!-- DANH SÁCH BỘ NHỚ -->

        <div class="tag-list">

          <div
            v-for="bonho in product.bonho"
            :key="bonho"
            class="tag storage-tag"
          >

            <span>
              {{ bonho }}
            </span>

            <button
              type="button"
              @click="xoaBonho(bonho)"
            >
              ×
            </button>

          </div>


          <div
            v-if="product.bonho.length === 0"
            class="empty-tag"
          >
            Chưa có bộ nhớ
          </div>

        </div>


        <!-- THÊM BỘ NHỚ -->

        <div class="add-row">

          <input
            v-model.trim="bonhoMoi"
            type="text"
            placeholder="Ví dụ: 1TB"
            @keyup.enter.prevent="themBonho"
          />

          <button
            type="button"
            class="add-small"
            @click="themBonho"
          >
            + Thêm
          </button>

        </div>

      </div>


      <!-- =========================
           MÀU SẮC
      ========================== -->

      <div class="section">

        <div class="section-title">

          <div class="section-icon">
            🎨
          </div>

          <div>

            <h2>
              Màu sắc
            </h2>

            <p>
              Các màu sắc khách hàng có thể lựa chọn
            </p>

          </div>

        </div>


        <!-- DANH SÁCH MÀU -->

        <div class="tag-list">

          <div
            v-for="mau in product.mau"
            :key="mau"
            class="tag color-tag"
          >

            <span>
              {{ mau }}
            </span>

            <button
              type="button"
              @click="xoaMau(mau)"
            >
              ×
            </button>

          </div>


          <div
            v-if="product.mau.length === 0"
            class="empty-tag"
          >
            Chưa có màu sắc
          </div>

        </div>


        <!-- THÊM MÀU -->

        <div class="add-row">

          <input
            v-model.trim="mauMoi"
            type="text"
            placeholder="Ví dụ: Đen"
            @keyup.enter.prevent="themMau"
          />

          <button
            type="button"
            class="add-small"
            @click="themMau"
          >
            + Thêm
          </button>

        </div>

      </div>


      <!-- =========================
           KHO
      ========================== -->

      <div class="section">

        <div class="section-title">

          <div class="section-icon">
            📦
          </div>

          <div>

            <h2>
              Quản lý kho
            </h2>

            <p>
              Số lượng sản phẩm hiện có
            </p>

          </div>

        </div>


        <div class="form-grid">

          <div class="form-group">

            <label>
              Tồn kho
            </label>

            <input
              v-model.number="product.stock"
              type="number"
              min="0"
              placeholder="10"
            />

          </div>

        </div>

      </div>


      <!-- =========================
           MÔ TẢ
      ========================== -->

      <div class="section">

        <div class="section-title">

          <div class="section-icon">
            📝
          </div>

          <div>

            <h2>
              Mô tả sản phẩm
            </h2>

            <p>
              Nội dung giới thiệu sản phẩm
            </p>

          </div>

        </div>


        <div class="form-group">

          <textarea
            v-model.trim="product.mota"
            rows="7"
            placeholder="Nhập mô tả sản phẩm..."
          ></textarea>

        </div>

      </div>


      <!-- =========================
           NỔI BẬT
      ========================== -->

      <div class="featured-box">

        <div class="featured-left">

          <div class="featured-icon">
            ⭐
          </div>

          <div>

            <strong>
              Sản phẩm nổi bật
            </strong>

            <p>
              Hiển thị sản phẩm trong danh sách nổi bật
            </p>

          </div>

        </div>


        <label class="switch">

          <input
            type="checkbox"
            v-model="product.noibat"
          />

          <span class="slider"></span>

        </label>

      </div>


      <!-- =========================
           BUTTON
      ========================== -->

      <div class="form-actions">

        <button
          type="button"
          class="cancel-btn"
          @click="quayLai"
          :disabled="saving"
        >
          Hủy
        </button>


        <button
          type="submit"
          class="save-btn"
          :disabled="saving"
        >

          <span v-if="saving">
            Đang lưu...
          </span>

          <span v-else>
            ✓ Lưu thay đổi
          </span>

        </button>

      </div>

    </form>

  </div>

</template>


<script setup>

import axios from "axios";

import Swal from "sweetalert2";

import {
  ref,
  onMounted
} from "vue";

import {
  useRoute,
  useRouter
} from "vue-router";


/* =========================
   ROUTER
========================= */

const route =
  useRoute();

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
   TRẠNG THÁI
========================= */

const loading =
  ref(true);

const saving =
  ref(false);


/* =========================
   INPUT THÊM
========================= */

const bonhoMoi =
  ref("");

const mauMoi =
  ref("");


/* =========================
   PRODUCT
========================= */

const product =
  ref({

    ten: "",

    gia: {},

    hang: "",

    hinh: "",

    hinhAnh: [],

    bonho: [],

    mau: [],

    baohanh: "12 tháng",

    mota: "",

    stock: 0,

    noibat: false

  });


/* =========================
   LOAD PRODUCT
========================= */

const loadProduct =
  async () => {

    loading.value = true;


    try {

      const res =
        await axios.get(
          `/sanpham/${route.params.id}`
        );


      const data =
        res.data;


      /*
        Đảm bảo bộ nhớ là Array
      */

      const bonho =
        Array.isArray(data.bonho)
          ? [...data.bonho]
          : [];


      /*
        Đảm bảo màu là Array
      */

      const mau =
        Array.isArray(data.mau)
          ? [...data.mau]
          : [];


      /*
        Xử lý giá
      */

      let gia = {};


      /*
        Trường hợp sản phẩm
        đã có giá theo bộ nhớ
      */

      if (
        data.gia &&
        typeof data.gia === "object" &&
        !Array.isArray(data.gia)
      ) {

        gia = {
          ...data.gia
        };

      }


      /*
        Trường hợp dữ liệu cũ
        vẫn đang là một số
      */

      else {

        const giaCu =
          Number(data.gia) || 0;


        bonho.forEach(
          (storage) => {

            gia[storage] =
              giaCu;

          }
        );

      }


      product.value = {

        ...data,

        gia,

        bonho,

        mau,

        stock:
          Number(data.stock || 0),

        noibat:
          Boolean(data.noibat),

        baohanh:
          data.baohanh ||
          "12 tháng",

        mota:
          data.mota || "",

        hinh:
          data.hinh || "",

        hinhAnh:
          Array.isArray(data.hinhAnh)
            ? data.hinhAnh
            : []

      };


    }
    catch (err) {

      console.error(
        "Lỗi lấy sản phẩm:",
        err
      );


      await Swal.fire({

        icon:
          "error",

        title:
          "Không tìm thấy sản phẩm",

        text:
          "Sản phẩm không tồn tại hoặc đã bị xóa."

      });


      router.push(
        "/adminsanpham"
      );

    }
    finally {

      loading.value = false;

    }

  };


/* =========================
   THÊM BỘ NHỚ
========================= */

const themBonho =
  () => {

    const value =
      bonhoMoi.value.trim();


    if (!value) {

      return;

    }


    /*
      Kiểm tra trùng
    */

    const exists =
      product.value.bonho.some(
        item =>
          item.toLowerCase() ===
          value.toLowerCase()
      );


    if (exists) {

      Swal.fire({

        icon:
          "warning",

        title:
          "Bộ nhớ đã tồn tại"

      });

      return;

    }


    /*
      Thêm vào danh sách
    */

    product.value.bonho.push(
      value
    );


    /*
      Tạo giá mặc định
    */

    if (
      product.value.gia[value] == null
    ) {

      product.value.gia[value] =
        0;

    }


    bonhoMoi.value = "";

  };


/* =========================
   XÓA BỘ NHỚ
========================= */

const xoaBonho =
  (storage) => {

    product.value.bonho =
      product.value.bonho.filter(
        item =>
          item !== storage
      );


    /*
      Xóa luôn giá
      của bộ nhớ đó
    */

    delete product.value.gia[
      storage
    ];

  };


/* =========================
   THÊM MÀU
========================= */

const themMau =
  () => {

    const value =
      mauMoi.value.trim();


    if (!value) {

      return;

    }


    const exists =
      product.value.mau.some(
        item =>
          item.toLowerCase() ===
          value.toLowerCase()
      );


    if (exists) {

      Swal.fire({

        icon:
          "warning",

        title:
          "Màu này đã tồn tại"

      });

      return;

    }


    product.value.mau.push(
      value
    );


    mauMoi.value = "";

  };


/* =========================
   XÓA MÀU
========================= */

const xoaMau =
  (color) => {

    product.value.mau =
      product.value.mau.filter(
        item =>
          item !== color
      );

  };


/* =========================
   KIỂM TRA DỮ LIỆU
========================= */

const validate =
  () => {

    if (
      !product.value.ten
    ) {

      Swal.fire({
        icon:
          "warning",
        title:
          "Thiếu tên sản phẩm",
        text:
          "Vui lòng nhập tên sản phẩm."
      });

      return false;

    }


    if (
      !product.value.hang
    ) {

      Swal.fire({
        icon:
          "warning",
        title:
          "Thiếu hãng",
        text:
          "Vui lòng nhập hãng sản phẩm."
      });

      return false;

    }


    if (
      !product.value.hinh
    ) {

      Swal.fire({
        icon:
          "warning",
        title:
          "Thiếu ảnh",
        text:
          "Vui lòng nhập ảnh chính."
      });

      return false;

    }


    if (
      product.value.bonho.length === 0
    ) {

      Swal.fire({
        icon:
          "warning",
        title:
          "Chưa có bộ nhớ",
        text:
          "Vui lòng thêm ít nhất một bộ nhớ."
      });

      return false;

    }


    /*
      Kiểm tra giá
    */

    for (
      const storage
      of product.value.bonho
    ) {

      const price =
        Number(
          product.value.gia[
            storage
          ]
        );


      if (
        !Number.isFinite(price) ||
        price <= 0
      ) {

        Swal.fire({

          icon:
            "warning",

          title:
            "Giá không hợp lệ",

          text:
            `Vui lòng nhập giá cho ${storage}.`

        });

        return false;

      }

    }


    return true;

  };


/* =========================
   CẬP NHẬT
========================= */

const capNhat =
  async () => {


    if (
      !validate()
    ) {

      return;

    }


    saving.value =
      true;


    try {


      /*
        Chỉ giữ giá
        của các bộ nhớ
        đang tồn tại
      */

      const giaMoi = {};


      product.value.bonho.forEach(
        (storage) => {

          giaMoi[storage] =
            Number(
              product.value.gia[
                storage
              ]
            );

        }
      );


      /*
        Dữ liệu gửi server
      */

      const data = {

        ten:
          product.value.ten,

        gia:
          giaMoi,

        hang:
          product.value.hang,

        hinh:
          product.value.hinh,

        hinhAnh:
          product.value.hinhAnh,

        bonho:
          product.value.bonho,

        mau:
          product.value.mau,

        baohanh:
          product.value.baohanh,

        mota:
          product.value.mota,

        stock:
          Number(
            product.value.stock || 0
          ),

        noibat:
          Boolean(
            product.value.noibat
          )

      };


      await axios.put(

        `/sanpham/${route.params.id}`,

        data,

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
          "Cập nhật thành công",

        text:
          "Thông tin sản phẩm đã được cập nhật.",

        timer:
          1600,

        showConfirmButton:
          false

      });


      router.push(
        "/adminsanpham"
      );


    }
    catch (err) {

      console.error(
        "Lỗi cập nhật:",
        err
      );


      Swal.fire({

        icon:
          "error",

        title:
          "Cập nhật thất bại",

        text:
          err.response?.data?.message ||
          "Không thể cập nhật sản phẩm."

      });

    }
    finally {

      saving.value =
        false;

    }

  };


/* =========================
   QUAY LẠI
========================= */

const quayLai =
  () => {

    router.push(
      "/adminsanpham"
    );

  };


/* =========================
   KHỞI TẠO
========================= */

onMounted(
  loadProduct
);

</script>


<style scoped>

/* =========================
   PAGE
========================= */

.page {

  min-height:
    100vh;

  padding:
    35px 50px;

  background:
    #f5f7fb;

  color:
    #111827;

}


/* =========================
   HEADER
========================= */

.page-header {

  max-width:
    1050px;

  margin:
    0 auto 25px;

  display:
    flex;

  align-items:
    flex-end;

  justify-content:
    space-between;

  gap:
    20px;

}


.breadcrumb {

  margin-bottom:
    10px;

  color:
    #64748b;

  font-size:
    13px;

}


.breadcrumb span {

  margin:
    0 8px;

  color:
    #94a3b8;

}


.page-header h1 {

  margin:
    0 0 6px;

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


.back-btn {

  padding:
    10px 17px;

  border:
    1px solid #dbe2ea;

  border-radius:
    9px;

  background:
    white;

  color:
    #334155;

  font-size:
    14px;

  font-weight:
    600;

  cursor:
    pointer;

  transition:
    .2s;

}


.back-btn:hover {

  background:
    #f8fafc;

  border-color:
    #94a3b8;

}


/* =========================
   FORM CARD
========================= */

.form-card {

  max-width:
    1050px;

  margin:
    auto;

  background:
    white;

  border:
    1px solid #e5e7eb;

  border-radius:
    18px;

  box-shadow:
    0 8px 30px
    rgba(15,23,42,.06);

  overflow:
    hidden;

}


/* =========================
   SECTION
========================= */

.section {

  padding:
    28px 32px;

  border-bottom:
    1px solid #edf0f3;

}


.section-title {

  display:
    flex;

  align-items:
    center;

  gap:
    13px;

  margin-bottom:
    23px;

}


.section-icon {

  width:
    43px;

  height:
    43px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    11px;

  background:
    #eff6ff;

  font-size:
    20px;

}


.section-title h2 {

  margin:
    0 0 4px;

  font-size:
    18px;

}


.section-title p {

  margin:
    0;

  color:
    #64748b;

  font-size:
    12px;

}


/* =========================
   FORM GRID
========================= */

.form-grid {

  display:
    grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap:
    20px;

}


.form-group {

  display:
    flex;

  flex-direction:
    column;

}


.form-group.full {

  grid-column:
    1 / -1;

}


.form-group label {

  margin-bottom:
    8px;

  color:
    #334155;

  font-size:
    13px;

  font-weight:
    700;

}


.form-group label span {

  color:
    #ef4444;

}


input,
textarea {

  width:
    100%;

  box-sizing:
    border-box;

  padding:
    12px 14px;

  border:
    1px solid #dbe2ea;

  border-radius:
    9px;

  outline:
    none;

  background:
    white;

  color:
    #111827;

  font-family:
    inherit;

  font-size:
    14px;

  transition:
    .2s;

}


input:focus,
textarea:focus {

  border-color:
    #2563eb;

  box-shadow:
    0 0 0 3px
    rgba(37,99,235,.1);

}


.form-group small {

  margin-top:
    6px;

  color:
    #94a3b8;

  font-size:
    11px;

}


textarea {

  resize:
    vertical;

  min-height:
    150px;

  line-height:
    1.6;

}


/* =========================
   PRICE
========================= */

.price-list {

  display:
    flex;

  flex-direction:
    column;

  gap:
    12px;

}


.price-row {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    20px;

  padding:
    13px;

  border:
    1px solid #e5e7eb;

  border-radius:
    10px;

  background:
    #f8fafc;

}


.storage-label {

  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  min-width:
    120px;

  color:
    #334155;

}


.storage-label strong {

  padding:
    6px 10px;

  border-radius:
    7px;

  background:
    #e2e8f0;

  font-size:
    13px;

}


.price-input {

  position:
    relative;

  flex:
    1;

  max-width:
    500px;

}


.price-input input {

  padding-right:
    55px;

}


.price-input span {

  position:
    absolute;

  right:
    14px;

  top:
    50%;

  transform:
    translateY(-50%);

  color:
    #64748b;

  font-size:
    11px;

  font-weight:
    700;

}


.notice {

  padding:
    14px 16px;

  border:
    1px solid #fde68a;

  border-radius:
    9px;

  background:
    #fffbeb;

  color:
    #92400e;

  font-size:
    13px;

}


/* =========================
   TAG
========================= */

.tag-list {

  display:
    flex;

  flex-wrap:
    wrap;

  gap:
    9px;

  margin-bottom:
    15px;

}


.tag {

  display:
    inline-flex;

  align-items:
    center;

  gap:
    7px;

  padding:
    7px 10px;

  border-radius:
    8px;

  font-size:
    12px;

  font-weight:
    600;

}


.storage-tag {

  background:
    #eff6ff;

  color:
    #1d4ed8;

}


.color-tag {

  background:
    #fdf2f8;

  color:
    #be185d;

}


.tag button {

  width:
    18px;

  height:
    18px;

  padding:
    0;

  border:
    none;

  border-radius:
    50%;

  background:
    rgba(0,0,0,.08);

  color:
    inherit;

  font-size:
    14px;

  line-height:
    18px;

  cursor:
    pointer;

}


.tag button:hover {

  background:
    rgba(0,0,0,.16);

}


.empty-tag {

  color:
    #94a3b8;

  font-size:
    13px;

}


/* =========================
   ADD ROW
========================= */

.add-row {

  display:
    flex;

  gap:
    10px;

}


.add-row input {

  max-width:
    350px;

}


.add-small {

  padding:
    0 18px;

  border:
    none;

  border-radius:
    9px;

  background:
    #2563eb;

  color:
    white;

  font-weight:
    700;

  cursor:
    pointer;

}


.add-small:hover {

  background:
    #1d4ed8;

}


/* =========================
   FEATURED
========================= */

.featured-box {

  margin:
    25px 32px;

  padding:
    17px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  border:
    1px solid #fde68a;

  border-radius:
    12px;

  background:
    #fffbeb;

}


.featured-left {

  display:
    flex;

  align-items:
    center;

  gap:
    12px;

}


.featured-icon {

  width:
    40px;

  height:
    40px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    10px;

  background:
    #fef3c7;

}


.featured-left strong {

  display:
    block;

  margin-bottom:
    3px;

  font-size:
    14px;

}


.featured-left p {

  margin:
    0;

  color:
    #92400e;

  font-size:
    11px;

}


/* =========================
   SWITCH
========================= */

.switch {

  position:
    relative;

  width:
    48px;

  height:
    27px;

}


.switch input {

  opacity:
    0;

  width:
    0;

  height:
    0;

}


.slider {

  position:
    absolute;

  inset:
    0;

  border-radius:
    30px;

  background:
    #cbd5e1;

  cursor:
    pointer;

  transition:
    .2s;

}


.slider::before {

  content:
    "";

  position:
    absolute;

  width:
    21px;

  height:
    21px;

  left:
    3px;

  top:
    3px;

  border-radius:
    50%;

  background:
    white;

  box-shadow:
    0 2px 5px
    rgba(0,0,0,.2);

  transition:
    .2s;

}


.switch input:checked + .slider {

  background:
    #f59e0b;

}


.switch input:checked + .slider::before {

  transform:
    translateX(21px);

}


/* =========================
   ACTIONS
========================= */

.form-actions {

  display:
    flex;

  justify-content:
    flex-end;

  gap:
    12px;

  padding:
    22px 32px;

  background:
    #f8fafc;

}


.cancel-btn,
.save-btn {

  min-width:
    130px;

  padding:
    12px 20px;

  border:
    none;

  border-radius:
    9px;

  font-size:
    14px;

  font-weight:
    700;

  cursor:
    pointer;

  transition:
    .2s;

}


.cancel-btn {

  border:
    1px solid #dbe2ea;

  background:
    white;

  color:
    #475569;

}


.cancel-btn:hover {

  background:
    #f1f5f9;

}


.save-btn {

  background:
    #2563eb;

  color:
    white;

  box-shadow:
    0 4px 10px
    rgba(37,99,235,.2);

}


.save-btn:hover {

  background:
    #1d4ed8;

  transform:
    translateY(-1px);

}


.save-btn:disabled,
.cancel-btn:disabled {

  opacity:
    .6;

  cursor:
    not-allowed;

}


/* =========================
   LOADING
========================= */

.loading {

  min-height:
    450px;

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
    40px;

  height:
    40px;

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
   RESPONSIVE
========================= */

@media (max-width: 750px) {

  .page {

    padding:
      25px 15px;

  }


  .page-header {

    flex-direction:
      column;

    align-items:
      flex-start;

  }


  .form-grid {

    grid-template-columns:
      1fr;

  }


  .form-group.full {

    grid-column:
      auto;

  }


  .section {

    padding:
      22px 18px;

  }


  .price-row {

    flex-direction:
      column;

    align-items:
      stretch;

  }


  .price-input {

    max-width:
      none;

  }


  .add-row {

    flex-direction:
      column;

  }


  .add-row input {

    max-width:
      none;

  }


  .add-small {

    height:
      42px;

  }


  .featured-box {

    margin:
      20px 18px;

  }


  .form-actions {

    padding:
      18px;

    flex-direction:
      column-reverse;

  }


  .cancel-btn,
  .save-btn {

    width:
      100%;

  }

}

</style>