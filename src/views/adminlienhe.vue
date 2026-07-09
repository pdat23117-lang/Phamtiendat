<template>
  <div class="container">

    <h1>Quản lý liên hệ</h1>

    <table>

      <thead>

        <tr>

          <th>Họ tên</th>

          <th>Email</th>

          <th>SĐT</th>

          <th>Tiêu đề</th>

          <th>Trạng thái</th>

          <th>Ngày gửi</th>

          <th>Chi tiết</th>

          <th>Xóa</th>

        </tr>

      </thead>

      <tbody>

        <tr
          v-for="item in contacts"
          :key="item._id"
        >

          <td>{{ item.hoTen }}</td>

          <td>{{ item.email }}</td>

          <td>{{ item.soDienThoai }}</td>

          <td>{{ item.tieuDe }}</td>

          <td>

            <select
              v-model="item.trangThai"
              @change="update(item)"
            >

              <option value="chuaxuly">
                Chưa xử lý
              </option>

              <option value="daxuly">
                Đã xử lý
              </option>

            </select>

          </td>

          <td>
            {{ formatDate(item.createdAt) }}
          </td>

          <td>

            <button
              class="view"
              @click="detail(item)"
            >
              Xem
            </button>

          </td>

          <td>

            <button
              class="delete"
              @click="remove(item._id)"
            >
              Xóa
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

const contacts=
ref([]);

const loadData=
async()=>{

try{

const res=
await axios.get(
"/lienhe/admin",
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

contacts.value=
res.data;

}
catch(err){

console.log(err);

}

};

const update=
async(item)=>{

try{

await axios.put(
`/lienhe/admin/${item._id}`,
{
trangThai:
item.trangThai,
},
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

}
catch(err){

alert(
err.response?.data?.message
);

}

};

const remove=
async(id)=>{

if(
!confirm(
"Bạn muốn xóa?"
)
)
return;

try{

await axios.delete(
`/lienhe/admin/${id}`,
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

loadData();

}
catch(err){

alert(
err.response?.data?.message
);

}

};

const detail=(item)=>{

alert(

`Tiêu đề: ${item.tieuDe}

Nội dung:

${item.noiDung}`

);

};

const formatDate=
(date)=>{

return new Date(
date
).toLocaleString(
"vi-VN"
);

};

onMounted(
loadData
);

</script>

<style scoped>

.container{
padding:40px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:25px;
}

th,
td{
border:1px solid #ddd;
padding:14px;
text-align:center;
}

th{
background:black;
color:white;
}

select{
padding:8px;
}

button{
border:none;
padding:10px 18px;
border-radius:8px;
cursor:pointer;
}

.view{
background:#2563eb;
color:white;
}

.delete{
background:red;
color:white;
}

button:hover{
opacity:.9;
}

</style>