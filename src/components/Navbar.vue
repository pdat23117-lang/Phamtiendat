<template>
  <nav class="navbar">
    <h2 class="logo">DAT MOBILE</h2>

    <ul>
      <li>
        <RouterLink to="/">Trang chủ</RouterLink>
      </li>

      <li>
        <RouterLink to="/">Sản phẩm</RouterLink>
      </li>

      <li>
        <RouterLink to="/contact">Liên hệ</RouterLink>
      </li>
    </ul>
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

ul {
  display: flex;
  list-style: none;
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