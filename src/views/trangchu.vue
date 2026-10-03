<template>
  <div class="home">

    <!-- HERO -->
<section class="hero-section">

  <div class="hero-content">

    <div class="hero-text">

      <div class="badge">
        📱 DAT MOBILE
      </div>

      <h1>
        Điện thoại chính hãng
        <br>
        <span>Giá tốt mỗi ngày</span>
      </h1>

      <p>
        Khám phá những mẫu iPhone mới nhất, chính hãng,
        bảo hành uy tín và nhiều ưu đãi hấp dẫn tại DAT MOBILE.
      </p>

      <RouterLink
        to="/sanpham"
        class="hero-button"
      >
        Xem sản phẩm →
      </RouterLink>

      <div class="hero-features">

        <div>
          🚚
          <strong>Giao hàng</strong>
          <span>toàn quốc</span>
        </div>

        <div>
          🛡️
          <strong>Bảo hành</strong>
          <span>chính hãng</span>
        </div>

        <div>
          💳
          <strong>Thanh toán</strong>
          <span>linh hoạt</span>
        </div>

        <div>
          🎧
          <strong>Hỗ trợ</strong>
          <span>24/7</span>
        </div>

      </div>

    </div>

    <div class="hero-image">

      <img
        src="/images/banner.png"
        alt="DAT MOBILE - iPhone chính hãng"
      >

    </div>

  </div>

</section>


    <!-- SẢN PHẨM NỔI BẬT -->
    <section class="section">

      <div class="title">

        <div>
          <span class="section-label">
            KHÁM PHÁ
          </span>

          <h2>
            Sản phẩm nổi bật
          </h2>
        </div>

        <RouterLink to="/sanpham">
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


    <!-- DỊCH VỤ -->
    <section class="feature">

      <div class="box">

        <div class="feature-icon">
          🚚
        </div>

        <h3>
          Miễn phí vận chuyển
        </h3>

        <p>
          Toàn quốc cho đơn từ
          2 triệu đồng.
        </p>

      </div>


      <div class="box">

        <div class="feature-icon">
          🛡️
        </div>

        <h3>
          Bảo hành chính hãng
        </h3>

        <p>
          Cam kết 100% hàng chính hãng.
        </p>

      </div>


      <div class="box">

        <div class="feature-icon">
          💳
        </div>

        <h3>
          Thanh toán linh hoạt
        </h3>

        <p>
          COD và chuyển khoản.
        </p>

      </div>


      <div class="box">

        <div class="feature-icon">
          ☎️
        </div>

        <h3>
          Hỗ trợ 24/7
        </h3>

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
  onMounted
} from "vue";

import {
  useRouter
} from "vue-router";

import ProductCard from "../components/ProductCard.vue";


const router = useRouter();

const loading = ref(true);

const sanpham = ref([]);


const loadData = async () => {
  try {
    const res = await axios.get("/sanpham", {
      params: {
        page: 1,
        limit: 100
      }
    });

    sanpham.value = res.data.products;

    console.log("Tất cả sản phẩm:", sanpham.value);

  } catch (err) {
    console.log(err);
  }

  loading.value = false;
};

const getMaxPrice = (product) => {
  if (!product || product.gia == null) {
    return 0;
  }

  // Nếu gia là số
  if (typeof product.gia === "number") {
    return product.gia;
  }

  // Nếu gia là object { "128GB": ..., "256GB": ..., ... }
  if (typeof product.gia === "object") {
    const prices = Object.values(product.gia)
      .map(price => Number(price))
      .filter(price => !isNaN(price));

    return prices.length > 0
      ? Math.max(...prices)
      : 0;
  }

  return 0;
};


const sanphamNoiBat = computed(() => {

  return [...sanpham.value]
    .filter(sp => sp && sp.gia != null)
    .sort((a, b) => {
      return getMaxPrice(b) - getMaxPrice(a);
    })
    .slice(0, 4);

});


const goProducts = () => {

  router.push("/sanpham");

};


onMounted(loadData);

</script>


<style scoped>

/* =========================
   TOÀN TRANG
========================= */

.home {
  background: #f5f7fb;
  min-height: 100vh;
}


/* =========================
   HERO
========================= */

.hero-section {
  width: 100%;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #f7f9ff 100%
  );

  padding: 70px 5% 80px;

  box-sizing: border-box;
}


.hero-content {
  width: 100%;
  max-width: 1600px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    40% 60%;

  align-items: center;

  gap: 30px;
}


/* =========================
   HERO - BÊN TRÁI
========================= */

.hero-text {
  padding-left: 20px;
}


.badge {
  display: inline-block;

  padding: 10px 20px;

  background: #eef2ff;

  color: #4169e1;

  border-radius: 30px;

  font-weight: bold;

  font-size: 16px;

  margin-bottom: 25px;
}


.hero-text h1 {
  margin: 0 0 25px;

  color: #111827;

  font-size: 56px;

  line-height: 1.15;

  font-weight: 800;
}


.hero-text h1 span {
  color: #4169e1;
}


.hero-text p {
  max-width: 650px;

  margin-bottom: 32px;

  color: #64748b;

  font-size: 19px;

  line-height: 1.7;
}


/* =========================
   NÚT XEM SẢN PHẨM
========================= */

.hero-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: 16px 30px;

  background: #111827;

  color: white;

  border-radius: 10px;

  text-decoration: none;

  font-size: 17px;

  font-weight: bold;

  transition: all 0.3s ease;
}


.hero-button:hover {
  background: #2563eb;

  transform: translateY(-2px);

  box-shadow:
    0 8px 20px rgba(37, 99, 235, 0.25);
}


/* =========================
   THÔNG TIN DỊCH VỤ TRONG HERO
========================= */

.hero-features {
  display: flex;

  align-items: center;

  gap: 25px;

  margin-top: 45px;

  flex-wrap: wrap;
}


.hero-features div {
  display: grid;

  grid-template-columns: 38px auto;

  column-gap: 8px;

  align-items: center;

  font-size: 24px;
}


.hero-features strong {
  color: #111827;

  font-size: 15px;

  line-height: 1.3;
}


.hero-features span {
  grid-column: 2;

  color: #64748b;

  font-size: 14px;
}


/* =========================
   HERO - ẢNH BANNER
========================= */

.hero-image {
  width: 100%;

  display: flex;

  justify-content: center;

  align-items: center;
}


.hero-image img {
  display: block;

  width: 100%;

  max-width: 900px;

  height: auto;

  object-fit: contain;

  border-radius: 18px;

  /* Không crop ảnh */
  object-position: center;

  /* Hiệu ứng nhẹ */
  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.12);
}


/* =========================
   SẢN PHẨM NỔI BẬT
========================= */

.section {
  padding: 70px 5%;

  background: #f5f7fb;
}


.title {
  display: flex;

  justify-content: space-between;

  align-items: flex-end;

  max-width: 1600px;

  margin: 0 auto 35px;
}


.section-label {
  display: block;

  margin-bottom: 8px;

  color: #4169e1;

  font-size: 14px;

  font-weight: 800;

  letter-spacing: 1px;
}


.title h2 {
  margin: 0;

  color: #111827;

  font-size: 36px;

  font-weight: 800;
}


.title a {
  color: #2563eb;

  font-size: 16px;

  font-weight: bold;

  text-decoration: none;
}


.title a:hover {
  text-decoration: underline;
}


/* =========================
   DANH SÁCH SẢN PHẨM
========================= */

.products {
  max-width: 1600px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 25px;
}


.loading {
  text-align: center;

  padding: 80px;

  font-size: 22px;
}


/* =========================
   DỊCH VỤ
========================= */

.feature {
  padding: 70px 5%;

  background: white;

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 25px;
}


.box {
  padding: 35px 25px;

  text-align: center;

  background: white;

  border-radius: 15px;

  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.07);

  transition: 0.3s;
}


.box:hover {
  transform: translateY(-5px);

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.12);
}


.feature-icon {
  font-size: 38px;

  margin-bottom: 15px;
}


.box h3 {
  margin: 10px 0 12px;

  color: #111827;

  font-size: 20px;
}


.box p {
  margin: 0;

  color: #64748b;

  line-height: 1.6;

  font-size: 15px;
}


/* =========================
   TABLET
========================= */

@media (max-width: 1200px) {

  .hero-content {
    grid-template-columns:
      45% 55%;

    gap: 20px;
  }


  .hero-text h1 {
    font-size: 46px;
  }


  .hero-text p {
    font-size: 17px;
  }


  .hero-features {
    gap: 15px;
  }


  .products {
    grid-template-columns:
      repeat(3, 1fr);
  }


  .feature {
    grid-template-columns:
      repeat(2, 1fr);
  }

}


/* =========================
   TABLET NHỎ
========================= */

@media (max-width: 900px) {

  .hero-section {
    padding: 50px 25px;
  }


  .hero-content {
    grid-template-columns: 1fr;

    text-align: center;
  }


  .hero-text {
    padding-left: 0;
  }


  .hero-text p {
    margin-left: auto;
    margin-right: auto;
  }


  .hero-features {
    justify-content: center;
  }


  .hero-image {
    margin-top: 20px;
  }


  .hero-image img {
    max-width: 800px;
  }


  .products {
    grid-template-columns:
      repeat(2, 1fr);
  }

}


/* =========================
   ĐIỆN THOẠI
========================= */

@media (max-width: 600px) {

  .hero-section {
    padding: 40px 20px 50px;
  }


  .hero-text h1 {
    font-size: 36px;
  }


  .hero-text p {
    font-size: 16px;
  }


  .hero-features {
    display: grid;

    grid-template-columns:
      repeat(2, 1fr);

    gap: 20px;

    text-align: left;
  }


  .hero-image img {
    width: 100%;

    border-radius: 12px;
  }


  .section {
    padding: 45px 20px;
  }


  .title {
    flex-direction: column;

    align-items: flex-start;

    gap: 15px;
  }


  .title h2 {
    font-size: 30px;
  }


  .products {
    grid-template-columns: 1fr;
  }


  .feature {
    grid-template-columns: 1fr;

    padding: 45px 20px;
  }

}

</style>