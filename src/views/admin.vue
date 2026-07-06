<template>
  <div class="container">
    <h1>Quản trị DAT MOBILE</h1>

    <div class="menu">
      <RouterLink to="/admin/sanpham">
        Quản lý sản phẩm
      </RouterLink>

      <RouterLink to="/admin/donhang">
        Quản lý đơn hàng
      </RouterLink>

      <RouterLink to="/admin/user">
        Quản lý người dùng
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 80px;
}

h1 {
  text-align: center;
  margin-bottom: 60px;
}

.menu {
  display: flex;
  justify-content: center;
  gap: 30px;
}

a {
  background: black;
  color: white;
  padding: 20px 30px;
  border-radius: 15px;
  text-decoration: none;
}
</style>