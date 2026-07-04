<template>
  <div v-if="sp" class="detail">

    <div class="left">
      <img :src="sp.hinh">
    </div>

    <div class="right">
      <h1>{{ sp.ten }}</h1>

      <h2>
        {{ sp.gia.toLocaleString() }} đ
      </h2>

      <p>
        {{ sp.mota }}
      </p>

      <button @click="themGioHang">
  Thêm vào giỏ hàng
</button>
    </div>

  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import sanpham from "../data/sanpham";
import { giohang } from "../stores/giohang";

const route = useRoute();

const sp = sanpham.find(
  item => item.id == route.params.id
);

function themGioHang() {
  giohang.push(sp);
  alert("Đã thêm vào giỏ hàng");
}
</script>

<style scoped>
.detail {
  display: flex;
  gap: 50px;
  padding: 50px;
}

.left img {
  width: 400px;
}

.right {
  flex: 1;
}

.right h1 {
  font-size: 40px;
}

.right h2 {
  color: red;
  margin: 20px 0;
}

button {
  background: black;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  cursor: pointer;
}
</style>