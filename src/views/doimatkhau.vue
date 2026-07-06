<template>
  <div class="container">
    <h1>Đổi mật khẩu</h1>

    <form
      @submit.prevent="
        doiMatKhau
      "
    >
      <input
        v-model="
          currentPassword
        "
        type="password"
        placeholder="Mật khẩu hiện tại"
      />

      <input
        v-model="
          newPassword
        "
        type="password"
        placeholder="Mật khẩu mới"
      />

      <button>
        Đổi mật khẩu
      </button>
    </form>
  </div>
</template>