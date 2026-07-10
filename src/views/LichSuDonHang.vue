<template>
  <div class="container">

    <h1>Lịch sử đơn hàng</h1>

    <div
      v-if="loading"
      class="loading"
    >
      Đang tải...
    </div>

    <div
      v-else-if="orders.length===0"
      class="empty"
    >
      <h2>Bạn chưa có đơn hàng nào</h2>

      <RouterLink to="/sanpham">
        <button>Mua ngay</button>
      </RouterLink>

    </div>

    <div
      v-else
      class="list"
    >

      <div
        class="order"
        v-for="order in orders"
        :key="order._id"
      >

        <div class="header">

          <div>

            <h3>
              Mã đơn:
              {{ order._id }}
            </h3>

            <p>
              {{ formatDate(order.createdAt) }}
            </p>

          </div>

          <span
            class="status"
            :class="order.status"
          >
            {{ getStatus(order.status) }}
          </span>

        </div>

        <div
          class="item"
          v-for="sp in order.items"
          :key="sp.product"
        >

          <img
  :src="sp.hinh"
/>

          <div class="info">

            <h4>
              {{ sp.ten }}
            </h4>

            <p>
              SL:
              {{ sp.soluong }}
            </p>

          </div>

          <strong>

            {{
              (
                sp.gia*
                sp.soluong
              ).toLocaleString()
            }}
            đ

          </strong>

        </div>

        <div class="footer">

          <div>

            Tổng:

            <strong>

              {{
                order.thanhTien.toLocaleString()
              }}
              đ

            </strong>
<button
v-if="order.status==='delivered'"
@click="router.push(`/chitietsanpham/${sp.product}`)"
>
Đánh giá
</button>
          </div>

          <button
            v-if="
              order.status==='pending'
            "
            @click="
              huyDon(order._id)
            "
          >
            Hủy đơn
          </button>
          <button
  v-if="order.status === 'delivered'"
  @click="router.push('/danhgia/' + order._id)"
>
  Đánh giá
</button>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
import axios from "axios";

import {
ref,
onMounted,
} from "vue";

const token=
localStorage.getItem(
"token"
);

const loading=
ref(true);

const orders=
ref([]);

const loadOrders=
async()=>{

try{

const res =
await axios.get(

"/dathang/my",

{

headers:{

Authorization:
`Bearer ${token}`,

},

}

);

orders.value=
res.data;
console.log(res.data);
}
catch(err){

console.log(err);

}

loading.value=false;

};
const huyDon =
async(id)=>{

if(
!confirm(
"Bạn có chắc muốn hủy đơn hàng?"
)
)
return;

try{

await axios.put(

`/dathang/${id}/cancel`,

{},

{
headers:{
Authorization:
`Bearer ${token}`,
},
}

);

alert(
"Hủy đơn thành công"
);

loadOrders();

}
catch(err){

alert(
err.response?.data?.message
);

}

};

const formatDate=
(date)=>{

return new Date(
date
).toLocaleString(
"vi-VN"
);

};

const getStatus=
(status)=>{

switch(status){

case "pending":
return "Chờ xác nhận";

case "processing":
return "Đang xử lý";

case "shipping":
return "Đang giao";

case "delivered":
return "Đã giao";

case "cancelled":
return "Đã hủy";

default:
return status;

}

};

onMounted(
loadOrders
);

</script>

<style scoped>

.container{

padding:40px;

}

.loading,
.empty{

text-align:center;
padding:80px;

}

.empty button{

margin-top:20px;
padding:15px 30px;
background:black;
color:white;
border:none;
border-radius:10px;
cursor:pointer;

}

.list{

display:flex;
flex-direction:column;
gap:25px;

}

.order{

background:white;
padding:25px;
border-radius:12px;
box-shadow:0 2px 8px rgba(0,0,0,.08);

}

.header{

display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;

}

.header h3{

margin-bottom:8px;

}
.status{

padding:8px 18px;

border-radius:20px;

color:white;

font-weight:bold;

font-size:14px;

}

.pending{

background:#f59e0b;

}

.processing{

background:#3b82f6;

}

.shipping{

background:#6366f1;

}

.delivered{

background:#16a34a;

}

.cancelled{

background:#ef4444;

}

.item{

display:flex;

align-items:center;

justify-content:space-between;

gap:20px;

padding:15px 0;

border-top:1px solid #eee;

}

.item img{

width:90px;

height:90px;

object-fit:contain;

}

.info{

flex:1;

}

.info h4{

margin-bottom:8px;

font-size:18px;

}

.info p{

color:#666;

}

.item strong{

font-size:18px;

color:red;

}

.footer{

display:flex;

justify-content:space-between;

align-items:center;

margin-top:25px;

padding-top:20px;

border-top:1px solid #ddd;

}

.footer strong{

font-size:22px;

color:red;

}

.footer button{

padding:12px 24px;

border:none;

border-radius:10px;

background:#ef4444;

color:white;

cursor:pointer;

font-size:15px;

}

.footer button:hover{

background:#dc2626;

}
@media (max-width:900px){

.container{

padding:20px;

}

.header{

flex-direction:column;

align-items:flex-start;

gap:15px;

}

.footer{

flex-direction:column;

align-items:flex-start;

gap:15px;

}

}

@media (max-width:700px){

.item{

flex-direction:column;

text-align:center;

}

.item img{

width:120px;

height:120px;

}

.info{

width:100%;

}

.item strong{

margin-top:10px;

}

.footer{

text-align:center;

}

.footer button{

width:100%;

}

}

@media (max-width:480px){

h1{

text-align:center;

font-size:28px;

}

.order{

padding:18px;

}

.status{

width:100%;

text-align:center;

}

.item img{

width:90px;

height:90px;

}

.footer strong{

font-size:20px;

}

}

</style>