<template>
  <div class="container">
    <div class="box">
      <h1>Đặt lại mật khẩu</h1>

      <input
        v-model="password"
        type="password"
        placeholder="Mật khẩu mới"
      />

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Nhập lại mật khẩu"
      />

      <button
        @click="doiMatKhau"
        :disabled="loading"
      >
        {{
          loading
            ? "Đang xử lý..."
            : "Đổi mật khẩu"
        }}
      </button>

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
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import {
  useRoute,
  useRouter,
} from "vue-router";

const route = useRoute();
const router = useRouter();

const password = ref("");
const confirmPassword =
  ref("");

const loading = ref(false);
const message = ref("");
const error = ref("");

const token =
  route.params.token;

const doiMatKhau =
  async () => {
    error.value = "";
    message.value = "";

    if (
      !password.value ||
      !confirmPassword.value
    ) {
      error.value =
        "Vui lòng nhập đầy đủ thông tin";
      return;
    }

    if (
      password.value !==
      confirmPassword.value
    ) {
      error.value =
        "Mật khẩu nhập lại không khớp";
      return;
    }

    if (
      password.value.length < 6
    ) {
      error.value =
        "Mật khẩu tối thiểu 6 ký tự";
      return;
    }

    try {
      loading.value = true;

      const res =
        await axios.put(
          `http://localhost:5000/api/auth/reset-password/${token}`,
          {
            password:
              password.value,
          }
        );

      message.value =
        res.data.message;

      setTimeout(() => {
        router.push(
          "/dangnhap"
        );
      }, 2000);
    } catch (err) {
      error.value =
        err.response?.data
          ?.message ||
        "Có lỗi xảy ra";
    } finally {
      loading.value = false;
    }
  };
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
      rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
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

.success {
  margin-top: 20px;
  color: green;
  text-align: center;
}

.error {
  margin-top: 20px;
  color: red;
  text-align: center;
}
</style>