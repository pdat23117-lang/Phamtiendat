<template>
  <section class="hero">

    <div class="content">

      <h1>
        DAT MOBILE
      </h1>

      <p>
        Hệ thống bán điện thoại chính hãng,
        giá tốt, bảo hành uy tín trên toàn quốc.
      </p>

      <RouterLink
        to="/sanpham"
      >
        <button>
          Mua ngay
        </button>
      </RouterLink>

    </div>

    <div class="image">

      <img
        src="/images/baner.webp"
        alt="Banner"
      />

    </div>

  </section>
</template>

<script setup>
</script>

<style scoped>

.hero{

display:grid;

grid-template-columns:1fr 1fr;

align-items:center;

padding:80px 60px;

background:#f8fafc;

min-height:600px;

}

.content h1{

font-size:60px;

margin-bottom:20px;

color:#111827;

}

.content p{

font-size:20px;

line-height:1.8;

color:#555;

margin-bottom:35px;

max-width:500px;

}

button{

padding:16px 35px;

background:#111827;

color:white;

border:none;

border-radius:10px;

font-size:18px;

cursor:pointer;

transition:.3s;

}

button:hover{

background:black;

transform:translateY(-2px);

}

.image{

display:flex;

justify-content:center;

}

.image img{

width:100%;

max-width:550px;

object-fit:contain;

animation:float 3s infinite ease-in-out;

}

@keyframes float{

0%{

transform:translateY(0);

}

50%{

transform:translateY(-15px);

}

100%{

transform:translateY(0);

}

}

@media(max-width:900px){

.hero{

grid-template-columns:1fr;

text-align:center;

padding:50px 20px;

}

.content{

margin-bottom:40px;

}

.content p{

max-width:100%;

}

.content h1{

font-size:42px;

}

.image img{

max-width:350px;

}

}

</style>