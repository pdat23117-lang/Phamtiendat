<template>

<div class="container">

<h1>Đánh giá sản phẩm</h1>

<select v-model="star">

<option :value="5">⭐⭐⭐⭐⭐</option>

<option :value="4">⭐⭐⭐⭐</option>

<option :value="3">⭐⭐⭐</option>

<option :value="2">⭐⭐</option>

<option :value="1">⭐</option>

</select>

<textarea
v-model="comment"
placeholder="Nhận xét..."
></textarea>

<button
@click="gui"
>
Gửi đánh giá
</button>

</div>

</template>

<script setup>

import axios from "axios";

import {ref} from "vue";

import {useRoute,useRouter} from "vue-router";

const route=useRoute();
console.log(route.params);
console.log(route.params.productId);

const router=useRouter();

const star=ref(5);

const comment=ref("");

const token=localStorage.getItem("token");

const gui = async () => {

  try {

    await axios.post(

`/sanpham/${route.params.productId}/reviews`,

{
    rating: star.value,
    comment: comment.value,
},

{
    headers:{
        Authorization:`Bearer ${token}`,
    },
}

);

    alert("Đánh giá thành công");

    router.push("/LichSuDonHang");

  } catch (err) {

    console.log(err.response);

    alert(err.response?.data?.message);

  }

};

</script>