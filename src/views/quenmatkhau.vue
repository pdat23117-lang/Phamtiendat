<template>
  <div class="container">
    <div class="card">
      <h2>Quên mật khẩu</h2>

      <form @submit.prevent="guiEmail">

        <input
          v-model="email"
          type="email"
          placeholder="Nhập email"
          required
        />

        <button :disabled="loading">
          {{ loading ? "Đang gửi..." : "Gửi yêu cầu" }}
        </button>

      </form>

      <p
        v-if="message"
        class="success"
      >
        {{ message }}
      </p>

      <p
        v-if="error"
        class="error"
      >
        {{ error }}
      </p>

      <RouterLink to="/dangnhap">
        Quay lại đăng nhập
      </RouterLink>

    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const email = ref("");

const loading = ref(false);

const message = ref("");

const error = ref("");

const guiEmail = async () => {

  loading.value = true;

  message.value = "";

  error.value = "";

  try {

    const res = await axios.post(
      "http://localhost:5000/api/auth/forgot-password",
      {
        email: email.value,
      }
    );

    message.value = res.data.message;

  } catch (err) {

    error.value =
      err.response?.data?.message ||
      "Có lỗi xảy ra";

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
  width:420px;
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
  border:1px solid #ddd;
  border-radius:10px;
  margin-bottom:20px;
}

button{
  width:100%;
  padding:14px;
  background:black;
  color:white;
  border:none;
  border-radius:10px;
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

a{
  display:block;
  text-align:center;
  margin-top:20px;
}

</style>