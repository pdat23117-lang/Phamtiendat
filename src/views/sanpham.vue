<template>
  <div class="container">
    <h1>Sản phẩm</h1>

    <div class="toolbar">
      <input
        type="text"
        placeholder="🔍 Tìm điện thoại..."
        v-model="tuKhoa"
      />

      <select v-model="hang">
        <option value="">Tất cả hãng</option>
        <option value="Apple">Apple</option>
        <option value="Samsung">Samsung</option>
        <option value="Xiaomi">Xiaomi</option>
      </select>
        <select v-model="gia">
    <option value="">Tất cả giá</option>
    <option value="duoi20">Dưới 20 triệu</option>
    <option value="20-30">Từ 20 - 30 triệu</option>
    <option value="tren30">Trên 30 triệu</option>
  </select>
    </div>

    <div class="products">
      <ProductCard
        v-for="sp in dsSanPham"
        :key="sp.id"
        :product="sp"
      />
    </div>

    <h2 v-if="dsSanPham.length === 0">
      Không tìm thấy sản phẩm nào.
    </h2>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ProductCard from "../components/ProductCard.vue";
import sanpham from "../data/sanpham";

const tuKhoa = ref("");
const hang = ref("");
const gia = ref("");

const dsSanPham = computed(() => {
  return sanpham.filter((sp) => {

    const dkTen =
      sp.ten
        .toLowerCase()
        .includes(
          tuKhoa.value.toLowerCase()
        );

    const dkHang =
      hang.value === "" ||
      sp.hang === hang.value;

    let dkGia = true;

    if (gia.value === "duoi20") {
      dkGia = sp.gia < 20000000;
    }

    if (gia.value === "20-30") {
      dkGia =
        sp.gia >= 20000000 &&
        sp.gia <= 30000000;
    }

    if (gia.value === "tren30") {
      dkGia =
        sp.gia > 30000000;
    }

    return (
      dkTen &&
      dkHang &&
      dkGia
    );
  });
});
</script>

<style scoped>
.container {
  padding: 60px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 40px;
}

.toolbar {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

input,
select {
  padding: 15px 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
}

input {
  width: 350px;
}

.products {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

h2 {
  text-align: center;
  margin-top: 50px;
  color: #666;
}
</style>