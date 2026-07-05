<template>
  <div class="container">
    <h1>Giỏ hàng</h1>

    <div v-if="giohang.length === 0">
      <h2>Chưa có sản phẩm nào trong giỏ hàng</h2>
    </div>

    <div v-else>
      <div
        class="item"
        v-for="(sp, index) in giohang"
        :key="sp.id"
      >
        <img :src="sp.hinh" />

        <div class="info">
          <h3>{{ sp.ten }}</h3>

          <p>
            Giá:
            {{ sp.gia.toLocaleString() }} đ
          </p>

          <div class="soluong">
            <button @click="giam(index)">
              -
            </button>

            <span>
              {{ sp.soluong || 1 }}
            </span>

            <button @click="tang(index)">
              +
            </button>
          </div>

          <p>
            Thành tiền:
            {{
              (
                sp.gia *
                (sp.soluong || 1)
              ).toLocaleString()
            }} đ
          </p>

          <button
            class="xoa"
            @click="xoaSanPham(index)"
          >
            Xóa
          </button>
        </div>
      </div>

      <h2 class="tongtien">
        Tổng tiền:
        {{ tongTien.toLocaleString() }} đ
      </h2>
        <RouterLink to="/dathang">
  <button class="dat">
    Đặt hàng
  </button>
</RouterLink>
    </div>
  </div>

</template>

<script setup>
import { computed } from "vue";
import { giohang } from "../stores/giohang";
import { RouterLink } from "vue-router";
const tongTien = computed(() => {
  return giohang.reduce(
    (tong, sp) =>
      tong +
      sp.gia *
      (sp.soluong || 1),
    0
  );
});

function xoaSanPham(index) {
  giohang.splice(index, 1);

  localStorage.setItem(
    "giohang",
    JSON.stringify(giohang)
  );
}

function tang(index) {
  if (!giohang[index].soluong) {
    giohang[index].soluong = 1;
  }

  giohang[index].soluong++;

  localStorage.setItem(
    "giohang",
    JSON.stringify(giohang)
  );
}

function giam(index) {
  if (!giohang[index].soluong) {
    giohang[index].soluong = 1;
  }

  if (giohang[index].soluong > 1) {
    giohang[index].soluong--;
  } else {
    giohang.splice(index, 1);
  }

  localStorage.setItem(
    "giohang",
    JSON.stringify(giohang)
  );
}
</script>

<style scoped>
.container {
  padding: 50px;
  background: #f5f5f5;
  min-height: 100vh;
}

.item {
  background: white;
  display: flex;
  gap: 20px;
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.item img {
  width: 130px;
  height: 130px;
  object-fit: contain;
}

.info {
  flex: 1;
}

.soluong {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.soluong button {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  background: black;
  color: white;
  cursor: pointer;
}

.xoa {
  background: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

.tongtien {
  margin-top: 40px;
}
.dat {
  background: black;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 20px;
}
</style>