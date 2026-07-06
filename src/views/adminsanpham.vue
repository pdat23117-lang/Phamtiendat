<template>
  <div class="container">
    <h1>Quản lý sản phẩm</h1>

    <table>
      <tr>
        <th>ID</th>
        <th>Ảnh</th>
        <th>Tên</th>
        <th>Giá</th>
        <th>Hãng</th>
      </tr>

      <tr
        v-for="sp in sanpham"
        :key="sp.id"
      >
        <td>{{ sp.id }}</td>

        <td>
          <img :src="sp.hinh" />
        </td>

        <td>{{ sp.ten }}</td>

        <td>
          {{ sp.gia.toLocaleString() }} đ
        </td>

        <td>{{ sp.hang }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import sanpham
  from "../data/sanpham";
</script>

<style scoped>
.container {
  padding: 60px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
}

img {
  width: 70px;
}
</style>