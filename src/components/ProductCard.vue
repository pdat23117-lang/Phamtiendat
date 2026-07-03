<template>
  <div class="card">
    <img :src="product.hinh">

    <h3>{{ product.ten }}</h3>

    <p>
      {{ product.gia.toLocaleString() }} đ
    </p>

    <RouterLink :to="'/sanpham/' + product.id">
      <button>Xem chi tiết</button>
    </RouterLink>
  </div>
</template>

<script setup>
defineProps({
  product: Object,
});
</script>
<style scoped>
.card {
  background: #111;
  color: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card img {
  width: 100%;
  height: 220px;
  object-fit: contain;
}

button {
  background: white;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 15px;
}
</style>