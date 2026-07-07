<template>
  <div class="container">

    <h1>Quản lý đánh giá</h1>

    <table>

      <thead>

        <tr>

          <th>Sản phẩm</th>

          <th>Người đánh giá</th>

          <th>Số sao</th>

          <th>Bình luận</th>

          <th>Phản hồi</th>

          <th>Lưu</th>

          <th>Xóa</th>

        </tr>

      </thead>

      <tbody>

        <tr
          v-for="review in reviews"
          :key="review._id"
        >

          <td>

            {{ review.productName }}

          </td>

          <td>

            {{ review.name }}

          </td>

          <td>

            ⭐ {{ review.rating }}

          </td>

          <td>

            {{ review.comment }}

          </td>

          <td>

            <textarea
              v-model="review.adminReply"
            ></textarea>

          </td>

          <td>

            <button
              class="save"
              @click="reply(review)"
            >
              Lưu
            </button>

          </td>

          <td>

            <button
              class="delete"
              @click="remove(review)"
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

const reviews=
ref([]);

const loadData=
async()=>{

try{

const res=
await axios.get(
"http://localhost:5000/api/sanpham/admin/reviews",
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

reviews.value=
res.data;

}
catch(err){

console.log(err);

}

};

const reply=
async(review)=>{

try{

await axios.put(

`http://localhost:5000/api/sanpham/admin/${review.productId}/reviews/${review._id}/reply`,

{
reply:
review.adminReply,
},

{
headers:{
Authorization:
`Bearer ${token}`,
},
}

);

alert(
"Đã phản hồi"
);

}
catch(err){

alert(
err.response?.data?.message
);

}

};

const remove=
async(review)=>{

if(
!confirm(
"Xóa đánh giá?"
)
)
return;

try{

await axios.delete(

`http://localhost:5000/api/sanpham/admin/${review.productId}/reviews/${review._id}`,

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
}

th,
td{
border:1px solid #ddd;
padding:12px;
text-align:center;
}

th{
background:black;
color:white;
}

textarea{
width:220px;
height:80px;
padding:10px;
resize:none;
}

button{
border:none;
padding:10px 18px;
border-radius:8px;
cursor:pointer;
}

.save{
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