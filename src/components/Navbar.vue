<template>
  <header class="navbar">

    <RouterLink
      to="/"
      class="logo"
    >
      DAT MOBILE
    </RouterLink>

    <nav>

      <RouterLink to="/">
        Trang chủ
      </RouterLink>

      <RouterLink to="/sanpham">
        Sản phẩm
      </RouterLink>

      <RouterLink to="/giohang">
        Giỏ hàng
      </RouterLink>

      <RouterLink to="/LichSuDonHang">
        Đơn hàng
      </RouterLink>

      <RouterLink to="/lienhe">
        Liên hệ
      </RouterLink>

    </nav>

    <div class="right">

      <input
        v-model="keyword"
        placeholder="Tìm sản phẩm..."
      />

      <button
        @click="search"
      >
        🔍
      </button>

      <RouterLink
        v-if="!auth.user"
        to="/dangnhap"
      >
        Đăng nhập
      </RouterLink>

      <div
        v-else
        class="user"
      >

        <span>

          {{ auth.user.name }}

        </span>

        <RouterLink
          to="/hosocanhan"
        >
          Hồ sơ
        </RouterLink>

        <RouterLink
          v-if="auth.user.role==='admin'"
          to="/admin"
        >
          Admin
        </RouterLink>

        <button
          @click="logout"
        >
          Đăng xuất
        </button>

      </div>

    </div>

  </header>
</template>

<script setup>
import {
ref,
} from "vue";

import {
useRouter,
} from "vue-router";

import {
useTimKiemStore,
} from "../stores/timkiem";

const router=
useRouter();

const store=
useTimKiemStore();

const keyword=
ref(store.tuKhoa);

import { useAuthStore } from "../stores/auth";
import axios from "axios";
const auth = useAuthStore();

const search=()=>{

store.tuKhoa=
keyword.value;

router.push(
"/sanpham"
);

};

const logout = () => {

  auth.logout();

  delete axios.defaults.headers.common.Authorization;

  router.push("/");

};
</script>

<style scoped>

.navbar{

height:70px;

background:#111827;

display:flex;

justify-content:space-between;

align-items:center;

padding:0 40px;

}

.logo{

font-size:28px;

font-weight:bold;

color:white;

text-decoration:none;

}

nav{

display:flex;

gap:30px;

}

nav a{

color:white;

text-decoration:none;

}

.right{

display:flex;

align-items:center;

gap:10px;

}

input{

padding:10px;

border-radius:8px;

border:none;

width:220px;

}

button{

padding:10px 15px;

border:none;

border-radius:8px;

cursor:pointer;

}

.user{

display:flex;

gap:15px;

align-items:center;

color:white;

}

.user a{

color:white;

text-decoration:none;

}

@media(max-width:900px){

.navbar{

flex-direction:column;

height:auto;

padding:20px;

gap:20px;

}

nav{

flex-wrap:wrap;

justify-content:center;

}

}

</style>