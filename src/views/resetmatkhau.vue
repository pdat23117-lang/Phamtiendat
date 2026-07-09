<template>
  <div class="container">
    <div class="card">
      <h2>Đặt lại mật khẩu</h2>

      <form @submit.prevent="resetPassword">

        <input
          v-model="password"
          type="password"
          placeholder="Mật khẩu mới"
          required
        />

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Nhập lại mật khẩu"
          required
        />

        <button :disabled="loading">
          {{ loading ? "Đang cập nhật..." : "Đổi mật khẩu" }}
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
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");

const loading = ref(false);

const message = ref("");

const error = ref("");

const resetPassword = async () => {

  if (password.value !== confirmPassword.value) {
    error.value = "Mật khẩu không khớp";
    return;
  }

  loading.value = true;
  error.value = "";
  message.value = "";

  try {

    const res = await axios.post(
      `/auth/reset-password/${token}`,
      {
        password: password.value,
      }
    );

    message.value = res.data.message;

    setTimeout(() => {
      router.push("/dangnhap");
    }, 2000);

  } catch (err) {

    error.value =
      err.response?.data?.message ||
      "Đặt lại mật khẩu thất bại";

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

a{
  display:block;
  text-align:center;
  margin-top:20px;
}

</style>