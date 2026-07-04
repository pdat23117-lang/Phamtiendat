<template>
  <nav class="navbar">
    <h2 class="logo">DAT MOBILE</h2>

    <div class="menu">
      <RouterLink to="/">Trang chủ</RouterLink>
      <RouterLink to="/sanpham">Sản phẩm</RouterLink>
      <RouterLink to="/lienhe">Liên hệ</RouterLink>
      <RouterLink to="/giohang">Giỏ hàng</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: black;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 80px;
}

.logo {
  font-size: 30px;
  font-weight: bold;
}

.menu {
  display: flex;
  gap: 40px;
}

a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

a:hover {
  color: #9ca3af;
}
</style>