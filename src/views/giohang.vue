<template>
  <div class="container">

    <h1>Giỏ hàng</h1>

    <div
      v-if="loading"
      class="loading"
    >
      Đang tải...
    </div>

    <div
      v-else-if="cart.items.length===0"
      class="empty"
    >
      <h2>Giỏ hàng đang trống</h2>

      <RouterLink to="/sanpham">
        <button>
          Tiếp tục mua hàng
        </button>
      </RouterLink>
    </div>

    <div
      v-else
      class="wrapper"
    >

      <div class="left">

        <div
          class="item"
          v-for="item in cart.items"
          :key="item.sanpham._id"
        >

          <img
            :src="item.sanpham.hinh"
          />

          <div class="info">

            <h3>
              {{ item.sanpham.ten }}
            </h3>

            <p>
              Hãng:
              {{ item.sanpham.hang }}
            </p>

            <p>
              RAM:
              {{ item.sanpham.ram }}
            </p>

            <p>
              Bộ nhớ:
              {{ item.sanpham.bonho }}
            </p>

            <h4>
              {{
                item.sanpham.gia.toLocaleString()
              }}
              đ
            </h4>

          </div>

          <div class="action">

            <div class="quantity">

              <button
                @click="
                  updateQty(
                    item,
                    item.soluong-1
                  )
                "
              >
                -
              </button>

              <span>
                {{ item.soluong }}
              </span>

              <button
                @click="
                  updateQty(
                    item,
                    item.soluong+1
                  )
                "
              >
                +
              </button>

            </div>

            <button
              class="remove"
              @click="
                removeItem(item)
              "
            >
              Xóa
            </button>

          </div>

        </div>

      </div>

      <div class="right">

        <h2>Tạm tính</h2>

        <div class="line">

          <span>Số sản phẩm</span>

          <span>
            {{ tongSoLuong }}
          </span>

        </div>

        <div class="line">

          <span>Tổng tiền</span>

          <strong>

            {{
              tongTien.toLocaleString()
            }}
            đ

          </strong>

        </div>

        <button
          class="checkout"
          @click="datHang"
        >
          Tiến hành đặt hàng
        </button>

        <button
          class="clear"
          @click="clearCart"
        >
          Xóa toàn bộ
        </button>

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

const cart=
ref({
items:[]
});

const loading=
ref(true);

const loadCart=
async()=>{

try{

const res=
await axios.get(
"http://localhost:5000/api/cart",
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

loading.value=false;

};
const tongSoLuong =
computed(()=>{

return cart.value.items.reduce(
(sum,item)=>
sum+item.soluong,
0
);

});

const tongTien=
computed(()=>{

return cart.value.items.reduce(
(sum,item)=>

sum+
item.soluong*
item.sanpham.gia,

0
);

});

const updateQty=
async(item,qty)=>{

if(qty<=0){

removeItem(item);

return;

}

try{

await axios.put(

`http://localhost:5000/api/cart/${item.sanpham._id}`,

{
soluong:qty,
},

{
headers:{
Authorization:
`Bearer ${token}`,
},
}

);

loadCart();

}
catch(err){

alert(
err.response?.data?.message
);

}

};

const removeItem=
async(item)=>{

if(
!confirm(
"Xóa sản phẩm này?"
)
)
return;

try{

await axios.delete(

`http://localhost:5000/api/cart/${item.sanpham._id}`,

{
headers:{
Authorization:
`Bearer ${token}`,
},
}

);

loadCart();

}
catch(err){

alert(
err.response?.data?.message
);

}

};

const clearCart=
async()=>{

if(
!confirm(
"Xóa toàn bộ giỏ hàng?"
)
)
return;

try{

await axios.delete(

"http://localhost:5000/api/cart",

{
headers:{
Authorization:
`Bearer ${token}`,
},
}

);

loadCart();

}
catch(err){

alert(
err.response?.data?.message
);

}

};

const datHang=()=>{

router.push(
"/Dathang"
);

};

onMounted(
loadCart
);

</script>

<style scoped>

.container{

padding:40px;

}

.loading,
.empty{

text-align:center;
padding:100px;

}

.empty button{

margin-top:20px;
padding:15px 30px;
border:none;
background:black;
color:white;
border-radius:10px;
cursor:pointer;

}

.wrapper{

display:grid;
grid-template-columns:2fr 1fr;
gap:30px;

}

.left{

display:flex;
flex-direction:column;
gap:20px;

}

.item{

display:flex;
gap:20px;
padding:20px;
background:white;
border-radius:12px;
box-shadow:0 2px 8px rgba(0,0,0,.08);

}

.item img{

width:150px;
height:150px;
object-fit:contain;

}

.info{

flex:1;

}

.info h3{

margin-bottom:15px;

}

.info p{

margin-bottom:8px;

}

.info h4{

margin-top:15px;
color:red;

}
.action{

display:flex;
flex-direction:column;
justify-content:space-between;
align-items:center;
gap:20px;

}

.quantity{

display:flex;
align-items:center;
gap:12px;

}

.quantity button{

width:38px;
height:38px;
border:none;
border-radius:50%;
background:#111827;
color:white;
cursor:pointer;
font-size:18px;

}

.quantity button:hover{

background:#000;

}

.quantity span{

font-size:18px;
font-weight:bold;
min-width:30px;
text-align:center;

}

.remove{

background:red;
color:white;
border:none;
padding:10px 20px;
border-radius:8px;
cursor:pointer;

}

.remove:hover{

background:#dc2626;

}

.right{

background:white;
padding:25px;
border-radius:12px;
height:max-content;
box-shadow:0 2px 8px rgba(0,0,0,.08);

}

.right h2{

margin-bottom:25px;

}

.line{

display:flex;
justify-content:space-between;
margin-bottom:18px;
font-size:17px;

}

.line strong{

font-size:24px;
color:red;

}

.checkout{

width:100%;
padding:15px;
background:#16a34a;
color:white;
border:none;
border-radius:10px;
cursor:pointer;
font-size:17px;
margin-top:20px;

}

.checkout:hover{

background:#15803d;

}

.clear{

width:100%;
padding:15px;
margin-top:15px;
background:#ef4444;
color:white;
border:none;
border-radius:10px;
cursor:pointer;
font-size:17px;

}

.clear:hover{

background:#dc2626;

}
@media (max-width:1000px){

.wrapper{

grid-template-columns:1fr;

}

}

@media (max-width:700px){

.container{

padding:20px;

}

.item{

flex-direction:column;
align-items:center;
text-align:center;

}

.item img{

width:180px;
height:180px;

}

.info{

width:100%;

}

.action{

width:100%;

}

.quantity{

justify-content:center;

}

.right{

margin-top:20px;

}

.line{

font-size:16px;

}

.line strong{

font-size:22px;

}

.checkout,
.clear{

font-size:16px;

}

}

@media (max-width:480px){

h1{

font-size:28px;
text-align:center;

}

.item{

padding:15px;

}

.item img{

width:140px;
height:140px;

}

.quantity button{

width:34px;
height:34px;

}

.quantity span{

font-size:16px;

}

.checkout,
.clear{

padding:14px;

}

}

</style>