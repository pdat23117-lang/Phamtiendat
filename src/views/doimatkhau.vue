<template>
  <div class="container">
    <div class="card">

      <h2>Đổi mật khẩu</h2>

      <form @submit.prevent="doiMatKhau">

        <input
          v-model="oldPassword"
          type="password"
          placeholder="Mật khẩu hiện tại"
          required
        />

        <input
          v-model="newPassword"
          type="password"
          placeholder="Mật khẩu mới"
          required
        />

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          required
        />

        <button :disabled="loading">
          {{ loading ? "Đang cập nhật..." : "Đổi mật khẩu" }}
        </button>

      </form>

      <p
        class="success"
        v-if="success"
      >
        {{ success }}
      </p>

      <p
        class="error"
        v-if="error"
      >
        {{ error }}
      </p>

    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const success = ref("");
const error = ref("");

const doiMatKhau = async () => {

  success.value = "";
  error.value = "";

  if (
    newPassword.value !==
    confirmPassword.value
  ) {
    error.value =
      "Mật khẩu nhập lại không khớp";
    return;
  }

  loading.value = true;

  try {

    

    const res =
      await axios.put(
  "/auth/change-password",
  data
);

    success.value =
      res.data.message;

    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";

  } catch (err) {

    error.value =
      err.response?.data?.message ||
      "Đổi mật khẩu thất bại";

  }

  loading.value = false;
};
</script>

<style scoped>

.container{
  min-height:80vh;
  display:flex;
  justify-content:center;
  align-items:center;
}

.card{
  width:430px;
  padding:35px;
  border-radius:15px;
  box-shadow:0 5px 20px #ddd;
}

h2{
  text-align:center;
  margin-bottom:25px;
}

input{
  width:100%;
  padding:14px;
  margin-bottom:15px;
  border:1px solid #ddd;
  border-radius:10px;
}

button{
  width:100%;
  padding:14px;
  border:none;
  border-radius:10px;
  background:black;
  color:white;
  cursor:pointer;
}

button:hover{
  background:#333;
}

.success{
  color:green;
  margin-top:15px;
}

.error{
  color:red;
  margin-top:15px;
}

</style>