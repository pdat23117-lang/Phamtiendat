<template>
  <div class="card">

    <RouterLink
      :to="`/chitietsanpham/${product._id}`"
    >

      <img
        :src="product.hinh"
        :alt="product.ten"
      />

    </RouterLink>

    <div class="body">

      <span class="brand">

        {{ product.hang }}

      </span>

      <h3>

        {{ product.ten }}

      </h3>

      <div class="spec">

        <span>

          {{ product.ram }}

        </span>

        <span>

          {{ product.bonho }}

        </span>

      </div>

      <h2>

        {{ product.gia.toLocaleString() }}
        đ

      </h2>

      <div
        class="stock"
        :class="{
          out:
            product.stock<=0
        }"
      >

        <span
          v-if="product.stock>0"
        >

          Còn
          {{ product.stock }}
          sản phẩm

        </span>

        <span
          v-else
        >

          Hết hàng

        </span>

      </div>

      <button
        @click="themGioHang"
        :disabled="
          product.stock<=0
        "
      >

        {{
          product.stock>0
          ? "Thêm vào giỏ"
          : "Hết hàng"
        }}

      </button>

    </div>

  </div>
</template>

<script setup>
import axios from "axios";

const props=
defineProps({

product:Object,

});

const themGioHang=
async()=>{

const token=
localStorage.getItem(
"token"
);

if(!token){

alert(
"Vui lòng đăng nhập"
);

return;

}

try{

await axios.post(

"/cart",

{

productId:
props.product._id,

soluong:1,

},

{

headers:{
Authorization:
`Bearer ${token}`,
},

}

);

alert(
"Đã thêm vào giỏ hàng"
);

}
catch(err){

alert(

err.response?.data?.message

||

"Lỗi thêm giỏ hàng"

);

}

};

</script>

<style scoped>

.card{

background:white;

border-radius:14px;

overflow:hidden;

box-shadow:0 2px 12px rgba(0,0,0,.08);

transition:.3s;

display:flex;

flex-direction:column;

}

.card:hover{

transform:translateY(-6px);

box-shadow:0 10px 24px rgba(0,0,0,.15);

}

img{

width:100%;

height:240px;

object-fit:contain;

padding:20px;

background:white;

}

.body{

padding:20px;

}

.brand{

display:inline-block;

padding:4px 12px;

background:#eef2ff;

color:#2563eb;

border-radius:30px;

font-size:13px;

margin-bottom:10px;

}

h3{

height:55px;

margin-bottom:15px;

font-size:18px;

}

.spec{

display:flex;

gap:10px;

margin-bottom:15px;

}

.spec span{

background:#f3f4f6;

padding:6px 10px;

border-radius:6px;

font-size:13px;

}

h2{

color:red;

margin-bottom:15px;

}

.stock{

margin-bottom:15px;

font-weight:bold;

color:#16a34a;

}

.stock.out{

color:red;

}

button{

width:100%;

padding:14px;

background:#111827;

color:white;

border:none;

border-radius:8px;

cursor:pointer;

font-size:15px;

transition:.3s;

}

button:hover{

background:black;

}

button:disabled{

background:#9ca3af;

cursor:not-allowed;

}

</style>