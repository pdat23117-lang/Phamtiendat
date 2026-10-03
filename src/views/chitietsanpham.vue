<template>
  <div class="container">

    <div
      v-if="loading"
      class="loading"
    >
      Đang tải sản phẩm...
    </div>

    <div
      v-else
      class="product"
    >

      <div class="left">

  <div class="product-gallery">

    <!-- Ảnh chính -->
    <div class="main-image-container">

      <button
        v-if="productImages.length > 1"
        class="gallery-arrow left"
        @click="prevImage"
      >
        ‹
      </button>

      <img
        :src="productImages[currentImageIndex]"
        :alt="product.ten"
        class="main-product-image"
        @error="
          $event.target.src='/images/no-image.jpg'
        "
      />

      <button
        v-if="productImages.length > 1"
        class="gallery-arrow right"
        @click="nextImage"
      >
        ›
      </button>

    </div>

    <!-- Ảnh nhỏ -->
    <div
      v-if="productImages.length > 1"
      class="thumbnail-list"
    >

      <button
        v-for="(image, index) in productImages"
        :key="image"
        class="thumbnail"
        :class="{
          active:
            currentImageIndex === index
        }"
        @click="selectImage(index)"
      >

        <img
          :src="image"
          :alt="`${product.ten} - ảnh ${index + 1}`"
        />

      </button>

    </div>

  </div>

</div>

      <div class="right">

        <h1>
          {{ product.ten }}
        </h1>
        <div class="rating-info">

  <span class="star">
    ⭐ {{ Number(product.averageRating || 0).toFixed(1) }}/5
  </span>

  <span class="count">
    ({{ product.numReviews || 0 }} đánh giá)
  </span>

</div>

        <h2>
  {{ Number(currentPrice || 0).toLocaleString("vi-VN") }} đ
</h2>

<p
  v-if="product.stock > 0"
  class="instock"
>
  🟢 Còn hàng
</p>

<p
  v-else
  class="outstock"
>
  🔴 Hết hàng
</p>

<table>

  <tr>
    <td>Hãng</td>
    <td>{{ product.hang }}</td>
  </tr>

  <tr>
    <td>Bộ nhớ</td>
    <td>
      <div class="options">
        <button
          v-for="storage in product.bonho"
          :key="storage"
          :class="{ active: selectedStorage === storage }"
          @click="selectedStorage = storage"
        >
          {{ storage }}
        </button>
      </div>
    </td>
  </tr>

  <tr>
    <td>Màu</td>
    <td>
      <div class="options">
        <button
          v-for="color in product.mau"
          :key="color"
          :class="{ active: selectedColor === color }"
          @click="selectedColor = color"
        >
          {{ color }}
        </button>
      </div>
    </td>
  </tr>

  <tr>
    <td>Bảo hành</td>
    <td>{{ product.baohanh }}</td>
  </tr>

  <tr>
    <td>Tồn kho</td>
    <td>
      {{ product.stock }}

      <span
        v-if="product.stock === 0"
        class="soldout"
      >
        (Hết hàng)
      </span>
    </td>
  </tr>

</table>

        <div class="quantity">

          <button
            @click="quantity--"
            :disabled="quantity<=1"
          >
            
          </button>

          <span>
            {{ quantity }}
          </span>

          <button
  @click="quantity++"
  :disabled="
product.stock===0 ||
quantity>=product.stock
"
>
  +
</button>

        </div>

        <button
  class="cart"
  @click="addToCart"
  :disabled="product.stock===0"
>
          Thêm vào giỏ hàng
        </button>
        <button
  class="buy"
  @click="buyNow"
  :disabled="product.stock===0"
>

Mua ngay

</button>

      </div>

    </div>

    <div
      class="description"
      v-if="!loading"
    >

      <h2>Mô tả sản phẩm</h2>

      <p>

        {{ product.mota }}

      </p>

    </div>
       <div
      class="review"
      v-if="!loading"
    >

      <h2>Đánh giá sản phẩm</h2>
      <p
  v-if="!product.reviews || product.reviews.length===0"
  class="empty-review"
>

Chưa có đánh giá nào.

</p>

      <div
        v-if="auth.user"
        class="review-form"
      >

        <select
          v-model="rating"
        >

          <option :value="5">★★★★★</option>
          <option :value="4">★★★★☆</option>
          <option :value="3">★★★☆☆</option>
          <option :value="2">★★☆☆☆</option>
          <option :value="1">★☆☆☆☆</option>

        </select>

        <textarea
          v-model="comment"
          placeholder="Nhập đánh giá..."
        ></textarea>

        <button
          @click="submitReview"
        >
          Gửi đánh giá
        </button>

      </div>

      <div
        v-else
      >

        <RouterLink
          to="/dangnhap"
        >
          Đăng nhập để đánh giá
        </RouterLink>

      </div>

      <div
  class="review-item"
  v-for="item in product.reviews || []"
  :key="item._id"
>

        <h4>

          {{ item.name }}

        </h4>

        <p>

          ⭐ {{ item.rating }}/5

        </p>

        <p>

          {{ item.comment }}

        </p>

        <div
          v-if="item.adminReply"
          class="reply"
        >

          <strong>

            Phản hồi từ cửa hàng

          </strong>

          <p>

            {{ item.adminReply }}

          </p>

        </div>

      </div>

    </div>

  </div>
  

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

import axios from "axios";


import {
useRoute,
useRouter,
} from "vue-router";
import { useAuthStore } from "../stores/auth";


const selectedStorage = ref("");
const selectedColor = ref("");

const currentImageIndex = ref(0);

let imageInterval = null;

const productImages = computed(() => {
    if (product.value?.hinhAnh?.length) {
        return product.value.hinhAnh;
    }

    if (product.value?.hinh) {
        return [product.value.hinh];
    }

    return [];
}); 
const nextImage = () => {
    if (!productImages.value.length) return;

    currentImageIndex.value =
        (currentImageIndex.value + 1) %
        productImages.value.length;
};

const prevImage = () => {
    if (!productImages.value.length) return;

    currentImageIndex.value =
        (currentImageIndex.value - 1 + productImages.value.length) %
        productImages.value.length;
};

const selectImage = (index) => {
    currentImageIndex.value = index;
};
const startImageSlide = () => {
    imageInterval = setInterval(() => {
        nextImage();
    }, 4000);
};

const stopImageSlide = () => {
    if (imageInterval) {
        clearInterval(imageInterval);
        imageInterval = null;
    }
};
onMounted(() => {
    startImageSlide();
});

onUnmounted(() => {
    stopImageSlide();
}); 

const route=
useRoute();
const router = useRouter();


const auth = useAuthStore();

const loading=
ref(true);

const quantity=
ref(1);

const rating=
ref(5);

const comment=
ref("");

const product=
ref({});

const loadProduct = async () => {
  try {
    loading.value = true;

   const res = await axios.get(
  `/sanpham/${route.params.id}`
);

product.value = res.data;
    // Chọn dung lượng đầu tiên
    if (product.value.bonho?.length) {
      selectedStorage.value = product.value.bonho[0];
    }

    // Chọn màu đầu tiên
    if (product.value.mau?.length) {
      selectedColor.value = product.value.mau[0];
    }

  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const addToCart = async () => {
  if (!product.value) {
    return;
  }

  if (!selectedStorage.value) {
    alert("Vui lòng chọn bộ nhớ");
    return;
  }

  if (!selectedColor.value) {
    alert("Vui lòng chọn màu");
    return;
  }

  if (product.value.stock === 0) {
    alert("Sản phẩm đã hết hàng");
    return;
  }

  if (quantity.value > product.value.stock) {
    alert("Số lượng vượt quá tồn kho");
    return;
  }

  try {
  await axios.post("/cart", {
    productId: product.value._id,
    bonho: selectedStorage.value,
    mau: selectedColor.value,
    soluong: quantity.value
  });

  alert("Đã thêm sản phẩm vào giỏ hàng");

  return true;

} catch (err) {
  console.error(err);

  alert(
    err.response?.data?.message ||
    "Thêm vào giỏ thất bại"
  );

  return false;
}
};
const getColorCode = (color) => {
    const colorMap = {
        "Đen": "#111111",
        "Trắng": "#ffffff",
        "Bạc": "#d9d9d9",
        "Đỏ": "#d32f2f",
        "Hồng": "#f4a6c1",
        "Xanh Dương": "#4f83cc",
        "Xanh Lá": "#6fa66f",
        "Vàng": "#f4d35e",

        "Ánh Sao": "#eeeae0",
        "Đêm Xanh Thẳm": "#172033",

        "Xanh Mòng Két": "#5caaa4",
        "Xanh Lưu Ly": "#8ca7d8",

        "Titan Đen": "#3b3b3b",
        "Titan Trắng": "#e3e3e3",
        "Titan Tự Nhiên": "#a9a59b",
        "Titan Sa Mạc": "#c5a17a",

        "Xanh Lam Khói": "#8ba4b8",
        "Xanh Lá Xô Thơm": "#9cab91",
        "Tím Oải Hương": "#b5a9c9",

        "Hồng Phai": "#e8c6ce",

        "Bạc": "#d8d8d8",
        "Cam Vũ Trụ": "#d96b32",
        "Xanh Đậm": "#183b62",

        "Băng Thanh": "#b8c8df",
        "Đỏ Burgundy": "#720018",

        "Đen Không Gian": "#202124",
        "Trắng Mây": "#f1f1ed",
        "Vàng Nhạt": "#e5d39b",
        "Xanh Da Trời": "#9fc6e8",

        "Trời Đêm": "#111827",
        "Trắng Ánh Sao": "#f5f5ef"
    };

    return colorMap[color] || "#cccccc";
};
const currentPrice = computed(() => {
  if (!product.value || !selectedStorage.value) {
    return 0;
  }

  return product.value.gia?.[selectedStorage.value] || 0;
});
const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("vi-VN") + "đ";
};
const buyNow = async()=>{

  const ok =
  await addToCart();

  if(ok){

    router.push("/giohang");

  }

};

const submitReview= async()=>{
if(!auth.token){

  alert("Vui lòng đăng nhập");

  return;

}

if(!comment.value){

  alert("Vui lòng nhập nội dung đánh giá");

  return;

}

try{

await axios.post(
  `/sanpham/${product.value._id}/reviews`,
  {
    rating: rating.value,
    comment: comment.value,
  }
);

alert(
"Đánh giá thành công"
);

comment.value="";

rating.value=5;

await loadProduct();

}
catch(err){

alert(
err.response?.data?.message
);

}

};

onMounted(
loadProduct
);

</script>

<style scoped>

.container{

padding:40px;

}

.loading{

text-align:center;

padding:100px;

}

.product{

display:grid;

grid-template-columns:1fr 1fr;

gap:40px;

}

.left{

display:flex;

justify-content:center;

align-items:center;

}

.left img{

width:100%;

max-width:420px;

object-fit:contain;

}

.right h1{

margin-bottom:15px;

}

.right h2{

color:red;

margin-bottom:20px;

font-size:32px;

}

table{

width:100%;

border-collapse:collapse;

margin-bottom:25px;

}

td{

padding:12px;

border:1px solid #ddd;

}

.quantity{

display:flex;

align-items:center;

gap:15px;

margin-bottom:25px;

}
.cart{

width:100%;

padding:16px;

background:#111827;

color:white;

border:none;

border-radius:10px;

font-size:17px;

cursor:pointer;

margin-bottom:35px;

}

.cart:hover{

background:#000;

}
.cart:disabled{

  background:#9ca3af;

  cursor:not-allowed;

}

.quantity button{

width:40px;

height:40px;

border:none;

border-radius:50%;

background:#111827;

color:white;

cursor:pointer;

font-size:18px;

}

.quantity span{

font-size:20px;

font-weight:bold;

min-width:40px;

text-align:center;

}

.description{

margin-top:60px;

background:white;

padding:30px;

border-radius:12px;

box-shadow:0 2px 8px rgba(0,0,0,.08);

}

.description h2{

margin-bottom:20px;

}

.description p{

line-height:1.8;

color:#555;

}

.review{

margin-top:50px;

background:white;

padding:30px;

border-radius:12px;

box-shadow:0 2px 8px rgba(0,0,0,.08);

}

.review h2{

margin-bottom:25px;

}

.review-form{

margin-bottom:35px;

}

.review-form select{

padding:12px;

margin-bottom:15px;

border-radius:8px;

border:1px solid #ddd;

}

.review-form textarea{

width:100%;

height:120px;

padding:15px;

border:1px solid #ddd;

border-radius:8px;

resize:none;

margin-bottom:15px;

}

.review-form button{

padding:14px 30px;

background:#16a34a;

color:white;

border:none;

border-radius:8px;

cursor:pointer;

}

.review-form button:hover{

background:#15803d;

}

.review-item{

padding:20px 0;

border-top:1px solid #eee;

}

.review-item h4{

margin-bottom:8px;

}

.review-item p{

margin:6px 0;

}

.reply{

margin-top:15px;

padding:15px;

background:#f3f4f6;

border-left:5px solid #16a34a;

border-radius:6px;

}
@media (max-width:1000px){

.product{

grid-template-columns:1fr;

}

.left{

margin-bottom:30px;

}

}

@media (max-width:768px){

.container{

padding:20px;

}

.left img{

max-width:280px;

}

.right h1{

font-size:28px;

}

.right h2{

font-size:26px;

}

.quantity{

justify-content:center;

}

.cart{

font-size:16px;

}

.description,
.review{

padding:20px;

}

.review-form button{

width:100%;

}

}

@media (max-width:480px){

h1{

font-size:24px;

}

table td{

padding:10px;

font-size:14px;

}

.quantity button{

width:36px;

height:36px;

}

.quantity span{

font-size:18px;

}

.left img{

max-width:220px;

}

.review-item{

font-size:14px;

}

.reply{

font-size:14px;

padding:12px;

}

}
.rating-info{

display:flex;

align-items:center;

gap:15px;

margin-bottom:15px;

font-size:16px;

}

.star{

color:#f59e0b;

font-weight:bold;

}

.count{

color:#666;

}

.instock{

color:#16a34a;

font-weight:bold;

margin-bottom:20px;

}

.outstock{

color:red;

font-weight:bold;

margin-bottom:20px;

}

.buy{

width:100%;

padding:16px;

margin-top:15px;

background:#dc2626;

color:white;

border:none;

border-radius:10px;

font-size:17px;

cursor:pointer;

transition:.3s;

}

.buy:hover{

background:#b91c1c;

}

.buy:disabled{

background:#9ca3af;

cursor:not-allowed;

}
.soldout{
  color:red;
  font-weight:bold;
}
.empty-review{

text-align:center;

padding:20px;

color:#666;

font-style:italic;

}
.product-gallery {
    width: 100%;
}

.main-image-container {
    position: relative;
    width: 100%;
    height: 480px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #fff;
    border-radius: 12px;
    overflow: hidden;
}

.main-product-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity 0.3s ease;
}

.gallery-arrow {
    position: absolute;

    width: 42px;
    height: 42px;

    border: none;
    border-radius: 50%;

    background: rgba(0, 0, 0, 0.5);
    color: white;

    font-size: 30px;
    line-height: 1;

    cursor: pointer;

    z-index: 5;

    transition: 0.2s;
}

.gallery-arrow:hover {
    background: rgba(0, 0, 0, 0.75);
}

.gallery-arrow.left {
    left: 15px;
}

.gallery-arrow.right {
    right: 15px;
}


/* ẢNH NHỎ */

.thumbnail-list {
    display: flex;
    justify-content: center;
    gap: 12px;

    margin-top: 15px;
}

.thumbnail {
    width: 75px;
    height: 75px;

    border: 2px solid transparent;
    border-radius: 8px;

    overflow: hidden;
    cursor: pointer;

    background: white;
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.thumbnail.active {
    border-color: #287cff;
}
.product-option {
    margin-top: 20px;
}

.product-option h3 {
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 600;
}

.option-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.storage-btn {
    padding: 10px 18px;

    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;

    font-size: 14px;
    cursor: pointer;

    transition: 0.2s;
}

.storage-btn:hover {
    border-color: #287cff;
}

.storage-btn.active {
    border: 2px solid #287cff;
    color: #287cff;
    background: #f5f9ff;
}


.color-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.color-btn {
    display: flex;
    align-items: center;
    gap: 7px;

    padding: 9px 14px;

    background: white;
    border: 1px solid #ddd;
    border-radius: 20px;

    cursor: pointer;

    font-size: 14px;

    transition: 0.2s;
}

.color-btn:hover {
    border-color: #287cff;
}

.color-btn.active {
    border: 2px solid #287cff;
    color: #287cff;
    background: #f5f9ff;
}

.color-dot {
    width: 17px;
    height: 17px;

    border-radius: 50%;

    border: 1px solid #ccc;

    flex-shrink: 0;
}
.option-group {
  margin: 20px 0;
}

.option-group h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.options button {
  padding: 10px 18px;
  border: 1px solid #ccc;
  background: white;
  color: #111;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.options button:hover {
  border-color: #111;
}

.options button.active {
  background: #111;
  color: white;
  border-color: #111;
}
</style>