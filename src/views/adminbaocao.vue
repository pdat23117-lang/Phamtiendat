<template>
  <div class="container">

    <h1>Báo cáo hệ thống</h1>

    <div class="cards">

      <div class="card">
        <h3>Tổng sản phẩm</h3>
        <p>{{ report.products }}</p>
      </div>

      <div class="card">
        <h3>Tổng người dùng</h3>
        <p>{{ report.users }}</p>
      </div>

      <div class="card">
        <h3>Tổng đơn hàng</h3>
        <p>{{ report.orders }}</p>
      </div>

      <div class="card">
        <h3>Đơn đã giao</h3>
        <p>{{ report.delivered }}</p>
      </div>

      <div class="card">
        <h3>Đơn đã hủy</h3>
        <p>{{ report.cancelled }}</p>
      </div>

      <div class="card revenue">
        <h3>Tổng doanh thu</h3>
        <h2>{{ report.revenue.toLocaleString() }} đ</h2>
      </div>

    </div>

    <button
      class="print"
      @click="window.print()"
    >
      In báo cáo
    </button>

  </div>
</template>

<script setup>
import axios from "axios";
import {
ref,
onMounted,
} from "vue";

const token =
localStorage.getItem("token");

const report = ref({
products:0,
users:0,
orders:0,
delivered:0,
cancelled:0,
revenue:0,
});

const loadReport =
async()=>{

try{

const sp =
await axios.get(
"http://localhost:5000/api/sanpham"
);

report.value.products =
sp.data.products.length;

const us =
await axios.get(
"http://localhost:5000/api/auth/users",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

report.value.users =
us.data.length;

const od =
await axios.get(
"http://localhost:5000/api/dathang/admin/all",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

report.value.orders =
od.data.length;

report.value.delivered =
od.data.filter(
i=>i.status==="delivered"
).length;

report.value.cancelled =
od.data.filter(
i=>i.status==="cancelled"
).length;

report.value.revenue =
od.data
.filter(
i=>i.status==="delivered"
)
.reduce(
(sum,i)=>sum+i.thanhTien,
0
);

}
catch(err){

console.log(err);

}

};

onMounted(loadReport);

</script>

<style scoped>

.container{
padding:40px;
}

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:25px;
margin-top:30px;
}

.card{
background:white;
padding:30px;
border-radius:12px;
box-shadow:0 3px 10px rgba(0,0,0,.1);
text-align:center;
}

.card h3{
margin-bottom:20px;
}

.card p{
font-size:36px;
font-weight:bold;
}

.revenue{
background:#111827;
color:white;
}

.revenue h2{
font-size:34px;
margin-top:20px;
}

.print{
margin-top:40px;
padding:15px 30px;
border:none;
border-radius:10px;
background:#2563eb;
color:white;
cursor:pointer;
font-size:16px;
}

.print:hover{
background:#1d4ed8;
}

@media print{

.print{
display:none;
}

}

</style>