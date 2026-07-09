<template>

<div class="container">

<h1>Tất cả sản phẩm</h1>

<div class="toolbar">

<input
v-model="keyword"
placeholder="Tìm kiếm sản phẩm..."
>

<select v-model="hang">

<option value="">
Tất cả hãng
</option>

<option value="Apple">
Apple
</option>

<option value="Samsung">
Samsung
</option>

<option value="Xiaomi">
Xiaomi
</option>

</select>

<select v-model="sort">

<option value="">
Sắp xếp
</option>

<option value="asc">
Giá tăng dần
</option>

<option value="desc">
Giá giảm dần
</option>

</select>

</div>

<div
v-if="loading"
class="loading"
>

Đang tải dữ liệu...

</div>

<div
v-else
class="products"
>

<div
class="card"
v-for="sp in pageProducts"
:key="sp._id"
>

<img
:src="sp.hinh"
:alt="sp.ten"
@click="detail(sp._id)"
>

<h3>

{{ sp.ten }}

</h3>

<p>

{{ sp.hang }}

</p>

<h2>

{{ Number(sp.gia || 0).toLocaleString("vi-VN") }} đ

</h2>

<button
@click="detail(sp._id)"
>

Xem chi tiết

</button>

</div>

</div>

<div
v-if="!loading && filteredProducts.length>0"
class="pagination"
>

<button
@click="currentPage--"
:disabled="currentPage===1"
>

<<

</button>

<button
v-for="page in totalPages"
:key="page"
@click="currentPage=page"
:class="{
active:currentPage===page
}"
>

{{ page }}

</button>

<button
@click="currentPage++"
:disabled="currentPage===totalPages"
>

>>

</button>

</div>

<div
v-if="!loading && filteredProducts.length===0"
class="empty"
>

<h2>

Không tìm thấy sản phẩm

</h2>

</div>

</div>

</template>

<script setup>

import axios from "axios";

import {
ref,
computed,
watch,
onMounted
} from "vue";

import {
useRouter
} from "vue-router";

const router=useRouter();

const loading=ref(true);

const products=ref([]);

const keyword=ref("");

const hang=ref("");

const sort=ref("");

const currentPage=ref(1);

const perPage=8;

const loadData=async()=>{

try{

const res=

await axios.get(

"/sanpham"

);

products.value=

res.data.products;

}catch(err){

console.log(err);

}

loading.value=false;

};
const filteredProducts = computed(() => {

let data = [...products.value];

if (keyword.value) {

data = data.filter(item =>

item.ten
.toLowerCase()
.includes(
keyword.value
.toLowerCase()
)

);

}

if (hang.value) {

data = data.filter(item =>

item.hang === hang.value

);

}

if (sort.value === "asc") {

data.sort((a, b) =>

a.gia - b.gia

);

}

if (sort.value === "desc") {

data.sort((a, b) =>

b.gia - a.gia

);

}

return data;

});

const totalPages = computed(() => {

return Math.ceil(

filteredProducts.value.length /

perPage

);

});

const pageProducts = computed(() => {

const start =

(currentPage.value - 1)

*

perPage;

return filteredProducts.value.slice(

start,

start + perPage

);

});

watch(

[
keyword,
hang,
sort,
],

() => {

currentPage.value = 1;

}

);

const detail = (id) => {

router.push(

`/chitietsanpham/${id}`

);

};

onMounted(

loadData

);

</script>

<style scoped>

.container{

padding:40px;

max-width:1400px;

margin:auto;

}

h1{

margin-bottom:30px;

font-size:34px;

}

.toolbar{

display:flex;

gap:20px;

flex-wrap:wrap;

margin-bottom:35px;

}

.toolbar input{

flex:1;

min-width:250px;

padding:14px;

border:1px solid #ddd;

border-radius:10px;

font-size:15px;

}

.toolbar select{

padding:14px;

border:1px solid #ddd;

border-radius:10px;

font-size:15px;

}

.loading{

text-align:center;

padding:80px;

font-size:22px;

}

.products{

display:grid;

grid-template-columns:

repeat(

auto-fill,

minmax(260px,1fr)

);

gap:30px;

}
.card{

background:white;

border-radius:12px;

padding:20px;

box-shadow:0 2px 10px rgba(0,0,0,.08);

display:flex;

flex-direction:column;

align-items:center;

transition:.3s;

}

.card:hover{

transform:translateY(-5px);

box-shadow:0 8px 20px rgba(0,0,0,.15);

}

.card img{

width:200px;

height:200px;

object-fit:contain;

cursor:pointer;

margin-bottom:20px;

}

.card h3{

font-size:18px;

text-align:center;

margin-bottom:10px;

min-height:50px;

}

.card p{

color:#666;

margin-bottom:12px;

}

.card h2{

font-size:24px;

color:#ef4444;

margin-bottom:18px;

}

.card button{

width:100%;

padding:14px;

background:#111827;

color:white;

border:none;

border-radius:8px;

font-size:16px;

cursor:pointer;

transition:.3s;

}

.card button:hover{

background:#000;

}

.pagination{

display:flex;

justify-content:center;

align-items:center;

gap:10px;

margin-top:40px;

flex-wrap:wrap;

}

.pagination button{

min-width:45px;

height:45px;

border:none;

border-radius:8px;

background:#e5e7eb;

cursor:pointer;

font-size:16px;

font-weight:bold;

transition:.3s;

}

.pagination button:hover{

background:#d1d5db;

}

.pagination button.active{

background:#111827;

color:white;

}

.pagination button:disabled{

opacity:.5;

cursor:not-allowed;

}

.empty{

text-align:center;

padding:80px;

font-size:22px;

color:#666;

}

.empty h2{

margin-bottom:20px;

}
.empty p{

margin-top:10px;

color:#999;

}

@media(max-width:900px){

.container{

padding:20px;

}

.toolbar{

flex-direction:column;

}

.toolbar input,
.toolbar select{

width:100%;

}

.products{

grid-template-columns:

repeat(
auto-fill,
minmax(220px,1fr)
);

}

}

@media(max-width:600px){

h1{

font-size:28px;

text-align:center;

}

.card{

padding:15px;

}

.card img{

width:150px;

height:150px;

}

.card h3{

font-size:16px;

min-height:auto;

}

.card h2{

font-size:20px;

}

.card button{

padding:12px;

font-size:15px;

}

.pagination{

gap:8px;

}

.pagination button{

min-width:38px;

height:38px;

font-size:14px;

}

.empty{

padding:50px 20px;

font-size:18px;

}

}

</style>