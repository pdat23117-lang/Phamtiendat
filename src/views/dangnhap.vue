<template>
  <div class="container">
    <div class="box">
      <h1>Đăng nhập</h1>

      <form @submit.prevent="dangNhap">
        <input
          v-model="email"
          type="email"
          placeholder="Nhập email"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Nhập mật khẩu"
        />

        <button
          :disabled="loading"
        >
          {{
            loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"
          }}
        </button>
      </form>

      <p
        v-if="error"
        class="error"
      >
        {{ error }}
      </p>

      <RouterLink
        to="/quenmatkhau"
        class="forgot"
      >
        Quên mật khẩu?
      </RouterLink>

      <p class="register">
        Chưa có tài khoản?

        <RouterLink
          to="/dangky"
        >
          Đăng ký ngay
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const dangNhap = async () => {
  error.value = "";

  if (!email.value) {
    error.value =
      "Vui lòng nhập email";
    return;
  }

  if (!password.value) {
    error.value =
      "Vui lòng nhập mật khẩu";
    return;
  }

  try {
    loading.value = true;

    const res =
      await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email:
            email.value,
          password:
            password.value,
        }
      );

    localStorage.setItem(
      "user",
      JSON.stringify(
        res.data
      )
    );

    alert(
      "Đăng nhập thành công"
    );

    router.push("/");
  } catch (err) {
    error.value =
      err.response?.data
        ?.message ||
      "Đăng nhập thất bại";
  } finally {
    loading.value = false;
  }
};
if (localStorage.getItem("user")) {
  router.push("/");
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;

  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  width: 450px;
  background: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow:
    0 5px 20px
      rgba(
        0,
        0,
        0,
        0.1
      );
}

h1 {
  text-align: center;
  margin-bottom: 35px;
}

input {
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;

  border: 1px solid #ddd;
  border-radius: 12px;

  font-size: 16px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 15px;

  border: none;
  border-radius: 12px;

  background: black;
  color: white;

  font-size: 17px;
  cursor: pointer;
}

button:disabled {
  background: gray;
}

.error {
  margin-top: 20px;
  color: red;
  text-align: center;
}

.forgot {
  display: block;
  text-align: right;
  margin-top: 20px;

  text-decoration: none;
  color: #2563eb;
}

.register {
  margin-top: 35px;
  text-align: center;
}

.register a {
  color: #2563eb;
  text-decoration: none;
}
</style>