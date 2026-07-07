<template>
  <div class="register">
    <div class="card">
      <h2>Đăng ký tài khoản</h2>

      <form @submit.prevent="dangKy">

        <input
          v-model="name"
          type="text"
          placeholder="Họ và tên"
          required
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Mật khẩu"
          required
        />

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Nhập lại mật khẩu"
          required
        />

        <button :disabled="loading">
          {{ loading ? "Đang đăng ký..." : "Đăng ký" }}
        </button>

      </form>

      <p
        class="error"
        v-if="error"
      >
        {{ error }}
      </p>

      <RouterLink to="/dangnhap">
        Đã có tài khoản? Đăng nhập
      </RouterLink>

    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const error = ref("");

const dangKy = async () => {

  error.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Mật khẩu không khớp";
    return;
  }

  loading.value = true;

  try {

    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: name.value,
        email: email.value,
        password: password.value,
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    router.push("/");

  } catch (err) {

    error.value =
      err.response?.data?.message ||
      "Đăng ký thất bại";

  }

  loading.value = false;
};
</script>

<style scoped>

.register{
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
  background:black;
  color:white;
  border:none;
  border-radius:10px;
  cursor:pointer;
}

button:hover{
  background:#333;
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