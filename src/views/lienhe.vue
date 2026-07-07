<template>
  <div class="container">

    <div class="card">

      <h1>Liên hệ</h1>

      <form @submit.prevent="guiLienHe">

        <input
          v-model="form.hoTen"
          placeholder="Họ và tên"
          required
        />

        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          v-model="form.soDienThoai"
          placeholder="Số điện thoại"
        />

        <input
          v-model="form.tieuDe"
          placeholder="Tiêu đề"
          required
        />

        <textarea
          v-model="form.noiDung"
          placeholder="Nội dung liên hệ"
          required
        ></textarea>

        <button
          :disabled="loading"
        >
          {{
            loading
              ? "Đang gửi..."
              : "Gửi liên hệ"
          }}
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

const loading = ref(false);

const success = ref("");

const error = ref("");

const form = ref({
  hoTen: "",
  email: "",
  soDienThoai: "",
  tieuDe: "",
  noiDung: "",
});

const guiLienHe = async () => {

  loading.value = true;

  success.value = "";

  error.value = "";

  try {

    const res =
      await axios.post(
        "http://localhost:5000/api/lienhe",
        form.value
      );

    success.value =
      res.data.message;

    form.value = {
      hoTen: "",
      email: "",
      soDienThoai: "",
      tieuDe: "",
      noiDung: "",
    };

  } catch (err) {

    error.value =
      err.response?.data?.message ||
      "Không gửi được liên hệ";

  }

  loading.value = false;

};
</script>

<style scoped>

.container{
  display:flex;
  justify-content:center;
  padding:60px;
}

.card{
  width:700px;
  background:white;
  padding:35px;
  border-radius:15px;
  box-shadow:0 5px 20px rgba(0,0,0,.1);
}

h1{
  text-align:center;
  margin-bottom:30px;
}

input,
textarea{
  width:100%;
  padding:15px;
  margin-bottom:18px;
  border:1px solid #ddd;
  border-radius:10px;
  font-size:15px;
}

textarea{
  height:180px;
  resize:none;
}

button{
  width:100%;
  padding:15px;
  border:none;
  border-radius:10px;
  background:black;
  color:white;
  cursor:pointer;
  font-size:16px;
}

button:hover{
  background:#222;
}

.success{
  color:green;
  margin-top:18px;
  text-align:center;
}

.error{
  color:red;
  margin-top:18px;
  text-align:center;
}

</style>