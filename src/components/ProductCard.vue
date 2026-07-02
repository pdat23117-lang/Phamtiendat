<template>
  <div class="card">
    <img
      :src="product.image"
      :alt="product.name"
    />

    <h2>{{ product.name }}</h2>

    <p>{{ product.price }}</p>

    <RouterLink
      :to="'/product/' + product.id"
    >
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
  background: white;
  border-radius: 25px;
  padding: 30px;
  text-align: center;
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-10px);
}

img {
  width: 250px;
  height: 250px;
  object-fit: contain;
}

h2 {
  margin-top: 20px;
}

p {
  margin: 20px 0;
  font-size: 22px;
  font-weight: bold;
}

button {
  background: black;
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 30px;
  cursor: pointer;
}
</style>