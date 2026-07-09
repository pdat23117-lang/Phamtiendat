<template>
  <div class="container">

    <div class="card">

      <h2>Hồ sơ cá nhân</h2>

      <form @submit.prevent="capNhat">

        <input
          v-model="user.name"
          placeholder="Họ và tên"
        />

        <input
          v-model="user.email"
          disabled
        />

        <button :disabled="loading">
          {{ loading ? "Đang lưu..." : "Cập nhật" }}
        </button>

      </form>

      <RouterLink
        class="link"
        to="/doimatkhau"
      >
        Đổi mật khẩu
      </RouterLink>

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
import {
  ref,
  onMounted,
} from "vue";
import { useAuthStore } from "../stores/auth";
const loading = ref(false);

const success = ref("");

const error = ref("");

const user = ref({
  name: "",
  email: "",
});
const auth = useAuthStore();


const loadProfile = async () => {
  try {

    const res = await axios.get(
  "/auth/profile"
);

    user.value = res.data;

  } catch (err) {

    error.value =
      "Không tải được thông tin";

  }
};

const capNhat = async () => {

  loading.value = true;

  success.value = "";

  error.value = "";

  try {

   const res =
  await axios.put(
    "/auth/profile",
    {
      name: user.value.name,
    }
  );

    auth.user = {
  ...auth.user,
  ...res.data,
};

    success.value =
      "Cập nhật thành công";

  } catch (err) {

    error.value =
      err.response?.data?.message ||
      "Cập nhật thất bại";

  }

  loading.value = false;
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>

.container{
  display:flex;
  justify-content:center;
  padding:60px;
}

.card{
  width:500px;
  background:white;
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
  border-radius:10px;
  border:1px solid #ddd;
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

.link{
  display:block;
  text-align:center;
  margin-top:20px;
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