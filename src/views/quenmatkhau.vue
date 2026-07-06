<template>
  <div class="container">
    <div class="box">
      <h1>Quên mật khẩu</h1>

      <p class="mota">
        Nhập email đã đăng ký.
        Hệ thống sẽ gửi link đặt lại mật khẩu.
      </p>

      <input
        type="email"
        v-model="email"
        placeholder="Nhập email"
      />

      <button
        @click="guiEmail"
        :disabled="loading"
      >
        {{
          loading
            ? "Đang gửi..."
            : "Gửi yêu cầu"
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

      <RouterLink
        to="/dangnhap"
        class="back"
      >
        ← Quay lại đăng nhập
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const loading = ref(false);
const message = ref("");
const error = ref("");

async function guiEmail() {
  message.value = "";
  error.value = "";

  if (!email.value) {
    error.value =
      "Vui lòng nhập email";
    return;
  }

  try {
    loading.value = true;

    const res =
      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email: email.value,
        }
      );

    message.value =
      res.data.message;
    email.value = "";
  } catch (err) {
    error.value =
      err.response?.data
        ?.message ||
      "Có lỗi xảy ra";
  } finally {
    loading.value = false;
  }
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
      rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.mota {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  box-sizing: border-box;
}

button {
  width: 100%;
  margin-top: 25px;
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

.back {
  display: block;
  text-align: center;
  margin-top: 30px;
  text-decoration: none;
  color: black;
}
</style>