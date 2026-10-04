<template>
  <div class="admin">

    <!-- =========================
         SIDEBAR
    ========================== -->
    <aside class="sidebar">

      <!-- LOGO -->
      <div class="logo">
        <div class="logo-icon">
          📱
        </div>

        <div>
          <h2>DAT MOBILE</h2>
          <span>QUẢN TRỊ HỆ THỐNG</span>
        </div>
      </div>


      <!-- MENU -->
      <nav class="menu">

        <p class="menu-title">
          TỔNG QUAN
        </p>

        <RouterLink
          to="/admin"
          class="menu-item"
        >
          <span class="icon">📊</span>
          <span>Dashboard</span>
        </RouterLink>


        <p class="menu-title">
          QUẢN LÝ
        </p>

        <RouterLink
          to="/adminsanpham"
          class="menu-item"
        >
          <span class="icon">📱</span>
          <span>Quản lý sản phẩm</span>
        </RouterLink>


        <RouterLink
          to="/admindonhang"
          class="menu-item"
        >
          <span class="icon">📦</span>
          <span>Quản lý đơn hàng</span>
        </RouterLink>


        <RouterLink
          to="/adminuser"
          class="menu-item"
        >
          <span class="icon">👥</span>
          <span>Quản lý người dùng</span>
        </RouterLink>


        <RouterLink
          to="/admindanhgia"
          class="menu-item"
        >
          <span class="icon">⭐</span>
          <span>Quản lý đánh giá</span>
        </RouterLink>


        <RouterLink
          to="/adminlienhe"
          class="menu-item"
        >
          <span class="icon">💬</span>
          <span>Liên hệ</span>
        </RouterLink>


        <p class="menu-title">
          BÁO CÁO
        </p>

        <RouterLink
          to="/adminthongke"
          class="menu-item"
        >
          <span class="icon">📈</span>
          <span>Thống kê</span>
        </RouterLink>


        <RouterLink
          to="/adminbaocao"
          class="menu-item"
        >
          <span class="icon">📄</span>
          <span>Báo cáo</span>
        </RouterLink>


        <RouterLink
          to="/admindoanhthu"
          class="menu-item"
        >
          <span class="icon">💰</span>
          <span>Doanh thu</span>
        </RouterLink>

      </nav>


      <!-- TRANG CHỦ -->
      <div class="sidebar-bottom">

        <RouterLink
          to="/"
          class="home-button"
        >
          🏠
          <span>Về trang chủ</span>
        </RouterLink>

      </div>

    </aside>


    <!-- =========================
         MAIN CONTENT
    ========================== -->
    <main class="content">


      <!-- HEADER -->
      <div class="page-header">

        <div>
          <p class="welcome">
            Xin chào, Admin 👋
          </p>

          <h1>
            Dashboard
          </h1>

          <p class="subtitle">
            Tổng quan hoạt động của DAT MOBILE
          </p>
        </div>


        <button
          class="refresh-button"
          @click="loadDashboard"
          :disabled="loading"
        >
          <span
            :class="{ rotate: loading }"
          >
            🔄
          </span>

          Làm mới
        </button>

      </div>


      <!-- =========================
           LOADING
      ========================== -->
      <div
        v-if="loading"
        class="loading"
      >
        <div class="spinner"></div>

        <p>
          Đang tải dữ liệu...
        </p>
      </div>


      <!-- =========================
           DASHBOARD
      ========================== -->
      <template v-else>


        <!-- =========================
             THỐNG KÊ CHÍNH
        ========================== -->
        <section class="stats-grid">


          <!-- SẢN PHẨM -->
          <div class="stat-card blue">

            <div class="stat-top">

              <div>
                <p>
                  Sản phẩm
                </p>

                <h2>
                  {{ thongKe.products }}
                </h2>
              </div>

              <div class="stat-icon">
                📱
              </div>

            </div>

            <div class="stat-bottom">
              Tổng sản phẩm trong hệ thống
            </div>

          </div>


          <!-- NGƯỜI DÙNG -->
          <div class="stat-card purple">

            <div class="stat-top">

              <div>
                <p>
                  Người dùng
                </p>

                <h2>
                  {{ thongKe.users }}
                </h2>
              </div>

              <div class="stat-icon">
                👥
              </div>

            </div>

            <div class="stat-bottom">
              Tài khoản khách hàng
            </div>

          </div>


          <!-- ĐƠN HÀNG -->
          <div class="stat-card orange">

            <div class="stat-top">

              <div>
                <p>
                  Đơn hàng
                </p>

                <h2>
                  {{ thongKe.orders }}
                </h2>
              </div>

              <div class="stat-icon">
                📦
              </div>

            </div>

            <div class="stat-bottom">
              Tổng đơn hàng
            </div>

          </div>


          <!-- DOANH THU -->
          <div class="stat-card green">

            <div class="stat-top">

              <div>
                <p>
                  Doanh thu
                </p>

                <h2 class="revenue">
                  {{ formatMoney(thongKe.revenue) }}
                </h2>
              </div>

              <div class="stat-icon">
                💰
              </div>

            </div>

            <div class="stat-bottom">
              Doanh thu từ đơn đã giao
            </div>

          </div>

        </section>


        <!-- =========================
             TRẠNG THÁI ĐƠN HÀNG
        ========================== -->
        <div class="section-header">

          <div>
            <h2>
              Trạng thái đơn hàng
            </h2>

            <p>
              Theo dõi tình trạng xử lý đơn hàng
            </p>
          </div>

        </div>


        <section class="order-grid">


          <!-- CHỜ XỬ LÝ -->
          <div class="order-card pending">

            <div class="order-icon">
              ⏳
            </div>

            <div class="order-info">

              <span>
                Chờ xử lý
              </span>

              <strong>
                {{ thongKe.pending }}
              </strong>

            </div>

          </div>


          <!-- ĐANG XỬ LÝ -->
          <div class="order-card processing">

            <div class="order-icon">
              ⚙️
            </div>

            <div class="order-info">

              <span>
                Đang xử lý
              </span>

              <strong>
                {{ thongKe.processing }}
              </strong>

            </div>

          </div>


          <!-- ĐANG GIAO -->
          <div class="order-card shipping">

            <div class="order-icon">
              🚚
            </div>

            <div class="order-info">

              <span>
                Đang giao
              </span>

              <strong>
                {{ thongKe.shipping }}
              </strong>

            </div>

          </div>


          <!-- ĐÃ GIAO -->
          <div class="order-card delivered">

            <div class="order-icon">
              ✅
            </div>

            <div class="order-info">

              <span>
                Đã giao
              </span>

              <strong>
                {{ thongKe.delivered }}
              </strong>

            </div>

          </div>


          <!-- ĐÃ HỦY -->
          <div class="order-card cancelled">

            <div class="order-icon">
              ❌
            </div>

            <div class="order-info">

              <span>
                Đã hủy
              </span>

              <strong>
                {{ thongKe.cancelled }}
              </strong>

            </div>

          </div>

        </section>


        <!-- =========================
             QUICK ACTION
        ========================== -->
        <section class="quick-section">

          <div class="section-header">

            <div>
              <h2>
                Thao tác nhanh
              </h2>

              <p>
                Truy cập nhanh các chức năng quản trị
              </p>
            </div>

          </div>


          <div class="quick-grid">


            <RouterLink
              to="/adminsanpham"
              class="quick-card"
            >

              <span class="quick-icon blue-bg">
                📱
              </span>

              <div>
                <strong>
                  Quản lý sản phẩm
                </strong>

                <span>
                  Thêm, sửa, xóa sản phẩm
                </span>
              </div>

              <b>
                →
              </b>

            </RouterLink>


            <RouterLink
              to="/admindonhang"
              class="quick-card"
            >

              <span class="quick-icon orange-bg">
                📦
              </span>

              <div>
                <strong>
                  Quản lý đơn hàng
                </strong>

                <span>
                  Kiểm tra và xử lý đơn
                </span>
              </div>

              <b>
                →
              </b>

            </RouterLink>


            <RouterLink
              to="/adminuser"
              class="quick-card"
            >

              <span class="quick-icon purple-bg">
                👥
              </span>

              <div>
                <strong>
                  Quản lý người dùng
                </strong>

                <span>
                  Xem danh sách tài khoản
                </span>
              </div>

              <b>
                →
              </b>

            </RouterLink>


            <RouterLink
              to="/admindoanhthu"
              class="quick-card"
            >

              <span class="quick-icon green-bg">
                💰
              </span>

              <div>
                <strong>
                  Doanh thu
                </strong>

                <span>
                  Xem báo cáo doanh thu
                </span>
              </div>

              <b>
                →
              </b>

            </RouterLink>

          </div>

        </section>


      </template>

    </main>

  </div>
</template>


<script setup>

import axios from "axios";

import {
  ref,
  onMounted,
} from "vue";


/* =========================
   TOKEN
========================= */

const token =
  localStorage.getItem("token");


/* =========================
   LOADING
========================= */

const loading =
  ref(false);


/* =========================
   THỐNG KÊ
========================= */

const thongKe =
  ref({

    products: 0,

    users: 0,

    orders: 0,

    revenue: 0,

    pending: 0,

    processing: 0,

    shipping: 0,

    delivered: 0,

    cancelled: 0,

  });


/* =========================
   FORMAT TIỀN
========================= */

const formatMoney =
  (value) => {

    return Number(
      value || 0
    ).toLocaleString(
      "vi-VN"
    ) + " đ";

  };


/* =========================
   LOAD DASHBOARD
========================= */

const loadDashboard =
  async () => {

    loading.value = true;

    try {


      /* =========================
         SẢN PHẨM
      ========================== */

      const product =
        await axios.get(
          "/sanpham"
        );


      thongKe.value.products =
        Array.isArray(
          product.data?.products
        )
          ? product.data.products.length
          : 0;


      /* =========================
         NGƯỜI DÙNG
      ========================== */

      const user =
        await axios.get(
          "/auth/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      thongKe.value.users =
        Array.isArray(
          user.data
        )
          ? user.data.length
          : 0;


      /* =========================
         ĐƠN HÀNG
      ========================== */

      const order =
        await axios.get(
          "/dathang/admin/all",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const orders =
        Array.isArray(
          order.data
        )
          ? order.data
          : [];


      /* =========================
         TỔNG ĐƠN
      ========================== */

      thongKe.value.orders =
        orders.length;


      /* =========================
         CHỜ XÁC NHẬN
      ========================== */

      thongKe.value.pending =
        orders.filter(
          (item) =>
            item.status === "pending"
        ).length;


      /* =========================
         ĐANG XỬ LÝ
      ========================== */

      thongKe.value.processing =
        orders.filter(
          (item) =>
            item.status === "processing"
        ).length;


      /* =========================
         ĐANG GIAO
      ========================== */

      thongKe.value.shipping =
        orders.filter(
          (item) =>
            item.status === "shipping"
        ).length;


      /* =========================
         ĐÃ GIAO
      ========================== */

      thongKe.value.delivered =
        orders.filter(
          (item) =>
            item.status === "delivered"
        ).length;


      /* =========================
         ĐÃ HỦY
      ========================== */

      thongKe.value.cancelled =
        orders.filter(
          (item) =>
            item.status === "cancelled"
        ).length;


      /* =========================
         DOANH THU
         
         Chỉ tính đơn đã giao
      ========================== */

      thongKe.value.revenue =
        orders
          .filter(
            (item) =>
              item.status === "delivered"
          )
          .reduce(
            (sum, item) =>
              sum +
              Number(
                item.thanhTien || 0
              ),
            0
          );


      console.log(
        "Dashboard:",
        thongKe.value
      );


    }
    catch (err) {

      console.error(
        "Lỗi tải Dashboard:",
        err
      );

      console.error(
        err.response?.data
      );

    }
    finally {

      loading.value = false;

    }

  };


/* =========================
   KHỞI TẠO
========================= */

onMounted(
  loadDashboard
);

</script>


<style scoped>

/* =====================================
   TỔNG THỂ
===================================== */

.admin{

  display:flex;

  min-height:100vh;

  background:#f4f6fa;

  color:#111827;

}


/* =====================================
   SIDEBAR
===================================== */

.sidebar{

  width:270px;

  min-height:100vh;

  background:
    linear-gradient(
      180deg,
      #111827 0%,
      #0f172a 100%
    );

  padding:25px 18px;

  display:flex;

  flex-direction:column;

  position:sticky;

  top:0;

}


/* LOGO */

.logo{

  display:flex;

  align-items:center;

  gap:12px;

  padding:5px 10px 25px;

  border-bottom:
    1px solid
    rgba(255,255,255,.1);

  margin-bottom:20px;

}


.logo-icon{

  width:45px;

  height:45px;

  border-radius:12px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  display:flex;

  align-items:center;

  justify-content:center;

  font-size:22px;

}


.logo h2{

  color:white;

  margin:0;

  font-size:20px;

}


.logo span{

  display:block;

  margin-top:4px;

  color:#94a3b8;

  font-size:9px;

  letter-spacing:1px;

}


/* MENU */

.menu{

  display:flex;

  flex-direction:column;

  gap:5px;

}


.menu-title{

  color:#64748b;

  font-size:11px;

  font-weight:bold;

  letter-spacing:1px;

  margin:

    18px
    10px
    8px;

}


.menu-item{

  display:flex;

  align-items:center;

  gap:12px;

  padding:
    12px
    14px;

  color:#cbd5e1;

  text-decoration:none;

  border-radius:10px;

  font-size:14px;

  transition:
    .25s;

}


.menu-item .icon{

  width:25px;

  text-align:center;

  font-size:17px;

}


.menu-item:hover{

  background:
    rgba(255,255,255,.08);

  color:white;

  transform:
    translateX(3px);

}


.menu-item.router-link-active{

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color:white;

  box-shadow:
    0 5px 15px
    rgba(37,99,235,.25);

}


/* SIDEBAR BOTTOM */

.sidebar-bottom{

  margin-top:auto;

  padding-top:20px;

}


.home-button{

  display:flex;

  align-items:center;

  gap:10px;

  padding:13px;

  color:#cbd5e1;

  text-decoration:none;

  border-radius:10px;

  border:
    1px solid
    rgba(255,255,255,.1);

  transition:.25s;

}


.home-button:hover{

  background:
    rgba(255,255,255,.08);

  color:white;

}


/* =====================================
   CONTENT
===================================== */

.content{

  flex:1;

  padding:
    35px
    40px;

  min-width:0;

}


/* =====================================
   HEADER
===================================== */

.page-header{

  display:flex;

  justify-content:space-between;

  align-items:flex-end;

  margin-bottom:30px;

}


.welcome{

  margin:0 0 5px;

  color:#64748b;

  font-size:14px;

}


.page-header h1{

  margin:0;

  font-size:32px;

  font-weight:800;

}


.subtitle{

  margin:
    7px
    0
    0;

  color:#64748b;

}


.refresh-button{

  display:flex;

  align-items:center;

  gap:8px;

  border:none;

  background:white;

  color:#334155;

  padding:
    11px
    18px;

  border-radius:10px;

  box-shadow:
    0 2px 8px
    rgba(0,0,0,.06);

  cursor:pointer;

  font-weight:600;

  transition:.25s;

}


.refresh-button:hover{

  background:#eff6ff;

  color:#2563eb;

}


.refresh-button:disabled{

  opacity:.6;

  cursor:not-allowed;

}


.rotate{

  display:inline-block;

  animation:
    spin 1s linear infinite;

}


@keyframes spin{

  from{
    transform:rotate(0);
  }

  to{
    transform:rotate(360deg);
  }

}


/* =====================================
   MAIN STATS
===================================== */

.stats-grid{

  display:grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0,1fr)
    );

  gap:20px;

  margin-bottom:35px;

}


.stat-card{

  background:white;

  border-radius:16px;

  padding:23px;

  box-shadow:
    0 4px 15px
    rgba(15,23,42,.06);

  position:relative;

  overflow:hidden;

  transition:.25s;

}


.stat-card:hover{

  transform:
    translateY(-4px);

  box-shadow:
    0 10px 25px
    rgba(15,23,42,.1);

}


.stat-card::before{

  content:"";

  position:absolute;

  left:0;

  top:0;

  width:5px;

  height:100%;

}


.stat-card.blue::before{
  background:#2563eb;
}

.stat-card.purple::before{
  background:#7c3aed;
}

.stat-card.orange::before{
  background:#f59e0b;
}

.stat-card.green::before{
  background:#16a34a;
}


.stat-top{

  display:flex;

  justify-content:space-between;

  align-items:center;

}


.stat-top p{

  margin:0 0 8px;

  color:#64748b;

  font-size:14px;

  font-weight:600;

}


.stat-top h2{

  margin:0;

  font-size:32px;

  color:#0f172a;

}


.stat-top h2.revenue{

  font-size:25px;

}


.stat-icon{

  width:50px;

  height:50px;

  border-radius:14px;

  display:flex;

  align-items:center;

  justify-content:center;

  font-size:23px;

}


.blue .stat-icon{

  background:#dbeafe;

}

.purple .stat-icon{

  background:#ede9fe;

}

.orange .stat-icon{

  background:#fef3c7;

}

.green .stat-icon{

  background:#dcfce7;

}


.stat-bottom{

  margin-top:18px;

  padding-top:14px;

  border-top:
    1px solid
    #f1f5f9;

  color:#94a3b8;

  font-size:12px;

}


/* =====================================
   SECTION HEADER
===================================== */

.section-header{

  margin-bottom:18px;

}


.section-header h2{

  margin:0;

  font-size:21px;

}


.section-header p{

  margin:
    5px
    0
    0;

  color:#64748b;

  font-size:13px;

}


/* =====================================
   ORDER STATUS
===================================== */

.order-grid{

  display:grid;

  grid-template-columns:
    repeat(
      5,
      minmax(0,1fr)
    );

  gap:16px;

  margin-bottom:35px;

}


.order-card{

  background:white;

  border-radius:14px;

  padding:20px;

  display:flex;

  align-items:center;

  gap:15px;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

  transition:.25s;

}


.order-card:hover{

  transform:
    translateY(-3px);

}


.order-icon{

  width:45px;

  height:45px;

  border-radius:12px;

  display:flex;

  align-items:center;

  justify-content:center;

  font-size:20px;

}


.order-info{

  display:flex;

  flex-direction:column;

  gap:4px;

}


.order-info span{

  color:#64748b;

  font-size:13px;

}


.order-info strong{

  font-size:25px;

}


.order-card.pending{

  border-left:
    4px solid
    #f59e0b;

}

.pending .order-icon{

  background:#fef3c7;

}


.order-card.processing{

  border-left:
    4px solid
    #3b82f6;

}

.processing .order-icon{

  background:#dbeafe;

}


.order-card.shipping{

  border-left:
    4px solid
    #8b5cf6;

}

.shipping .order-icon{

  background:#ede9fe;

}


.order-card.delivered{

  border-left:
    4px solid
    #16a34a;

}

.delivered .order-icon{

  background:#dcfce7;

}


.order-card.cancelled{

  border-left:
    4px solid
    #ef4444;

}

.cancelled .order-icon{

  background:#fee2e2;

}


/* =====================================
   QUICK ACTION
===================================== */

.quick-section{

  margin-top:10px;

}


.quick-grid{

  display:grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0,1fr)
    );

  gap:16px;

}


.quick-card{

  background:white;

  border-radius:14px;

  padding:18px;

  display:flex;

  align-items:center;

  gap:13px;

  text-decoration:none;

  color:#111827;

  box-shadow:
    0 3px 12px
    rgba(15,23,42,.05);

  transition:.25s;

}


.quick-card:hover{

  transform:
    translateY(-3px);

  box-shadow:
    0 8px 20px
    rgba(15,23,42,.1);

}


.quick-icon{

  min-width:45px;

  width:45px;

  height:45px;

  border-radius:12px;

  display:flex;

  align-items:center;

  justify-content:center;

  font-size:20px;

}


.blue-bg{

  background:#dbeafe;

}

.orange-bg{

  background:#fef3c7;

}

.purple-bg{

  background:#ede9fe;

}

.green-bg{

  background:#dcfce7;

}


.quick-card div{

  display:flex;

  flex-direction:column;

  gap:4px;

  flex:1;

}


.quick-card strong{

  font-size:13px;

}


.quick-card div span{

  color:#64748b;

  font-size:11px;

}


.quick-card b{

  color:#94a3b8;

  font-size:20px;

}


/* =====================================
   LOADING
===================================== */

.loading{

  min-height:400px;

  display:flex;

  flex-direction:column;

  justify-content:center;

  align-items:center;

  color:#64748b;

}


.spinner{

  width:40px;

  height:40px;

  border:
    4px solid
    #e2e8f0;

  border-top-color:
    #2563eb;

  border-radius:50%;

  animation:
    spin .8s linear infinite;

  margin-bottom:15px;

}


/* =====================================
   RESPONSIVE
===================================== */

@media(max-width:1200px){

  .stats-grid{

    grid-template-columns:
      repeat(2,1fr);

  }

  .order-grid{

    grid-template-columns:
      repeat(3,1fr);

  }

  .quick-grid{

    grid-template-columns:
      repeat(2,1fr);

  }

}


@media(max-width:900px){

  .admin{

    flex-direction:column;

  }


  .sidebar{

    position:relative;

    width:100%;

    min-height:auto;

  }


  .menu{

    display:grid;

    grid-template-columns:
      repeat(2,1fr);

  }


  .menu-title{

    grid-column:
      1 / -1;

  }


  .sidebar-bottom{

    margin-top:15px;

  }


  .content{

    padding:25px 20px;

  }

}


@media(max-width:600px){

  .page-header{

    flex-direction:column;

    align-items:flex-start;

    gap:15px;

  }


  .stats-grid{

    grid-template-columns:1fr;

  }


  .order-grid{

    grid-template-columns:1fr;

  }


  .quick-grid{

    grid-template-columns:1fr;

  }


  .menu{

    grid-template-columns:1fr;

  }


  .page-header h1{

    font-size:27px;

  }

}

</style>