<template>
  <div class="card">
    <div
      v-if="product.noibat"
      class="badge"
    >
      HOT
    </div>

    <img
      :src="product.hinh"
      :alt="product.ten"
    />

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
  position: relative;
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

.badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: red;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
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