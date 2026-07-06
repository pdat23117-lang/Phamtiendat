<template>
  <div class="container">
    <h1>Đăng ký</h1>

    <form @submit.prevent="dangKy">
      <input
        v-model="name"
        type="text"
        placeholder="Họ và tên"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Mật khẩu"
      />

      <button>
        Đăng ký
      </button>
    </form>
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

const dangKy = async () => {
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
      "user",
      JSON.stringify(res.data)
    );

    alert("Đăng ký thành công");

    router.push("/");
  } catch (error) {
    alert(error.response.data.message);
  }
};
</script>