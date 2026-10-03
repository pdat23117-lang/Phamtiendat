<template>
  <div
    class="card"
    @click="goToDetail"
  >

    <img
      :src="product.hinh"
      :alt="product.ten"
    />

    <div class="body">

      <span class="brand">
        {{ product.hang }}
      </span>

      <h3>
        {{ product.ten }}
      </h3>

      <div class="spec">

        <span v-if="product.bonho?.length">
          {{ product.bonho.join(", ") }}
        </span>

      </div>

      <h2>
        {{ getStartingPrice(product) }} đ
      </h2>

      <div
        class="stock"
        :class="{
          out: product.stock <= 0
        }"
      >

        <span v-if="product.stock > 0">
          Còn {{ product.stock }} sản phẩm
        </span>

        <span v-else>
          Hết hàng
        </span>

      </div>

      <button
        @click.stop="themGioHang"
        :disabled="product.stock <= 0"
      >
        {{
          product.stock > 0
            ? "Thêm vào giỏ"
            : "Hết hàng"
        }}
      </button>

    </div>

  </div>
</template>


<script setup>

import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});


// ============================
// ĐI ĐẾN CHI TIẾT SẢN PHẨM
// ============================

const goToDetail = () => {

  router.push(
    `/chitietsanpham/${props.product._id}`
  );

};


// ============================
// LẤY GIÁ THẤP NHẤT
// ============================

const getStartingPrice = (product) => {

  if (!product || !product.gia) {
    return "0";
  }

  // Trường hợp gia là object:
  // {
  //   "128GB": 12990000,
  //   "256GB": 13990000,
  //   "512GB": 14990000
  // }

  if (
    typeof product.gia === "object" &&
    !Array.isArray(product.gia)
  ) {

    const prices = Object.values(product.gia)
      .map(Number)
      .filter(
        price => !isNaN(price)
      );

    if (prices.length === 0) {
      return "0";
    }

    return Math.min(
      ...prices
    ).toLocaleString("vi-VN");

  }


  // Trường hợp gia vẫn là số

  return Number(
    product.gia
  ).toLocaleString("vi-VN");

};


// ============================
// THÊM VÀO GIỎ HÀNG
// ============================

const themGioHang = async () => {

  const token =
    localStorage.getItem("token");

  if (!token) {

    alert(
      "Vui lòng đăng nhập"
    );

    return;

  }

  try {

    // Lấy GB đầu tiên làm lựa chọn mặc định

    const bonho =
      product.bonho?.[0] || "";

    // Lấy màu đầu tiên làm lựa chọn mặc định

    const mau =
      product.mau?.[0] || "";

    await axios.post(

      "/cart",

      {
        productId:
          props.product._id,

        bonho,

        mau,

        soluong: 1
      },

      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }

    );

    alert(
      "Đã thêm vào giỏ hàng"
    );

  }
  catch (err) {

    console.error(err);

    alert(

      err.response?.data?.message

      ||

      "Lỗi thêm giỏ hàng"

    );

  }

};

</script>


<style scoped>

.card {

  background: white;

  border-radius: 14px;

  overflow: hidden;

  box-shadow:
    0 2px 12px
    rgba(0,0,0,.08);

  transition: .3s;

  display: flex;

  flex-direction: column;

  cursor: pointer;

}


.card:hover {

  transform:
    translateY(-6px);

  box-shadow:
    0 10px 24px
    rgba(0,0,0,.15);

}


.card img {

  width: 100%;

  height: 240px;

  object-fit: contain;

  padding: 20px;

  background: white;

}


.body {

  padding: 20px;

}


.brand {

  display: inline-block;

  padding: 4px 12px;

  background: #eef2ff;

  color: #2563eb;

  border-radius: 30px;

  font-size: 13px;

  margin-bottom: 10px;

}


h3 {

  height: 55px;

  margin-bottom: 15px;

  font-size: 18px;

}


.spec {

  display: flex;

  gap: 10px;

  margin-bottom: 15px;

}


.spec span {

  background: #f3f4f6;

  padding: 6px 10px;

  border-radius: 6px;

  font-size: 13px;

  color: #555;

}


h2 {

  color: red;

  margin-bottom: 15px;

}


.stock {

  margin-bottom: 15px;

  font-weight: bold;

  color: #16a34a;

}


.stock.out {

  color: red;

}


button {

  width: 100%;

  padding: 14px;

  background: #111827;

  color: white;

  border: none;

  border-radius: 8px;

  cursor: pointer;

  font-size: 15px;

  transition: .3s;

}


button:hover {

  background: black;

}


button:disabled {

  background: #9ca3af;

  cursor: not-allowed;

}

</style>