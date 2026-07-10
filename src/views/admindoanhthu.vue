<template>
  <div class="container">

    <h1>Quản lý doanh thu</h1>

    <div class="top">

      <div class="card">
        <h3>Tổng doanh thu</h3>

        <h2>
          {{ doanhThu.toLocaleString() }} đ
        </h2>
      </div>

      <div class="card">
        <h3>Đơn hoàn thành</h3>

        <h2>
          {{ donHoanThanh }}
        </h2>
      </div>

      <div class="card">
        <h3>Đơn đã hủy</h3>

        <h2>
          {{ donHuy }}
        </h2>
      </div>

    </div>

    <table>

      <thead>

        <tr>

          <th>Mã đơn</th>

          <th>Khách hàng</th>

          <th>Ngày đặt</th>

          <th>Thanh toán</th>

          <th>Trạng thái</th>

          <th>Thành tiền</th>

        </tr>

      </thead>

      <tbody>

        <tr
          v-for="order in orders"
          :key="order._id"
        >

          <td>{{ order._id }}</td>

          <td>
            {{ order.shippingAddress.ten }}
          </td>

          <td>
            {{ formatDate(order.createdAt) }}
          </td>

          <td>

            <span
              :class="
                order.isPaid
                ? 'paid'
                : 'unpaid'
              "
            >
              {{
                order.isPaid
                ? "Đã thanh toán"
                : "Chưa thanh toán"
              }}
            </span>

          </td>

          <td>

            {{ order.status }}

          </td>

          <td>

            {{
              order.thanhTien.toLocaleString()
            }}
            đ

          </td>

        </tr>

      </tbody>

    </table>

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

const orders=
ref([]);

const doanhThu=
ref(0);

const donHoanThanh=
ref(0);

const donHuy=
ref(0);

const loadData=
async()=>{

try{

const res=
await axios.get(

"/dathang/admin/all",

{
headers:{
Authorization:
`Bearer ${token}`,
},
}

);

orders.value=
res.data;

donHoanThanh.value=
orders.value.filter(
i=>i.status==="delivered"
).length;

donHuy.value=
orders.value.filter(
i=>i.status==="cancelled"
).length;

doanhThu.value=
orders.value
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

const formatDate=
(date)=>{

return new Date(
date
).toLocaleString(
"vi-VN"
);

};

onMounted(loadData);

</script>

<style scoped>

.container{
padding:40px;
}

.top{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:20px;
margin-bottom:35px;
}

.card{
background:white;
padding:25px;
border-radius:12px;
text-align:center;
box-shadow:0 2px 8px rgba(0,0,0,.1);
}

.card h2{
margin-top:15px;
font-size:34px;
}

table{
width:100%;
border-collapse:collapse;
}

th{
background:#111827;
color:white;
}

th,
td{
padding:15px;
border:1px solid #ddd;
text-align:center;
}

.paid{
color:green;
font-weight:bold;
}

.unpaid{
color:red;
font-weight:bold;
}

</style>