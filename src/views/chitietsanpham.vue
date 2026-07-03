<template>
  <div class="container">

    <div v-if="sp">

      <img :src="sp.hinh">

      <h1>{{ sp.ten }}</h1>

      <h2>
        {{ sp.gia.toLocaleString() }} đ
      </h2>

      <p>
        {{ sp.mota }}
      </p>

      <button>Mua ngay</button>

    </div>

  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import sanpham from "../data/sanpham";

const route = useRoute();

const sp = sanpham.find(
  (item) => item.id == route.params.id
);
</script>

<style scoped>
.container {
  padding: 80px;
  text-align: center;
}

img {
  width: 350px;
}

h1 {
  margin-top: 30px;
}

h2 {
  margin: 20px 0;
}

p {
  max-width: 700px;
  margin: auto;
  color: #666;
}

button {
  margin-top: 30px;
  background: black;
  color: white;
  border: none;
  padding: 15px 35px;
  border-radius: 30px;
  cursor: pointer;
}
</style>