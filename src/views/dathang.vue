<template>
  <div class="container">

    <h1>Đặt hàng</h1>

    <div class="wrapper">

      <div class="left">

        <h2>Thông tin nhận hàng</h2>

        <form @submit.prevent="datHang">

          <input
            v-model="shipping.ten"
            placeholder="Họ và tên"
            required
          />

          <input
            v-model="shipping.sodienthoai"
            placeholder="Số điện thoại"
            required
          />

          <input
            v-model="shipping.diachi"
            placeholder="Địa chỉ nhận hàng"
            required
          />

          <textarea
            v-model="shipping.ghichu"
            placeholder="Ghi chú"
          ></textarea>

          <h3>Phương thức thanh toán</h3>

          <label>

            <input
              type="radio"
              value="cod"
              v-model="paymentMethod"
            />

            Thanh toán khi nhận hàng (COD)

          </label>

          <label>

            <input
              type="radio"
              value="bank"
              v-model="paymentMethod"
            />

            Chuyển khoản ngân hàng

          </label>

          <button
            :disabled="loading"
          >
            {{
              loading
                ? "Đang xử lý..."
                : "Đặt hàng"
            }}
          </button>

        </form>

      </div>

      <div class="right">

        <h2>Đơn hàng của bạn</h2>

        <div
          class="item"
          v-for="item in cart.items"
          :key="item.sanpham._id"
        >

          <img
            :src="item.sanpham.hinh"
          />

          <div>

            <h4>
              {{ item.sanpham.ten }}
            </h4>

            <p>

              {{ item.soluong }}

              x

              {{
                item.sanpham.gia.toLocaleString()
              }}

              đ

            </p>

          </div>

        </div>

        <hr>

        <div class="total">

          <span>Tổng tiền</span>

          <strong>

            {{
              tongTien.toLocaleString()
            }}
            đ

          </strong>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>

import axios from "axios";

import {
ref,
computed,
onMounted,
} from "vue";

import {
useRouter,
} from "vue-router";

const router=
useRouter();

const token=
localStorage.getItem(
"token"
);

const loading=
ref(false);

const cart=
ref({
items:[]
});

const shipping=
ref({

ten:"",
sodienthoai:"",
diachi:"",
ghichu:"",

});

const paymentMethod=
ref("cod");

const loadCart=
async()=>{

try{

const res=
await axios.get(
"/cart",
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

cart.value=
res.data;

}
catch(err){

console.log(err);

}

};
const tongTien =
computed(()=>{

return cart.value.items.reduce(

(sum,item)=>

sum+

item.soluong*

item.sanpham.gia,

0

);

});

const datHang=
async()=>{

loading.value=true;

try{

const items=

cart.value.items.map(

(item)=>({

productId:
item.sanpham._id,

name:
item.sanpham.ten,

price:
item.sanpham.gia,

quantity:
item.soluong,

image:
item.sanpham.hinh,

})

);

const res=

await axios.post(

"/dathang",

{

items,

total:
tongTien.value,

shipping,

paymentMethod:
paymentMethod.value,

},

{

headers:{

Authorization:
`Bearer ${token}`,

},

}

);

alert(
res.data.message
);

await axios.delete(

"/cart",

{

headers:{

Authorization:
`Bearer ${token}`,

},

}

);

router.push(
"/LichSuDonHang"
);

}
catch(err){

alert(

err.response?.data?.message||

"Đặt hàng thất bại"

);

}

loading.value=false;

};

onMounted(
loadCart
);

</script>

<style scoped>

.container{

padding:40px;

}

.wrapper{

display:grid;

grid-template-columns:

2fr 1fr;

gap:30px;

}

.left{

background:white;

padding:30px;

border-radius:12px;

box-shadow:0 2px 8px rgba(0,0,0,.08);

}

.left h2{

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

height:120px;

resize:none;

}

label{

display:flex;

align-items:center;

gap:10px;

margin-bottom:15px;

}

button{

width:100%;

padding:15px;

background:#16a34a;

color:white;

border:none;

border-radius:10px;

cursor:pointer;

font-size:16px;

margin-top:20px;

}

button:hover{

background:#15803d;

}
.right{

background:white;

padding:30px;

border-radius:12px;

height:max-content;

box-shadow:0 2px 8px rgba(0,0,0,.08);

}

.right h2{

margin-bottom:25px;

}

.item{

display:flex;

align-items:center;

gap:15px;

padding:15px 0;

border-bottom:1px solid #eee;

}

.item:last-child{

border-bottom:none;

}

.item img{

width:80px;

height:80px;

object-fit:contain;

}

.item h4{

margin-bottom:8px;

font-size:16px;

}

.item p{

color:#666;

}

.total{

display:flex;

justify-content:space-between;

align-items:center;

margin-top:25px;

font-size:20px;

}

.total strong{

color:red;

font-size:28px;

}

hr{

margin:25px 0;

border:none;

border-top:1px solid #ddd;

}

button:disabled{

opacity:.6;

cursor:not-allowed;

}
@media (max-width:1000px){

.wrapper{

grid-template-columns:1fr;

}

.right{

margin-top:20px;

}

}

@media (max-width:768px){

.container{

padding:20px;

}

.left,
.right{

padding:20px;

}

.item{

flex-direction:column;

text-align:center;

}

.item img{

width:120px;

height:120px;

}

.total{

font-size:18px;

}

.total strong{

font-size:24px;

}

button{

font-size:15px;

}

}

@media (max-width:480px){

h1{

text-align:center;

font-size:28px;

margin-bottom:20px;

}

.left h2,
.right h2{

font-size:22px;

}

input,
textarea{

padding:12px;

}

label{

font-size:15px;

}

.item img{

width:100px;

height:100px;

}

.total{

flex-direction:column;

gap:10px;

}

}
button:hover{

background:#15803d;

transition:.3s;

}

input:focus,
textarea:focus{

outline:none;
border:1px solid #2563eb;
box-shadow:0 0 5px rgba(37,99,235,.3);

}

.item:hover{

background:#f8fafc;
transition:.3s;

}

.left,
.right{

transition:.3s;

}

@media print{

button{
display:none;
}

input,
textarea{
border:none;
}

.left,
.right{
box-shadow:none;
}

}

</style>