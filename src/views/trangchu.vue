<template>
  <div>

    <Hero />

    <section class="section">

      <div class="title">

        <h2>Sản phẩm nổi bật</h2>

        <RouterLink
          to="/sanpham"
        >
          Xem tất cả →
        </RouterLink>

      </div>

      <div
        v-if="loading"
        class="loading"
      >
        Đang tải...
      </div>

      <div
        v-else
        class="products"
      >

        <ProductCard
          v-for="sp in sanphamNoiBat"
          :key="sp._id"
          :product="sp"
        />

      </div>

    </section>

    <section class="feature">

      <div class="box">

        🚚

        <h3>Miễn phí vận chuyển</h3>

        <p>
          Toàn quốc cho đơn từ
          2 triệu đồng.
        </p>

      </div>

      <div class="box">

        🛡️

        <h3>Bảo hành chính hãng</h3>

        <p>
          Cam kết 100% hàng chính hãng.
        </p>

      </div>

      <div class="box">

        💳

        <h3>Thanh toán linh hoạt</h3>

        <p>
          COD và chuyển khoản.
        </p>

      </div>

      <div class="box">

        ☎️

        <h3>Hỗ trợ 24/7</h3>

        <p>
          Luôn sẵn sàng hỗ trợ khách hàng.
        </p>

      </div>

    </section>

  </div>
</template>

<script setup>

import axios from "axios";

import {
ref,
computed,
onMounted,
} from "vue";

import Hero from "../components/Hero.vue";

import ProductCard from "../components/ProductCard.vue";

const loading=
ref(true);

const sanpham=
ref([]);

const loadData=
async()=>{

try{

const res=
await axios.get(
"/sanpham"
);

sanpham.value=
res.data.products;

}
catch(err){

console.log(err);

}

loading.value=false;

};

const sanphamNoiBat=
computed(()=>{

return sanpham.value

.filter(
i=>i.noibat
)

.slice(0,8);

});

onMounted(
loadData
);

</script>

<style scoped>

.section{

padding:60px;

}

.title{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:35px;

}

.title h2{

font-size:34px;

}

.title a{

color:#2563eb;

font-weight:bold;

}

.products{

display:grid;

grid-template-columns:

repeat(auto-fill,minmax(260px,1fr));

gap:30px;

}

.loading{

text-align:center;

padding:80px;

font-size:22px;

}

.feature{

padding:60px;

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(250px,1fr));

gap:30px;

background:white;

margin-top:40px;

}

.box{

padding:35px;

text-align:center;

border-radius:12px;

box-shadow:0 2px 8px rgba(0,0,0,.08);

font-size:22px;

}

.box h3{

margin:20px 0;

font-size:22px;

}

.box p{

color:#666;

line-height:1.6;

}

@media(max-width:768px){

.section,
.feature{

padding:20px;

}

.title{

flex-direction:column;

gap:15px;

}

}

</style>