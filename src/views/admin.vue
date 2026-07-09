<template>
  <div class="admin">

    <aside class="sidebar">

      <h2>DAT MOBILE</h2>

      <RouterLink to="/admin">
        Dashboard
      </RouterLink>

      <RouterLink to="/adminsanpham">
        Quản lý sản phẩm
      </RouterLink>

      <RouterLink to="/admindonhang">
        Quản lý đơn hàng
      </RouterLink>

      <RouterLink to="/adminuser">
        Quản lý người dùng
      </RouterLink>

      <RouterLink to="/admindanhgia">
        Quản lý đánh giá
      </RouterLink>

      <RouterLink to="/adminlienhe">
        Liên hệ
      </RouterLink>

      <RouterLink to="/adminthongke">
        Thống kê
      </RouterLink>

      <RouterLink to="/adminbaocao">
        Báo cáo
      </RouterLink>

      <RouterLink to="/admindoanhthu">
        Doanh thu
      </RouterLink>

      <RouterLink to="/">
        Về trang chủ
      </RouterLink>

    </aside>

    <main class="content">

      <h1>Dashboard</h1>

      <div class="cards">

        <div class="card">
          <h3>Sản phẩm</h3>
          <h2>{{ thongKe.products }}</h2>
        </div>

        <div class="card">
          <h3>Người dùng</h3>
          <h2>{{ thongKe.users }}</h2>
        </div>

        <div class="card">
          <h3>Đơn hàng</h3>
          <h2>{{ thongKe.orders }}</h2>
        </div>

        <div class="card">
          <h3>Doanh thu</h3>
          <h2>{{ thongKe.revenue.toLocaleString() }} đ</h2>
        </div>

      </div>

      <div class="cards">

        <div class="card">
          <h3>Đơn chờ xử lý</h3>
          <h2>{{ thongKe.pending }}</h2>
        </div>

        <div class="card">
          <h3>Đang giao</h3>
          <h2>{{ thongKe.shipped }}</h2>
        </div>

        <div class="card">
          <h3>Đã giao</h3>
          <h2>{{ thongKe.delivered }}</h2>
        </div>

        <div class="card">
          <h3>Đã hủy</h3>
          <h2>{{ thongKe.cancelled }}</h2>
        </div>

      </div>

    </main>

  </div>
</template>

<script setup>
import axios from "axios";
import {
  ref,
  onMounted,
} from "vue";

const token =
  localStorage.getItem("token");

const thongKe = ref({
  products: 0,
  users: 0,
  orders: 0,
  revenue: 0,
  pending: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
});

const loadDashboard = async () => {
  try {

    const product =
      await axios.get(
        "/sanpham"
      );

    thongKe.value.products =
      product.data.products.length;

    const user =
      await axios.get(
        "/auth/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    thongKe.value.users =
      user.data.length;

    const order =
      await axios.get(
        "/dathang/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    thongKe.value.orders =
      order.data.length;

    thongKe.value.pending =
      order.data.filter(
        (i) => i.status === "pending"
      ).length;

    thongKe.value.shipped =
      order.data.filter(
        (i) => i.status === "shipped"
      ).length;

    thongKe.value.delivered =
      order.data.filter(
        (i) => i.status === "delivered"
      ).length;

    thongKe.value.cancelled =
      order.data.filter(
        (i) => i.status === "cancelled"
      ).length;

    thongKe.value.revenue =
      order.data
        .filter(
          (i) =>
            i.status === "delivered"
        )
        .reduce(
          (sum, i) =>
            sum + i.totalPrice,
          0
        );

  } catch (err) {

    console.log(err);

  }
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.admin {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

.sidebar {
  width: 260px;
  background: #111827;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
}

.sidebar h2 {
  color: white;
  margin-bottom: 30px;
  text-align: center;
}

.sidebar a {
  color: white;
  text-decoration: none;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: .3s;
}

.sidebar a:hover,
.router-link-active {
  background: #2563eb;
}

.content {
  flex: 1;
  padding: 40px;
}

.content h1 {
  margin-bottom: 30px;
}

.cards {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
  transition: .3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  color: #666;
  margin-bottom: 15px;
}

.card h2 {
  font-size: 36px;
  color: #111827;
}

@media(max-width:900px){

.admin{
flex-direction:column;
}

.sidebar{
width:100%;
}

.content{
padding:20px;
}

}
</style>