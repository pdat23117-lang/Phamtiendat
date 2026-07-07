<template>
  <div id="app">

    <Navbar />

    <main class="main">

      <RouterView />

    </main>

    <Footer />

  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial,Helvetica,sans-serif;
}

body{
background:#f5f5f5;
color:#222;
}

a{
text-decoration:none;
}

button{
cursor:pointer;
}

.main{
min-height:80vh;
}

::-webkit-scrollbar{
width:10px;
height:10px;
}

::-webkit-scrollbar-track{
background:#f3f4f6;
}

::-webkit-scrollbar-thumb{
background:#9ca3af;
border-radius:10px;
}

::-webkit-scrollbar-thumb:hover{
background:#6b7280;
}

</style>