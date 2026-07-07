<template>
  <div class="container">

    <h1>Thống kê hệ thống</h1>

    <div class="grid">

      <div class="card">
        <h3>Tổng sản phẩm</h3>
        <h2>{{ products }}</h2>
      </div>

      <div class="card">
        <h3>Tổng người dùng</h3>
        <h2>{{ users }}</h2>
      </div>

      <div class="card">
        <h3>Tổng đơn hàng</h3>
        <h2>{{ orders }}</h2>
      </div>

      <div class="card">
        <h3>Đơn chờ xử lý</h3>
        <h2>{{ pending }}</h2>
      </div>

      <div class="card">
        <h3>Đơn đã giao</h3>
        <h2>{{ delivered }}</h2>
      </div>

      <div class="card revenue">
        <h3>Doanh thu</h3>

        <h1>
          {{ revenue.toLocaleString() }} đ
        </h1>

      </div>

    </div>

  </div>
</template>

<script setup>
import axios from "axios";
import {
ref,
onMounted,
} from "vue";

const token=
localStorage.getItem(
"token"
);

const products=ref(0);
const users=ref(0);
const orders=ref(0);
const pending=ref(0);
const delivered=ref(0);
const revenue=ref(0);

const loadData=
async()=>{

try{

const sp=
await axios.get(
"http://localhost:5000/api/sanpham"
);

products.value=
sp.data.products.length;

const us=
await axios.get(
"http://localhost:5000/api/auth/users",
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

users.value=
us.data.length;

const od=
await axios.get(
"http://localhost:5000/api/dathang/admin/all",
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

orders.value=
od.data.length;

pending.value=
od.data.filter(
i=>i.status==="pending"
).length;

delivered.value=
od.data.filter(
i=>i.status==="delivered"
).length;

revenue.value=
od.data
.filter(
i=>i.status==="delivered"
)
.reduce(
(sum,i)=>
sum+i.thanhTien,
0
);

}
catch(err){

console.log(err);

}

};

onMounted(
loadData
);

</script>

<style scoped>

.container{
padding:40px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:25px;
}

.card{
background:white;
padding:30px;
border-radius:12px;
box-shadow:0 3px 10px rgba(0,0,0,.08);
text-align:center;
}

.card h3{
margin-bottom:20px;
color:#666;
}

.card h2{
font-size:40px;
}

.revenue{
background:#111827;
color:white;
}

.revenue h3{
color:#ddd;
}

.revenue h1{
font-size:38px;
}

</style>