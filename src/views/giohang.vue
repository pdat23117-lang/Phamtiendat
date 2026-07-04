<template>
  <div v-if="giohang.length === 0">
  <h2>Chưa có sản phẩm nào.</h2>
</div>

<div v-else>
  <div
    class="item"
    v-for="sp in giohang"
    :key="sp.id"
  >
    <img :src="sp.hinh">

    <div>
      <h3>{{ sp.ten }}</h3>
      <p>{{ sp.gia.toLocaleString() }} đ</p>
    </div>
  </div>
</div>
</template>

<script setup>
import { giohang } from "../stores/giohang";
import { computed } from "vue";

const tongTien = computed(() => {
  return giohang.reduce(
    (tong, sp) => tong + sp.gia,
    0
  );
});
</script>

CSS đó là CSS của trang giỏ hàng, nên bạn thêm vào file:

src/views/giohang.vue

Cấu trúc đầy đủ sẽ như này:

<template>
  <!-- HTML giỏ hàng -->
</template>

<script setup>
import { computed } from "vue";
import { giohang } from "../stores/giohang";

const tongTien = computed(() => {
  return giohang.reduce((tong, sp) => tong + sp.gia, 0);
});
<h2>
  Tổng tiền:
  {{ tongTien.toLocaleString() }} đ
</h2>
</script>

<style scoped>
.container {
  padding: 50px;
  background: #f5f5f5;
  min-height: 100vh;
}

.item {
  background: white;
  display: flex;
  gap: 20px;
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,.1);
}

.item img {
  width: 130px;
  height: 130px;
  object-fit: contain;
}

h2 {
  margin-top: 40px;
  font-size: 30px;
}
</style>