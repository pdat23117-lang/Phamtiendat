<template>
  <div>
    <h1>Trang chủ DAT MOBILE</h1>

    <div class="products">
      <ProductCard
        v-for="sp in sanpham"
        :key="sp.id"
        :product="sp"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from "../components/ProductCard.vue";
import sanpham from "../data/sanpham";
</script>
<style scoped>
.products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
}
</style>