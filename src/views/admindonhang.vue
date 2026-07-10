<template>
  <div class="container">

    <h1>Quản lý đơn hàng</h1>

    <div
      v-if="loading"
      class="loading"
    >
      Đang tải dữ liệu...
    </div>

    <table
      v-else
    >

      <thead>

        <tr>

          <th>Mã đơn</th>

          <th>Khách hàng</th>

          <th>SĐT</th>

          <th>Tổng tiền</th>

          <th>Thanh toán</th>

          <th>Trạng thái</th>

          <th>Cập nhật</th>

          <th>Chi tiết</th>

        </tr>

      </thead>

      <tbody>

        <tr
          v-for="order in orders"
          :key="order._id"
        >

          <td>

            {{ order._id }}

          </td>

          <td>

            {{ order.shippingAddress.ten }}

          </td>

          <td>

            {{ order.shippingAddress.sodienthoai }}

          </td>

          <td>

            {{
              order.thanhTien.toLocaleString()
            }}
            đ

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
                ? 'Đã thanh toán'
                : 'Chưa thanh toán'
              }}

            </span>

          </td>

          <td>

            <select
              v-model="order.status"
            >

              <option value="pending">
                Chờ xác nhận
              </option>

              <option value="processing">
                Đang xử lý
              </option>

              <option value="shipped">
                Đang giao
              </option>

              <option value="delivered">
                Đã giao
              </option>

              <option value="cancelled">
                Đã hủy
              </option>

            </select>

          </td>

          <td>

            <button
              class="save"
              @click="update(order)"
            >
              Lưu
            </button>

          </td>

          <td>

            <button
              class="detail"
              @click="detail(order)"
            >
              Xem
            </button>

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

const loading=
ref(true);

const orders=
ref([]);

const loadOrders=
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

}
catch(err){

console.log(err.response);

console.log(err.response?.data);

}

finally{

loading.value=false;

}

};
const update =
async(order)=>{

try{

await axios.put(
`/dathang/admin/${order._id}/status`,

{
status:
order.status,
},

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

loadOrders();

}
catch(err){

alert(
err.response?.data?.message
);

}

};

const detail=
(order)=>{

let text="";

order.items.forEach(

(item,index)=>{

text+=

`${index+1}. ${item.ten}

SL: ${item.soluong}

Giá: ${item.gia.toLocaleString()} đ

--------------------

`;

}

);

alert(

`Khách hàng:

${order.shippingAddress.ten}

SĐT:

${order.shippingAddress.sodienthoai}

Địa chỉ:

${order.shippingAddress.diachi}

-------------------------

${text}

Tổng tiền:

${order.thanhTien.toLocaleString()} đ`

);

};

onMounted(
loadOrders
);

</script>

<style scoped>

.container{

padding:40px;

}

.loading{

text-align:center;

padding:80px;

font-size:20px;

}

table{

width:100%;

border-collapse:collapse;

margin-top:25px;

}

th{

background:#111827;

color:white;

}

th,
td{

padding:14px;

border:1px solid #ddd;

text-align:center;

}

select{

padding:10px;

border-radius:8px;

border:1px solid #ddd;

}
.paid{

color:#16a34a;

font-weight:bold;

}

.unpaid{

color:#ef4444;

font-weight:bold;

}

.save{

background:#2563eb;

color:white;

border:none;

padding:10px 18px;

border-radius:8px;

cursor:pointer;

}

.save:hover{

background:#1d4ed8;

}

.detail{

background:#16a34a;

color:white;

border:none;

padding:10px 18px;

border-radius:8px;

cursor:pointer;

}

.detail:hover{

background:#15803d;

}

.status-pending{

color:#f59e0b;

font-weight:bold;

}

.status-processing{

color:#3b82f6;

font-weight:bold;

}

.status-shipped{

color:#8b5cf6;

font-weight:bold;

}

.status-delivered{

color:#16a34a;

font-weight:bold;

}

.status-cancelled{

color:#ef4444;

font-weight:bold;

}

table tbody tr:hover{

background:#f9fafb;

transition:.3s;

}
button{

transition:.3s;

}

button:hover{

opacity:.9;

}

select:focus{

outline:none;

border:1px solid #2563eb;

box-shadow:0 0 5px rgba(37,99,235,.3);

}

thead{

position:sticky;

top:0;

z-index:2;

}

tbody tr:nth-child(even){

background:#fafafa;

}

tbody tr td{

vertical-align:middle;

}

.container h1{

margin-bottom:30px;

}

@media(max-width:1200px){

.container{

overflow-x:auto;

}

table{

min-width:1100px;

}

}

@media(max-width:768px){

.container{

padding:20px;

}

h1{

font-size:28px;

}

th,
td{

padding:10px;

font-size:14px;

}

.save,
.detail{

padding:8px 12px;

font-size:13px;

}

select{

padding:8px;

font-size:13px;

}

}

@media(max-width:480px){

.loading{

font-size:16px;

padding:40px;

}

}
@media print{

button,
select{

display:none;

}

.container{

padding:0;

}

table{

font-size:12px;

}

th{

background:#000 !important;

color:#fff !important;

}

}

::-webkit-scrollbar{

height:10px;

width:10px;

}

::-webkit-scrollbar-track{

background:#f3f4f6;

}

::-webkit-scrollbar-thumb{

background:#9ca3af;

border-radius:20px;

}

::-webkit-scrollbar-thumb:hover{

background:#6b7280;

}

</style>