<template>
  <footer class="footer">

    <div class="container">

      <div class="box">

        <h2>DAT MOBILE</h2>

        <p>
          Chuyên cung cấp điện thoại chính hãng với
          giá tốt, bảo hành uy tín trên toàn quốc.
        </p>

      </div>

      <div class="box">

        <h3>Liên kết</h3>

        <RouterLink to="/">
          Trang chủ
        </RouterLink>

        <RouterLink to="/sanpham">
          Sản phẩm
        </RouterLink>

        <RouterLink to="/giohang">
          Giỏ hàng
        </RouterLink>

        <RouterLink to="/lienhe">
          Liên hệ
        </RouterLink>

      </div>

      <div class="box">

        <h3>Thông tin</h3>

        <p>📍 Hà Nội</p>

        <p>📞 0123456789</p>

        <p>✉ datmobile@gmail.com</p>

      </div>

      <div class="box">

        <h3>Theo dõi</h3>

        <div class="social">

          <a href="#">
            Facebook
          </a>

          <a href="#">
            TikTok
          </a>

          <a href="#">
            Youtube
          </a>

        </div>

      </div>

    </div>

    <div class="copyright">

      © 2026 DAT MOBILE. All Rights Reserved.

    </div>

  </footer>
</template>

<script setup>
</script>

<style scoped>

.footer{

background:#111827;

color:white;

margin-top:60px;

}

.container{

display:grid;

grid-template-columns:

repeat(auto-fit,minmax(250px,1fr));

gap:40px;

padding:50px;

}

.box{

display:flex;

flex-direction:column;

gap:12px;

}

.box h2,
.box h3{

margin-bottom:10px;

}

.box a{

color:#ddd;

text-decoration:none;

transition:.3s;

}

.box a:hover{

color:white;

padding-left:6px;

}

.social{

display:flex;

flex-direction:column;

gap:10px;

}

.copyright{

border-top:1px solid #374151;

text-align:center;

padding:20px;

color:#ccc;

font-size:14px;

}

@media(max-width:768px){

.container{

grid-template-columns:1fr;

padding:30px;

text-align:center;

}

.social{

align-items:center;

}

}

</style>