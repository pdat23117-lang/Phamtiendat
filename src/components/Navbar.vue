<template>
  <nav class="navbar">
    <h2 class="logo">DAT MOBILE</h2>
    <div class="search">
  <input
    type="text"
    placeholder="Tìm điện thoại..."
    v-model="tuKhoa"
  >
</div>

    <div class="menu">
      <RouterLink to="/">Trang chủ</RouterLink>
      <RouterLink to="/sanpham">Sản phẩm</RouterLink>
      <RouterLink to="/lienhe">Liên hệ</RouterLink>
      <RouterLink
  to="/giohang"
  class="cart"
>
  🛒 Giỏ hàng

  <span
    v-if="soLuong > 0"
    class="badge"
  >
    {{ soLuong }}
  </span>
</RouterLink>
    </div>
  </nav>
</template>
<script setup>
import { computed } from "vue";
import { giohang } from "../stores/giohang";
import { ref } from "vue";

const tuKhoa = ref("");

const soLuong = computed(() => {
  return giohang.reduce(
    (tong, sp) => tong + (sp.soluong || 1),
    0
  );
});
</script>
<style scoped>
.navbar {
  background: black;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 80px;
}

.logo {
  font-size: 30px;
  font-weight: bold;
}

.menu {
  display: flex;
  gap: 40px;
}

a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

a:hover {
  color: #9ca3af;
}
.cart {
  position: relative;
}

.badge {
  position: absolute;
  top: -10px;
  right: -18px;

  width: 22px;
  height: 22px;

  background: red;
  color: white;

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 13px;
  font-weight: bold;
}
.search input {
  width: 350px;
  padding: 12px 20px;
  border: none;
  border-radius: 30px;
  outline: none;
  font-size: 16px;
}
</style>