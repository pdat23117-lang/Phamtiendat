<template>
  <nav class="navbar">
    <!-- Logo -->
    <RouterLink
      to="/"
      class="logo"
    >
      DAT MOBILE
    </RouterLink>

    <!-- Tìm kiếm -->
    <div class="search">
      <input
        type="text"
        placeholder="🔍 Tìm điện thoại..."
        v-model="timKiemStore.tuKhoa"
      />
    </div>

    <!-- Menu -->
    <div class="menu">
      <RouterLink to="/">
        Trang chủ
      </RouterLink>

      <RouterLink to="/sanpham">
        Sản phẩm
      </RouterLink>

      <RouterLink to="/lienhe">
        Liên hệ
      </RouterLink>

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

      <!-- Đã đăng nhập -->
      <template v-if="user">
        <RouterLink to="/hosocanhan">
          Xin chào, {{ user.name }}
        </RouterLink>

        <RouterLink
          v-if="user.role === 'admin'"
          to="/admin"
        >
          Quản trị
        </RouterLink>

        <a
          href="#"
          @click.prevent="dangXuat"
        >
          Đăng xuất
        </a>
      </template>

      <!-- Chưa đăng nhập -->
      <template v-else>
        <RouterLink to="/dangnhap">
          Đăng nhập
        </RouterLink>

        <RouterLink to="/dangky">
          Đăng ký
        </RouterLink>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { giohang } from "../stores/giohang";
import { useTimKiemStore } from "../stores/timkiem";

const router = useRouter();
const timKiemStore = useTimKiemStore();

const user = computed(() => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
});

const soLuong = computed(() => {
  return giohang.reduce(
    (tong, sp) => tong + (sp.soluong || 1),
    0
  );
});

function dangXuat() {
  localStorage.removeItem("user");
  router.push("/dangnhap");
}
</script>

<style scoped>
.navbar {
  background: #000;
  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;

  padding: 20px 50px;
}

.logo {
  color: white;
  text-decoration: none;
  font-size: 34px;
  font-weight: bold;
  white-space: nowrap;
}

.search {
  flex: 1;
  display: flex;
  justify-content: center;
}

.search input {
  width: 100%;
  max-width: 500px;

  padding: 14px 22px;

  border: none;
  border-radius: 30px;
  outline: none;

  font-size: 16px;
}

.menu {
  display: flex;
  align-items: center;
  gap: 30px;
}

.menu a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  transition: 0.3s;
  cursor: pointer;
}

.menu a:hover {
  color: #9ca3af;
}

.cart {
  position: relative;
}

.badge {
  position: absolute;
  top: -10px;
  right: -16px;

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

/* Tablet */
@media (max-width: 1200px) {
  .navbar {
    flex-direction: column;
  }

  .search {
    width: 100%;
  }

  .menu {
    justify-content: center;
    flex-wrap: wrap;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .logo {
    font-size: 28px;
  }

  .menu {
    gap: 18px;
  }

  .menu a {
    font-size: 16px;
  }

  .search input {
    max-width: 100%;
  }
}
</style>