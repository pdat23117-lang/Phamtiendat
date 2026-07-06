<template>
  <div class="container">
    <h1>Hồ sơ cá nhân</h1>

    <div class="card">
      <p>
        <b>Họ tên:</b>
        {{ user.name }}
      </p>

      <p>
        <b>Email:</b>
        {{ user.email }}
      </p>

      <p>
        <b>Vai trò:</b>
        {{ user.role }}
      </p>

      <RouterLink
        to="/doimatkhau"
      >
        <button>
          Đổi mật khẩu
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
const user = JSON.parse(
  localStorage.getItem("user")
);
</script>

<style scoped>
.container {
  padding: 50px;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.1);
}

button {
  margin-top: 20px;
  background: black;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  cursor: pointer;
}
</style>