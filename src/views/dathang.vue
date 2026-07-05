<template>
  <div class="container">
    <h1>Đặt hàng</h1>

    <form @submit.prevent="datHang">

      <input
        type="text"
        placeholder="Họ và tên"
        v-model="ten"
        required
      >

      <input
        type="text"
        placeholder="Số điện thoại"
        v-model="sdt"
        required
      >

      <input
        type="email"
        placeholder="Email"
        v-model="email"
        required
      >

      <textarea
        placeholder="Địa chỉ giao hàng"
        v-model="diaChi"
        required
      ></textarea>

      <button type="submit">
        Xác nhận đặt hàng
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { giohang } from "../stores/giohang";

const router = useRouter();

const ten = ref("");
const sdt = ref("");
const email = ref("");
const diaChi = ref("");

function datHang() {
  alert("Đặt hàng thành công!");

  giohang.splice(0);
  localStorage.removeItem("giohang");

  router.push("/");
}
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: auto;
  padding: 60px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

input,
textarea {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
}

textarea {
  height: 120px;
  resize: none;
}

button {
  background: black;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>