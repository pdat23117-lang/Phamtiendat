<template>
  <div class="container">

    <div class="top">

      <h1>Quản lý sản phẩm</h1>

      <button
        class="add"
        @click="themSanPham"
      >
        + Thêm sản phẩm
      </button>

    </div>

    <table>

      <thead>

        <tr>

          <th>Ảnh</th>
          <th>Tên</th>
          <th>Hãng</th>
          <th>Giá</th>
          <th>Tồn kho</th>
          <th>Nổi bật</th>
          <th>Sửa</th>
          <th>Xóa</th>

        </tr>

      </thead>

      <tbody>

        <tr
          v-for="sp in products"
          :key="sp._id"
        >

          <td>

            <img
              :src="sp.hinh"
            />

          </td>

          <td>{{ sp.ten }}</td>

          <td>{{ sp.hang }}</td>

          <td>
            {{ sp.gia.toLocaleString() }} đ
          </td>

          <td>{{ sp.stock }}</td>

          <td>

            <span
              v-if="sp.noibat"
            >
              ⭐
            </span>

          </td>

          <td>

            <button
              class="edit"
              @click="sua(sp)"
            >
              Sửa
            </button>

          </td>

          <td>

            <button
              class="delete"
              @click="xoa(sp._id)"
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

import {
  useRouter,
} from "vue-router";

const router =
useRouter();

const token =
localStorage.getItem(
"token"
);

const products =
ref([]);

const loadData =
async()=>{

  try{

    const res =
    await axios.get(
      "http://localhost:5000/api/sanpham"
    );

    products.value =
    res.data.products;

  }
  catch(err){

    console.log(err);

  }

};

const themSanPham=()=>{

  router.push(
    "/them-san-pham"
  );

};

const sua=(sp)=>{

  router.push(
    `/sua-san-pham/${sp._id}`
  );

};

const xoa=
async(id)=>{

  if(
    !confirm(
      "Xóa sản phẩm?"
    )
  ) return;

  try{

    await axios.delete(
      `http://localhost:5000/api/sanpham/${id}`,
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

onMounted(loadData);

</script>

<style scoped>

.container{
padding:40px;
}

.top{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:30px;
}

.add{
background:#16a34a;
color:white;
border:none;
padding:12px 22px;
border-radius:8px;
cursor:pointer;
}

table{
width:100%;
border-collapse:collapse;
}

th{
background:black;
color:white;
}

th,
td{
padding:15px;
border:1px solid #ddd;
text-align:center;
}

img{
width:80px;
height:80px;
object-fit:contain;
}

.edit{
background:#2563eb;
color:white;
border:none;
padding:10px 18px;
border-radius:8px;
cursor:pointer;
}

.delete{
background:red;
color:white;
border:none;
padding:10px 18px;
border-radius:8px;
cursor:pointer;
}

button:hover{
opacity:.9;
}

</style>