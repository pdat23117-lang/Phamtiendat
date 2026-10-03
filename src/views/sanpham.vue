<template>
  <div class="container">

    <h1>Tất cả sản phẩm</h1>

    <!-- Thanh tìm kiếm và lọc -->
    <div class="toolbar">

      <input
        v-model="keyword"
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
      />

      <select v-model="hang">
        <option value="">
          Tất cả hãng
        </option>

        <option value="Apple">
          Apple
        </option>

        <option value="Samsung">
          Samsung
        </option>

        <option value="Xiaomi">
          Xiaomi
        </option>
      </select>

      <select v-model="sort">
        <option value="">
          Sắp xếp
        </option>

        <option value="asc">
          Giá tăng dần
        </option>

        <option value="desc">
          Giá giảm dần
        </option>
      </select>

    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="loading"
    >
      Đang tải dữ liệu...
    </div>

    <!-- Danh sách sản phẩm -->
    <div
      v-else-if="pageProducts.length > 0"
      class="products"
    >

      <div
  v-for="product in pageProducts"
  :key="product._id"
  class="product-card"
  @click="detail(product._id)"
>

        <!-- Ảnh -->
        <img
          :src="product.hinh"
          :alt="product.ten"
          class="product-image"
        />

        <!-- Tên -->
        <h3 class="product-name">
          {{ product.ten }}
        </h3>

        <!-- Hãng -->
        <p class="product-brand">
          {{ product.hang }}
        </p>

        <!-- Giá thấp nhất -->
        <h2 class="product-price">
          {{ getStartingPrice(product) }} đ
        </h2>

        <button
  class="detail-button"
  @click.stop="detail(product._id)"
>
  Xem chi tiết
</button>

      </div>

    </div>

    <!-- Không có sản phẩm -->
    <div
      v-else
      class="empty"
    >
      <h2>
        Không tìm thấy sản phẩm
      </h2>
    </div>

    <!-- Phân trang -->
    <div
      v-if="!loading && filteredProducts.length > 0"
      class="pagination"
    >

      <!-- Trang trước -->
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
      >
        &lt;&lt;
      </button>

      <!-- Số trang -->
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="{
          active: currentPage === page
        }"
      >
        {{ page }}
      </button>

      <!-- Trang sau -->
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
      >
        &gt;&gt;
      </button>

    </div>

  </div>
</template>


<script setup>

import axios from "axios";

import {
  ref,
  computed,
  watch,
  onMounted
} from "vue";

import {
  useRouter
} from "vue-router";


const router = useRouter();


// ========================
// BIẾN
// ========================

const loading = ref(true);

const products = ref([]);

const keyword = ref("");

const hang = ref("");

const sort = ref("");

const currentPage = ref(1);

// Mỗi trang 8 sản phẩm
const perPage = 8;


// ========================
// LẤY SẢN PHẨM
// ========================

const loadData = async () => {

  try {

    const res = await axios.get("/sanpham");

    products.value = res.data.products || [];

    console.log(
      "Số sản phẩm nhận được:",
      products.value.length
    );

  } catch (err) {

    console.error(
      "Lỗi lấy sản phẩm:",
      err
    );

  } finally {

    loading.value = false;

  }

};


// ========================
// LẤY GIÁ THẤP NHẤT
// ========================

const getStartingPrice = (product) => {

  if (
    !product ||
    !product.gia
  ) {
    return "0";
  }

  const prices = Object.values(
    product.gia
  )
    .map(Number)
    .filter(price => !isNaN(price));

  if (prices.length === 0) {
    return "0";
  }

  const minPrice = Math.min(...prices);

  return minPrice.toLocaleString("vi-VN");

};


// ========================
// GIÁ DÙNG ĐỂ SẮP XẾP
// ========================

const getMinPrice = (product) => {

  if (
    !product ||
    !product.gia
  ) {
    return 0;
  }

  const prices = Object.values(
    product.gia
  )
    .map(Number)
    .filter(price => !isNaN(price));

  if (prices.length === 0) {
    return 0;
  }

  return Math.min(...prices);

};


// ========================
// LỌC + TÌM KIẾM + SẮP XẾP
// ========================

const filteredProducts = computed(() => {

  let data = [
    ...products.value
  ];


  // Tìm kiếm
  if (keyword.value) {

    const searchKeyword =
      keyword.value
        .toLowerCase()
        .trim();

    data = data.filter(
      item =>
        item.ten
          ?.toLowerCase()
          .includes(searchKeyword)
    );

  }


  // Lọc hãng
  if (hang.value) {

    data = data.filter(
      item =>
        item.hang === hang.value
    );

  }


  // Giá tăng dần
  if (sort.value === "asc") {

    data.sort(
      (a, b) =>
        getMinPrice(a) -
        getMinPrice(b)
    );

  }


  // Giá giảm dần
  if (sort.value === "desc") {

    data.sort(
      (a, b) =>
        getMinPrice(b) -
        getMinPrice(a)
    );

  }


  return data;

});


// ========================
// TỔNG SỐ TRANG
// ========================

const totalPages = computed(() => {

  return Math.ceil(
    filteredProducts.value.length /
    perPage
  );

});


// ========================
// SẢN PHẨM CỦA TRANG HIỆN TẠI
// ========================

const pageProducts = computed(() => {

  const start =
    (currentPage.value - 1) *
    perPage;

  return filteredProducts.value.slice(
    start,
    start + perPage
  );

});


// ========================
// KHI TÌM KIẾM / LỌC / SẮP XẾP
// QUAY VỀ TRANG 1
// ========================

watch(
  [
    keyword,
    hang,
    sort
  ],
  () => {

    currentPage.value = 1;

  }
);


// ========================
// XEM CHI TIẾT
// ========================

const detail = (id) => {

  router.push(
    `/chitietsanpham/${id}`
  );

};


// ========================
// LOAD KHI MỞ TRANG
// ========================

onMounted(() => {

  loadData();

});

</script>


<style scoped>

.container {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}


/* ========================
   TIÊU ĐỀ
======================== */

h1 {
  margin-bottom: 30px;
  font-size: 34px;
}


/* ========================
   THANH TÌM KIẾM
======================== */

.toolbar {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 35px;
}

.toolbar input {
  flex: 1;
  min-width: 250px;
  padding: 14px;

  border: 1px solid #ddd;
  border-radius: 10px;

  font-size: 15px;
}

.toolbar select {
  padding: 14px;

  border: 1px solid #ddd;
  border-radius: 10px;

  font-size: 15px;
  background: white;

  cursor: pointer;
}


/* ========================
   LOADING
======================== */

.loading {
  text-align: center;
  padding: 80px;
  font-size: 22px;
}


/* ========================
   DANH SÁCH SẢN PHẨM
======================== */

.products {

  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  gap: 30px;

}


/* ========================
   CARD SẢN PHẨM
======================== */

.product-card {

  background: white;

  border-radius: 12px;

  padding: 20px;

  box-shadow:
    0 2px 10px
    rgba(0, 0, 0, 0.08);

  display: flex;

  flex-direction: column;

  align-items: center;

  transition: 0.3s;

  min-width: 0;

}


.product-card:hover {

  transform:
    translateY(-5px);

  box-shadow:
    0 8px 20px
    rgba(0, 0, 0, 0.15);

}


/* ========================
   ẢNH SẢN PHẨM
======================== */

.product-image {

  width: 200px;

  height: 200px;

  object-fit: contain;

  display: block;

  margin-bottom: 20px;

  cursor: pointer;

}


/* ========================
   TÊN SẢN PHẨM
======================== */

.product-name {

  font-size: 18px;

  text-align: center;

  margin: 0 0 10px;

  min-height: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

}


/* ========================
   HÃNG
======================== */

.product-brand {

  color: #666;

  margin: 0 0 12px;

}


/* ========================
   GIÁ
======================== */

.product-price {

  font-size: 24px;

  color: #ef4444;

  margin: 0 0 18px;

  text-align: center;

}


/* ========================
   NÚT XEM CHI TIẾT
======================== */

.detail-button {

  width: 100%;

  padding: 14px;

  background: #111827;

  color: white;

  border: none;

  border-radius: 8px;

  font-size: 16px;

  cursor: pointer;

  transition: 0.3s;

}


.detail-button:hover {

  background: #000;

}


/* ========================
   PHÂN TRANG
======================== */

.pagination {

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 10px;

  margin-top: 40px;

  flex-wrap: wrap;

}


.pagination button {

  min-width: 45px;

  height: 45px;

  border: none;

  border-radius: 8px;

  background: #e5e7eb;

  cursor: pointer;

  font-size: 16px;

  font-weight: bold;

  transition: 0.3s;

}


.pagination button:hover {

  background: #d1d5db;

}


.pagination button.active {

  background: #111827;

  color: white;

}


.pagination button:disabled {

  opacity: 0.5;

  cursor: not-allowed;

}


/* ========================
   KHÔNG CÓ SẢN PHẨM
======================== */

.empty {

  text-align: center;

  padding: 80px;

  font-size: 22px;

  color: #666;

}


.empty h2 {

  margin-bottom: 20px;

}


/* ========================
   RESPONSIVE
======================== */

@media (max-width: 1100px) {

  .products {

    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );

  }

}


@media (max-width: 800px) {

  .container {

    padding: 20px;

  }

  .toolbar {

    flex-direction: column;

  }

  .toolbar input,
  .toolbar select {

    width: 100%;

  }

  .products {

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

  }

}


@media (max-width: 500px) {

  h1 {

    font-size: 28px;

    text-align: center;

  }

  .products {

    grid-template-columns:
      1fr;

  }

  .product-image {

    width: 180px;

    height: 180px;

  }

  .product-name {

    font-size: 16px;

    min-height: auto;

  }

  .product-price {

    font-size: 20px;

  }

  .detail-button {

    padding: 12px;

    font-size: 15px;

  }

}
.product-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  align-items: center;

  transition: 0.3s;

  min-width: 0;

  /* Thêm */
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-5px);

  box-shadow:
    0 8px 20px
    rgba(0, 0, 0, 0.15);
}
</style>