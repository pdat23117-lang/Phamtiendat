<template>
  <div>

    <Hero />

    <section class="noibat">

      <h1>
        Sản phẩm nổi bật
      </h1>

      <div class="products">
        <ProductCard
          v-for="sp in sanPhamNoiBat"
          :key="sp.id"
          :product="sp"
        />
      </div>

    </section>

  </div>
</template>

<script setup>
import Hero from "../components/Hero.vue";
import ProductCard from "../components/ProductCard.vue";
import sanpham from "../data/sanpham";

const sanPhamNoiBat =
  sanpham.filter(
    (sp) => sp.noibat
  );
</script>

<style scoped>
h1 {
  text-align: center;
  margin: 60px 0;
}

.products {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  padding: 50px;
}
.noibat {
  padding: 80px;
}

.noibat h1 {
  text-align: center;
  margin-bottom: 50px;
  font-size: 40px;
}

.products {
  display: grid;
  grid-template-columns:
    repeat(auto-fit,
      minmax(280px, 1fr));

  gap: 40px;
}
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}
.card {
  transition: .3s;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow:
    0 20px 40px
    rgba(0,0,0,.2);
}

.card img {
  transition: .3s;
}

.card:hover img {
  transform: scale(1.08);
}
</style>