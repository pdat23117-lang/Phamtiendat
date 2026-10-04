<template>
  <div class="admin-page">

    <!-- =========================
         SIDEBAR
    ========================== -->
    <aside class="sidebar">

      <div class="logo">
        <div class="logo-icon">
          📱
        </div>

        <div>
          <h2>DAT MOBILE</h2>
          <span>QUẢN TRỊ HỆ THỐNG</span>
        </div>
      </div>


      <nav class="menu">

        <p class="menu-title">
          TỔNG QUAN
        </p>

        <RouterLink
          to="/admin"
          class="menu-item"
        >
          <span>📊</span>
          Dashboard
        </RouterLink>


        <p class="menu-title">
          QUẢN LÝ
        </p>

        <RouterLink
          to="/adminsanpham"
          class="menu-item"
        >
          <span>📱</span>
          Quản lý sản phẩm
        </RouterLink>


        <RouterLink
          to="/admindonhang"
          class="menu-item"
        >
          <span>📦</span>
          Quản lý đơn hàng
        </RouterLink>


        <RouterLink
          to="/adminuser"
          class="menu-item active"
        >
          <span>👥</span>
          Quản lý người dùng
        </RouterLink>


        <RouterLink
          to="/admindanhgia"
          class="menu-item"
        >
          <span>⭐</span>
          Quản lý đánh giá
        </RouterLink>


        <RouterLink
          to="/adminlienhe"
          class="menu-item"
        >
          <span>💬</span>
          Liên hệ
        </RouterLink>


        <p class="menu-title">
          BÁO CÁO
        </p>

        <RouterLink
          to="/adminthongke"
          class="menu-item"
        >
          <span>📈</span>
          Thống kê
        </RouterLink>


        <RouterLink
          to="/adminbaocao"
          class="menu-item"
        >
          <span>📄</span>
          Báo cáo
        </RouterLink>


        <RouterLink
          to="/admindoanhthu"
          class="menu-item"
        >
          <span>💰</span>
          Doanh thu
        </RouterLink>

      </nav>


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
         CONTENT
    ========================== -->
    <main class="content">


      <!-- HEADER -->
      <div class="page-header">

        <div>

          <p class="welcome">
            Quản trị viên
          </p>

          <h1>
            Quản lý người dùng
          </h1>

          <p class="subtitle">
            Quản lý tài khoản và phân quyền người dùng trong hệ thống
          </p>

        </div>


        <button
          class="refresh-button"
          @click="loadUsers"
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
           THỐNG KÊ
      ========================== -->
      <div class="stats">


        <div class="stat-card">

          <div class="stat-icon blue">
            👥
          </div>

          <div>

            <span>
              Tổng người dùng
            </span>

            <strong>
              {{ users.length }}
            </strong>

          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon purple">
            👤
          </div>

          <div>

            <span>
              Tài khoản User
            </span>

            <strong>
              {{ totalUsers }}
            </strong>

          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon orange">
            🛡️
          </div>

          <div>

            <span>
              Quản trị viên
            </span>

            <strong>
              {{ totalAdmins }}
            </strong>

          </div>

        </div>

      </div>


      <!-- =========================
           BẢNG
      ========================== -->
      <section class="table-card">


        <div class="table-header">

          <div>

            <h2>
              Danh sách người dùng
            </h2>

            <p>
              {{ users.length }} tài khoản trong hệ thống
            </p>

          </div>


          <div class="search-box">

            🔍

            <input
              v-model="search"
              type="text"
              placeholder="Tìm theo tên hoặc email..."
            />

          </div>

        </div>


        <!-- LOADING -->
        <div
          v-if="loading"
          class="loading"
        >

          <div class="spinner"></div>

          <p>
            Đang tải danh sách người dùng...
          </p>

        </div>


        <!-- TABLE -->
        <div
          v-else
          class="table-wrapper"
        >

          <table>

            <thead>

              <tr>

                <th>
                  STT
                </th>

                <th>
                  Người dùng
                </th>

                <th>
                  Email
                </th>

                <th>
                  Quyền
                </th>

                <th>
                  Cập nhật
                </th>

                <th>
                  Xóa
                </th>

              </tr>

            </thead>


            <tbody>

              <tr
                v-for="(user, index) in filteredUsers"
                :key="user._id"
              >

                <!-- STT -->
                <td class="stt">
                  {{ index + 1 }}
                </td>


                <!-- USER -->
                <td>

                  <div class="user-info">

                    <div class="avatar">

                      {{
                        getInitial(
                          user.name
                        )
                      }}

                    </div>


                    <div>

                      <strong>
                        {{ user.name }}
                      </strong>

                      <span>
                        Tài khoản #{{ user._id.slice(-6) }}
                      </span>

                    </div>

                  </div>

                </td>


                <!-- EMAIL -->
                <td>

                  <span class="email">
                    {{ user.email }}
                  </span>

                </td>


                <!-- ROLE -->
                <td>

                  <div
                    class="role-wrapper"
                    :class="user.role"
                  >

                    <span>
                      {{
                        user.role === "admin"
                          ? "🛡️"
                          : "👤"
                      }}
                    </span>


                    <select
                      v-model="user.role"
                    >

                      <option value="user">
                        User
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                    </select>

                  </div>

                </td>


                <!-- UPDATE -->
                <td>

                  <button
                    class="save-button"
                    @click="capNhat(user)"
                    :disabled="
                      updatingId === user._id
                    "
                  >

                    <span
                      v-if="
                        updatingId === user._id
                      "
                    >
                      ⏳
                    </span>

                    <span v-else>
                      ✓
                    </span>

                    {{
                      updatingId === user._id
                        ? "Đang lưu"
                        : "Lưu"
                    }}

                  </button>

                </td>


                <!-- DELETE -->
                <td>

                  <button
                    class="delete-button"
                    @click="xoa(user)"
                    :disabled="
                      deletingId === user._id
                    "
                  >

                    <span
                      v-if="
                        deletingId === user._id
                      "
                    >
                      ⏳
                    </span>

                    <span v-else>
                      🗑
                    </span>

                    Xóa

                  </button>

                </td>

              </tr>


              <!-- KHÔNG CÓ DỮ LIỆU -->
              <tr
                v-if="
                  filteredUsers.length === 0
                "
              >

                <td
                  colspan="6"
                  class="empty"
                >

                  <div>
                    👥
                  </div>

                  <strong>
                    Không tìm thấy người dùng
                  </strong>

                  <span>
                    Thử tìm kiếm bằng tên hoặc email khác
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

    </main>

  </div>
</template>


<script setup>

import axios from "axios";

import Swal from "sweetalert2";

import {
  ref,
  computed,
  onMounted,
} from "vue";


/* =========================
   TOKEN
========================= */

const token =
  localStorage.getItem(
    "token"
  );


/* =========================
   DATA
========================= */

const users =
  ref([]);


/* =========================
   SEARCH
========================= */

const search =
  ref("");


/* =========================
   LOADING
========================= */

const loading =
  ref(false);


/* =========================
   ĐANG CẬP NHẬT
========================= */

const updatingId =
  ref(null);


/* =========================
   ĐANG XÓA
========================= */

const deletingId =
  ref(null);


/* =========================
   LỌC USER
========================= */

const filteredUsers =
  computed(() => {

    const keyword =
      search.value
        .trim()
        .toLowerCase();


    if (!keyword) {

      return users.value;

    }


    return users.value.filter(
      (user) => {

        return (

          user.name
            ?.toLowerCase()
            .includes(keyword)

          ||

          user.email
            ?.toLowerCase()
            .includes(keyword)

        );

      }
    );

  });


/* =========================
   TỔNG USER
========================= */

const totalUsers =
  computed(() => {

    return users.value.filter(
      (user) =>
        user.role === "user"
    ).length;

  });


/* =========================
   TỔNG ADMIN
========================= */

const totalAdmins =
  computed(() => {

    return users.value.filter(
      (user) =>
        user.role === "admin"
    ).length;

  });


/* =========================
   LẤY CHỮ ĐẦU
========================= */

const getInitial =
  (name) => {

    if (!name) {
      return "?";
    }

    return name
      .trim()
      .charAt(0)
      .toUpperCase();

  };


/* =========================
   LOAD USERS
========================= */

const loadUsers =
  async () => {

    loading.value = true;

    try {

      const res =
        await axios.get(
          "/auth/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      users.value =
        Array.isArray(
          res.data
        )
          ? res.data
          : [];


    }
    catch (err) {

      console.error(
        "Lỗi tải người dùng:",
        err
      );


      Swal.fire({
        icon: "error",
        title: "Không thể tải dữ liệu",
        text:
          err.response?.data?.message ||
          "Đã xảy ra lỗi khi tải danh sách người dùng.",
      });

    }
    finally {

      loading.value = false;

    }

  };


/* =========================
   CẬP NHẬT QUYỀN
========================= */

const capNhat =
  async (user) => {

    updatingId.value =
      user._id;


    try {

      await axios.put(

        `/auth/users/${user._id}/role`,

        {
          role:
            user.role,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


      await Swal.fire({

        icon: "success",

        title: "Cập nhật thành công",

        text:
          `Quyền của ${user.name} đã được cập nhật.`,

        timer: 1500,

        showConfirmButton: false,

      });


    }
    catch (err) {

      console.error(err);


      Swal.fire({

        icon: "error",

        title: "Cập nhật thất bại",

        text:
          err.response?.data?.message ||
          "Không thể cập nhật quyền người dùng.",

      });

      // Load lại để tránh UI hiển thị sai
      loadUsers();

    }
    finally {

      updatingId.value =
        null;

    }

  };


/* =========================
   XÓA USER
========================= */

const xoa =
  async (user) => {


    /*
      Không cho xóa chính tài khoản
      đang đăng nhập.
    */

    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "user"
        ) || "null"
      );


    if (
      currentUser?._id ===
      user._id
    ) {

      Swal.fire({

        icon: "warning",

        title: "Không thể xóa",

        text:
          "Bạn không thể tự xóa tài khoản đang đăng nhập.",

      });

      return;

    }


    const result =
      await Swal.fire({

        icon: "warning",

        title: "Xóa người dùng?",

        html:
          `Bạn có chắc muốn xóa tài khoản <b>${user.name}</b>?`,

        showCancelButton: true,

        confirmButtonText:
          "Xóa người dùng",

        cancelButtonText:
          "Hủy",

        confirmButtonColor:
          "#ef4444",

        cancelButtonColor:
          "#64748b",

      });


    if (
      !result.isConfirmed
    ) {

      return;

    }


    deletingId.value =
      user._id;


    try {

      await axios.delete(

        `/auth/users/${user._id}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


      users.value =
        users.value.filter(
          (item) =>
            item._id !==
            user._id
        );


      Swal.fire({

        icon: "success",

        title: "Đã xóa",

        text:
          "Tài khoản đã được xóa khỏi hệ thống.",

        timer: 1500,

        showConfirmButton: false,

      });


    }
    catch (err) {

      console.error(err);


      Swal.fire({

        icon: "error",

        title: "Xóa thất bại",

        text:
          err.response?.data?.message ||
          "Không thể xóa người dùng.",

      });

    }
    finally {

      deletingId.value =
        null;

    }

  };


/* =========================
   KHỞI TẠO
========================= */

onMounted(
  loadUsers
);

</script>


<style scoped>

/* =====================================
   PAGE
===================================== */

.admin-page{

  min-height:100vh;

  display:flex;

  background:#f4f6fa;

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
      #111827,
      #0f172a
    );

  padding:25px 18px;

  display:flex;

  flex-direction:column;

  position:sticky;

  top:0;

}


.logo{

  display:flex;

  align-items:center;

  gap:12px;

  padding:
    5px
    10px
    25px;

  border-bottom:
    1px solid
    rgba(255,255,255,.1);

  margin-bottom:20px;

}


.logo-icon{

  width:45px;

  height:45px;

  border-radius:12px;

  display:flex;

  align-items:center;

  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  font-size:22px;

}


.logo h2{

  margin:0;

  color:white;

  font-size:20px;

}


.logo span{

  display:block;

  margin-top:4px;

  color:#94a3b8;

  font-size:9px;

  letter-spacing:1px;

}


/* =====================================
   MENU
===================================== */

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

  border-radius:10px;

  color:#cbd5e1;

  text-decoration:none;

  font-size:14px;

  transition:.25s;

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


.sidebar-bottom{

  margin-top:auto;

  padding-top:20px;

}


.home-button{

  display:flex;

  align-items:center;

  gap:10px;

  padding:13px;

  border-radius:10px;

  color:#cbd5e1;

  text-decoration:none;

  border:
    1px solid
    rgba(255,255,255,.1);

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

  min-width:0;

  padding:
    35px
    40px;

}


/* =====================================
   HEADER
===================================== */

.page-header{

  display:flex;

  justify-content:space-between;

  align-items:flex-end;

  margin-bottom:28px;

}


.welcome{

  margin:
    0
    0
    5px;

  color:#64748b;

  font-size:14px;

}


.page-header h1{

  margin:0;

  font-size:31px;

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

  padding:
    11px
    18px;

  border:none;

  border-radius:10px;

  background:white;

  color:#334155;

  font-weight:600;

  cursor:pointer;

  box-shadow:
    0 3px 10px
    rgba(0,0,0,.06);

  transition:.25s;

}


.refresh-button:hover{

  color:#2563eb;

  background:#eff6ff;

}


.refresh-button:disabled{

  opacity:.6;

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
   STATS
===================================== */

.stats{

  display:grid;

  grid-template-columns:
    repeat(3,1fr);

  gap:20px;

  margin-bottom:25px;

}


.stat-card{

  background:white;

  border-radius:15px;

  padding:20px;

  display:flex;

  align-items:center;

  gap:15px;

  box-shadow:
    0 4px 15px
    rgba(15,23,42,.06);

}


.stat-icon{

  width:50px;

  height:50px;

  border-radius:13px;

  display:flex;

  align-items:center;

  justify-content:center;

  font-size:22px;

}


.stat-icon.blue{

  background:#dbeafe;

}


.stat-icon.purple{

  background:#ede9fe;

}


.stat-icon.orange{

  background:#fef3c7;

}


.stat-card span{

  display:block;

  color:#64748b;

  font-size:13px;

  margin-bottom:5px;

}


.stat-card strong{

  font-size:27px;

}


/* =====================================
   TABLE CARD
===================================== */

.table-card{

  background:white;

  border-radius:16px;

  box-shadow:
    0 4px 18px
    rgba(15,23,42,.06);

  overflow:hidden;

}


/* =====================================
   TABLE HEADER
===================================== */

.table-header{

  padding:
    23px
    25px;

  display:flex;

  justify-content:space-between;

  align-items:center;

  border-bottom:
    1px solid
    #eef2f7;

}


.table-header h2{

  margin:0;

  font-size:19px;

}


.table-header p{

  margin:
    5px
    0
    0;

  color:#94a3b8;

  font-size:13px;

}


/* =====================================
   SEARCH
===================================== */

.search-box{

  width:300px;

  height:42px;

  display:flex;

  align-items:center;

  gap:8px;

  padding:
    0
    13px;

  border:
    1px solid
    #e2e8f0;

  border-radius:10px;

  color:#94a3b8;

  background:#f8fafc;

}


.search-box input{

  width:100%;

  border:none;

  outline:none;

  background:transparent;

  font-size:13px;

}


/* =====================================
   TABLE
===================================== */

.table-wrapper{

  width:100%;

  overflow-x:auto;

}


table{

  width:100%;

  min-width:900px;

  border-collapse:collapse;

}


thead{

  background:#f8fafc;

}


th{

  padding:
    15px
    18px;

  color:#475569;

  font-size:12px;

  text-transform:uppercase;

  letter-spacing:.3px;

  text-align:center;

  border-bottom:
    1px solid
    #e2e8f0;

}


td{

  padding:
    15px
    18px;

  border-bottom:
    1px solid
    #f1f5f9;

  text-align:center;

  font-size:14px;

}


tbody tr{

  transition:.2s;

}


tbody tr:hover{

  background:#f8fafc;

}


/* =====================================
   STT
===================================== */

.stt{

  color:#94a3b8;

  font-weight:600;

}


/* =====================================
   USER
===================================== */

.user-info{

  display:flex;

  align-items:center;

  gap:12px;

  text-align:left;

}


.avatar{

  width:42px;

  height:42px;

  min-width:42px;

  border-radius:50%;

  display:flex;

  align-items:center;

  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color:white;

  font-weight:bold;

  font-size:16px;

}


.user-info div:last-child{

  display:flex;

  flex-direction:column;

  gap:3px;

}


.user-info strong{

  color:#1e293b;

}


.user-info span{

  color:#94a3b8;

  font-size:11px;

}


.email{

  color:#475569;

}


/* =====================================
   ROLE
===================================== */

.role-wrapper{

  display:inline-flex;

  align-items:center;

  gap:7px;

  padding:
    5px
    8px;

  border-radius:9px;

}


.role-wrapper.user{

  background:#eff6ff;

}


.role-wrapper.admin{

  background:#fff7ed;

}


.role-wrapper select{

  border:none;

  outline:none;

  background:transparent;

  font-weight:600;

  cursor:pointer;

}


.role-wrapper.user select{

  color:#2563eb;

}


.role-wrapper.admin select{

  color:#ea580c;

}


/* =====================================
   BUTTONS
===================================== */

.save-button,
.delete-button{

  border:none;

  padding:
    9px
    15px;

  border-radius:8px;

  cursor:pointer;

  font-weight:600;

  transition:.2s;

}


.save-button{

  background:#2563eb;

  color:white;

}


.save-button:hover{

  background:#1d4ed8;

  transform:
    translateY(-1px);

}


.delete-button{

  background:#fee2e2;

  color:#dc2626;

}


.delete-button:hover{

  background:#dc2626;

  color:white;

  transform:
    translateY(-1px);

}


.save-button:disabled,
.delete-button:disabled{

  opacity:.6;

  cursor:not-allowed;

  transform:none;

}


/* =====================================
   EMPTY
===================================== */

.empty{

  padding:70px 20px;

  color:#94a3b8;

}


.empty div{

  font-size:45px;

  margin-bottom:10px;

}


.empty strong{

  display:block;

  color:#475569;

  margin-bottom:5px;

}


.empty span{

  font-size:13px;

}


/* =====================================
   LOADING
===================================== */

.loading{

  min-height:300px;

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

  border-top-color:#2563eb;

  border-radius:50%;

  animation:
    spin .8s linear infinite;

  margin-bottom:15px;

}


/* =====================================
   RESPONSIVE
===================================== */

@media(max-width:1100px){

  .stats{

    grid-template-columns:
      repeat(2,1fr);

  }

}


@media(max-width:900px){

  .admin-page{

    flex-direction:column;

  }


  .sidebar{

    width:100%;

    min-height:auto;

    position:relative;

  }


  .content{

    padding:25px 20px;

  }

}


@media(max-width:650px){

  .stats{

    grid-template-columns:1fr;

  }


  .page-header{

    flex-direction:column;

    align-items:flex-start;

    gap:15px;

  }


  .table-header{

    flex-direction:column;

    align-items:flex-start;

    gap:15px;

  }


  .search-box{

    width:100%;

  }

}

</style>