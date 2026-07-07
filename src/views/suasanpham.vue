<template>
  <div class="container">

    <div class="card">

      <h1>Cập nhật sản phẩm</h1>

      <form @submit.prevent="capNhat">

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
          placeholder="Mô tả sản phẩm"
        ></textarea>

        <label>

          <input
            type="checkbox"
            v-model="product.noibat"
          />

          Sản phẩm nổi bật

        </label>

        <button>
          Lưu thay đổi
        </button>

      </form>

    </div>

  </div>
</template>

<script setup>
import axios from "axios";
import {
  ref,
  onMounted,
} from "vue";

import {
  useRoute,
  useRouter,
} from "vue-router";

const route = useRoute();
const router = useRouter();

const token =
localStorage.getItem("token");

const product = ref({});

const loadProduct =
async()=>{

try{

const res =
await axios.get(
`http://localhost:5000/api/sanpham/${route.params.id}`
);

product.value =
res.data;

}
catch(err){

alert(
"Không tìm thấy sản phẩm"
);

router.push(
"/adminsanpham"
);

}

};

const capNhat =
async()=>{

try{

await axios.put(
`http://localhost:5000/api/sanpham/${route.params.id}`,
product.value,
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

alert(
"Cập nhật thành công"
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

onMounted(loadProduct);

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
box-shadow:0 3px 10px rgba(0,0,0,.1);
}

h1{
text-align:center;
margin-bottom:30px;
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
height:150px;
resize:none;
}

label{
display:flex;
align-items:center;
gap:10px;
margin-bottom:20px;
}

button{
width:100%;
padding:15px;
background:#2563eb;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
}

button:hover{
background:#1d4ed8;
}

</style>