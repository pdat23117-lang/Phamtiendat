<template>
  <div class="container">

    <div class="card">

      <h1>Thêm sản phẩm</h1>

      <form @submit.prevent="them">

        <input
          v-model="product.ten"
          placeholder="Tên sản phẩm"
          required
        />

        <input
          v-model.number="product.gia"
          type="number"
          placeholder="Giá"
          required
        />

        <input
          v-model="product.hang"
          placeholder="Hãng"
          required
        />

        <input
          v-model="product.hinh"
          placeholder="/images/iphone.jpg"
          required
        />

        <input
          v-model="product.ram"
          placeholder="RAM"
        />

        <input
          v-model="product.bonho"
          placeholder="Bộ nhớ"
        />

        <input
          v-model="product.mau"
          placeholder="Màu sắc"
        />

        <input
          v-model="product.baohanh"
          placeholder="Bảo hành"
        />

        <input
          v-model.number="product.stock"
          type="number"
          placeholder="Số lượng"
        />

        <textarea
          v-model="product.mota"
          placeholder="Mô tả"
        ></textarea>

        <label>

          <input
            type="checkbox"
            v-model="product.noibat"
          />

          Sản phẩm nổi bật

        </label>

        <button>
          Thêm sản phẩm
        </button>

      </form>

    </div>

  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const token =
localStorage.getItem(
"token"
);

const product =
ref({

ten:"",
gia:0,
hang:"",
hinh:"",
ram:"",
bonho:"",
mau:"",
baohanh:"12 tháng",
stock:10,
mota:"",
noibat:false,

});

const them =
async()=>{

try{

await axios.post(
"/sanpham",
product.value,
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

alert(
"Thêm thành công"
);

router.push(
"/adminsanpham"
);

}
catch(err){

alert(
err.response?.data?.message
);

}

};
</script>

<style scoped>

.container{
display:flex;
justify-content:center;
padding:40px;
}

.card{
width:700px;
background:white;
padding:35px;
border-radius:12px;
box-shadow:0 2px 10px rgba(0,0,0,.1);
}

h1{
text-align:center;
margin-bottom:25px;
}

input,
textarea{
width:100%;
padding:14px;
margin-bottom:16px;
border:1px solid #ddd;
border-radius:8px;
}

textarea{
height:140px;
resize:none;
}

button{
width:100%;
padding:15px;
background:#16a34a;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
}

button:hover{
background:#15803d;
}

label{
display:flex;
align-items:center;
gap:10px;
margin-bottom:20px;
}

</style>