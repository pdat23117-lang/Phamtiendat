<template>
  <section class="hero">

    <div class="left">
      <h1>{{ slides[index].ten }}</h1>

      <h2>
        {{ slides[index].mota }}
      </h2>

      <RouterLink to="/sanpham">
        <button>Mua ngay</button>
      </RouterLink>
    </div>

    <div class="right">
      <img :src="slides[index].hinh">
    </div>

    <div class="dots">
      <span
        v-for="(item, i) in slides"
        :key="i"
        :class="{ active: i === index }"
        @click="index = i"
      >
      </span>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const index = ref(0);

const slides = [
  {
    ten: "iPhone 16 Pro Max",
    mota: "Giá từ 29.990.000 đ",
    hinh: "/images/16promax.jpg",
  },
  {
    ten: "Samsung S25 Ultra",
    mota: "Camera 200MP cực đỉnh",
    hinh: "/images/ss25.jpg",
  },
  {
    ten: "Xiaomi 15",
    mota: "Hiệu năng mạnh mẽ",
    hinh: "/images/xiaomi15.jpg",
  },
];

onMounted(() => {
  setInterval(() => {
    index.value++;

    if (
      index.value >=
      slides.length
    ) {
      index.value = 0;
    }
  }, 3000);
});
</script>

<style scoped>
.hero {
  min-height: 600px;
  background: black;
  color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 80px;

  position: relative;
}

.left {
  width: 50%;
}

.left h1 {
  font-size: 60px;
  margin-bottom: 20px;
}

.left h2 {
  color: #cfcfcf;
  margin-bottom: 40px;
}

button {
  background: white;
  color: black;
  border: none;

  padding: 18px 40px;
  border-radius: 12px;

  font-size: 18px;
  cursor: pointer;
}

.right img {
  width: 450px;
}

.dots {
  position: absolute;
  bottom: 40px;
  left: 50%;

  transform: translateX(-50%);

  display: flex;
  gap: 15px;
}

.dots span {
  width: 14px;
  height: 14px;

  border-radius: 50%;
  background: gray;

  cursor: pointer;
}

.active {
  background: white !important;
}
</style>