<template>
  <div v-if="sp" class="container">

    <div class="left">
      <img :src="sp.hinh" />
    </div>

    <div class="right">
      <h1>{{ sp.ten }}</h1>

      <h2>
        {{ sp.gia.toLocaleString() }} đ
      </h2>

      <p class="danhgia">
        ⭐ {{ sp.danhgia }}/5
      </p>

      <div class="thongtin">
        <p><b>Hãng:</b> {{ sp.hang }}</p>
        <p><b>RAM:</b> {{ sp.ram }}</p>
        <p><b>Bộ nhớ:</b> {{ sp.bonho }}</p>
        <p><b>Màu sắc:</b> {{ sp.mau }}</p>
        <p><b>Bảo hành:</b> {{ sp.baohanh }}</p>
      </div>

      <div class="buttons">
        <button
          class="them"
          @click="themGio"
        >
          Thêm vào giỏ hàng
        </button>

        <RouterLink to="/dathang">
          <button class="mua">
            Mua ngay
          </button>
        </RouterLink>
      </div>
    </div>

  </div>

  <div class="lienquan">
    <h2>Sản phẩm liên quan</h2>

    <div class="products">
      <ProductCard
        v-for="item in lienQuan"
        :key="item.id"
        :product="item"
      />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import sanpham from "../data/sanpham";
import { giohang } from "../stores/giohang";
import ProductCard from "../components/ProductCard.vue";

const route = useRoute();

const sp = sanpham.find(
  (item) =>
    item.id === Number(route.params.id)
);

const lienQuan = sanpham.filter(
  (item) =>
    item.hang === sp.hang &&
    item.id !== sp.id
);

function themGio() {
  const tonTai = giohang.find(
    (item) => item.id === sp.id
  );

  if (tonTai) {
    tonTai.soluong++;
  } else {
    giohang.push({
      ...sp,
      soluong: 1,
    });
  }

  localStorage.setItem(
    "giohang",
    JSON.stringify(giohang)
  );

  alert("Đã thêm vào giỏ hàng!");
}
</script>

<style scoped>
.container {
  display: flex;
  gap: 80px;
  padding: 80px;
  min-height: 80vh;
}

.left {
  flex: 1;
}

.left img {
  width: 100%;
  max-width: 500px;
}

.right {
  flex: 1;
}

.right h1 {
  font-size: 40px;
  margin-bottom: 20px;
}

.right h2 {
  color: red;
  margin-bottom: 20px;
}

.danhgia {
  color: orange;
  font-size: 20px;
  margin-bottom: 30px;
}

.thongtin {
  background: #f5f5f5;
  padding: 30px;
  border-radius: 20px;
}

.thongtin p {
  margin: 15px 0;
}

.buttons {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.them {
  background: black;
  color: white;
  border: none;
  padding: 18px 35px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
}

.mua {
  background: red;
  color: white;
  border: none;
  padding: 18px 35px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
}

.lienquan {
  padding: 0 80px 80px;
}

.lienquan h2 {
  margin-bottom: 40px;
}

.products {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(250px, 1fr));

  gap: 30px;
}
</style>