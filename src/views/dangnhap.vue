<template>
  <div class="login">
    <div class="card">
      <h2>Đăng nhập</h2>

      <form @submit.prevent="dangNhap">
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

        <button :disabled="loading">
          {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
        </button>
      </form>

      <p class="error" v-if="error">
        {{ error }}
      </p>

      <RouterLink to="/quenmatkhau">
        Quên mật khẩu?
      </RouterLink>

      <RouterLink to="/dangky">
        Chưa có tài khoản? Đăng ký
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
const router = useRouter();
const auth = useAuthStore();
const email = ref("");
const password = ref("");

const loading = ref(false);
const error = ref("");

const dangNhap = async () => {

  loading.value = true;
  error.value = "";

  try {

    const res = await axios.post(
"/auth/login",
  {
    email: email.value,
    password: password.value,
  }
);

auth.login(res.data);

axios.defaults.headers.common.Authorization =
  `Bearer ${res.data.token}`;

if (res.data.role === "admin") {

  router.push("/admin");

} else {

  router.push("/");

}

  } catch (err) {

    error.value =
      err.response?.data?.message ||
      "Đăng nhập thất bại";

  }

  loading.value = false;

};
</script>

<style scoped>
.login {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 420px;
  padding: 35px;
  border-radius: 15px;
  box-shadow: 0 5px 15px #ddd;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 14px;
  background: black;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background: #333;
}

.error {
  color: red;
  margin: 15px 0;
}

a {
  display: block;
  margin-top: 12px;
  text-align: center;
}
</style>