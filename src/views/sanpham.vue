<template>
  <div class="container">
    <h1>Sản phẩm</h1>

    <div class="toolbar">
      <select v-model="hang">
        <option value="">
          Tất cả hãng
        </option>

        <option value="Apple">
          Apple
        </option>

        <option value="Samsung">
          Samsung
        </option>

        <option value="Xiaomi">
          Xiaomi
        </option>
      </select>

      <select v-model="gia">
        <option value="">
          Tất cả giá
        </option>

        <option value="duoi20">
          Dưới 20 triệu
        </option>

        <option value="20-30">
          Từ 20 - 30 triệu
        </option>

        <option value="tren30">
          Trên 30 triệu
        </option>
      </select>

      <select v-model="sapXep">
        <option value="">
          Sắp xếp
        </option>

        <option value="tang">
          Giá tăng dần
        </option>

        <option value="giam">
          Giá giảm dần
        </option>
      </select>
    </div>

    <div class="products">
      <ProductCard
        v-for="sp in dsPhanTrang"
        :key="sp.id"
        :product="sp"
      />
    </div>

    <div
      v-if="tongSoTrang > 1"
      class="pagination"
    >
      <button
        @click="
          trangHienTai =
            Math.max(
              1,
              trangHienTai - 1
            )
        "
        :disabled="
          trangHienTai === 1
        "
      >
        ← Trước
      </button>

      <button
        v-for="n in tongSoTrang"
        :key="n"
        @click="
          trangHienTai = n
        "
        :class="{
          active:
            trangHienTai === n,
        }"
      >
        {{ n }}
      </button>

      <button
        @click="
          trangHienTai =
            Math.min(
              tongSoTrang,
              trangHienTai + 1
            )
        "
        :disabled="
          trangHienTai ===
          tongSoTrang
        "
      >
        Sau →
      </button>
    </div>

    <h2 v-if="dsSanPham.length === 0">
      Không tìm thấy sản phẩm nào.
    </h2>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
} from "vue";

import ProductCard from "../components/ProductCard.vue";
import sanpham from "../data/sanpham";

import {
  useTimKiemStore,
} from "../stores/timkiem";

const timKiemStore =
  useTimKiemStore();

const hang = ref("");
const gia = ref("");
const sapXep = ref("");

const trangHienTai = ref(1);
const soSanPhamMoiTrang = 6;

const dsSanPham = computed(() => {
  let ds = sanpham.filter(
    (sp) => {
      const dkTen =
        sp.ten
          .toLowerCase()
          .includes(
            timKiemStore.tuKhoa
              .toLowerCase()
          );

      const dkHang =
        hang.value === "" ||
        sp.hang ===
          hang.value;

      let dkGia = true;

      if (
        gia.value ===
        "duoi20"
      ) {
        dkGia =
          sp.gia <
          20000000;
      }

      if (
        gia.value ===
        "20-30"
      ) {
        dkGia =
          sp.gia >=
            20000000 &&
          sp.gia <=
            30000000;
      }

      if (
        gia.value ===
        "tren30"
      ) {
        dkGia =
          sp.gia >
          30000000;
      }

      return (
        dkTen &&
        dkHang &&
        dkGia
      );
    }
  );

  if (
    sapXep.value ===
    "tang"
  ) {
    ds.sort(
      (a, b) =>
        a.gia - b.gia
    );
  }

  if (
    sapXep.value ===
    "giam"
  ) {
    ds.sort(
      (a, b) =>
        b.gia - a.gia
    );
  }

  return ds;
});

const tongSoTrang =
  computed(() => {
    return Math.ceil(
      dsSanPham.value.length /
        soSanPhamMoiTrang
    );
  });

const dsPhanTrang =
  computed(() => {
    const batDau =
      (trangHienTai.value - 1) *
      soSanPhamMoiTrang;

    const ketThuc =
      batDau +
      soSanPhamMoiTrang;

    return dsSanPham.value.slice(
      batDau,
      ketThuc
    );
  });

watch(
  [
    hang,
    gia,
    sapXep,
    () =>
      timKiemStore.tuKhoa,
  ],
  () => {
    trangHienTai.value = 1;
  }
);
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

select {
  padding: 15px 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
}

.products {
  display: grid;
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(280px, 1fr)
    );

  gap: 30px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 60px;
}

.pagination button {
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  background: #f3f4f6;
  transition: 0.3s;
}

.pagination button:hover {
  background: #e5e7eb;
}

.active {
  background: black !important;
  color: white;
}

h2 {
  text-align: center;
  margin-top: 50px;
  color: #666;
}
</style>