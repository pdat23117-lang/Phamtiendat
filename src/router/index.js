import { createRouter, createWebHistory } from "vue-router";

import trangchu from "../views/trangchu.vue";
import sanpham from "../views/sanpham.vue";
import lienhe from "../views/lienhe.vue";
import chitietsanpham from "../views/chitietsanpham.vue";
import GioHang from "../views/giohang.vue";
import DatHang from "../views/dathang.vue";
import DangKy from "../views/dangky.vue";
import DangNhap from "../views/dangnhap.vue";
import QuenMatKhau from "../views/quenmatkhau.vue";
import HoSoCaNhan from "../views/hosocanhan.vue";
import DoiMatKhau from "../views/doimatkhau.vue";
import ResetMatKhau from "../views/resetmatkhau.vue";
import Admin from "../views/admin.vue";
import AdminSanPham from "../views/adminsanpham.vue";
import AdminDonHang from "../views/admindonhang.vue";
import AdminUser from "../views/adminuser.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: trangchu,
    },
    {
      path: "/sanpham",
      component: sanpham,
    },
    {
      path: "/lienhe",
      component: lienhe,
    },
    {
      path: "/sanpham/:id",
      component: chitietsanpham,
    },
    {
  path: "/giohang",
  component: GioHang,
},
{
  path: "/dathang",
  component: DatHang,
},
{
  path: "/dangky",
  component: DangKy,
},
{
  path: "/dangnhap",
  component: DangNhap,
},
{
  path: "/quenmatkhau",
  component: QuenMatKhau,
},
{
  path: "/hoso",
  component: HoSoCaNhan,
},
{
  path: "/doimatkhau",
  component: DoiMatKhau,
},
{
  path:
    "/reset-password/:token",
  component:
    ResetMatKhau,
},
{
  path: "/admin",
  component: Admin,
},

{
  path: "/admin/sanpham",
  component: AdminSanPham,
},

{
  path: "/admin/donhang",
  component: AdminDonHang,
},

{
  path: "/admin/user",
  component: AdminUser,
},

  ],
});

export default router;