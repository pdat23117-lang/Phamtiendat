import {
  createRouter,
  createWebHistory,
} from "vue-router";

import trangchu from "../views/trangchu.vue";
import sanpham from "../views/sanpham.vue";
import chitietsanpham from "../views/chitietsanpham.vue";
import giohang from "../views/giohang.vue";
import Dathang from "../views/Dathang.vue";
import LichSuDonHang from "../views/LichSuDonHang.vue";
import lienhe from "../views/lienhe.vue";

import dangnhap from "../views/dangnhap.vue";
import dangky from "../views/dangky.vue";
import quenmatkhau from "../views/quenmatkhau.vue";
import resetmatkhau from "../views/resetmatkhau.vue";
import hosocanhan from "../views/hosocanhan.vue";
import doimatkhau from "../views/doimatkhau.vue";

import admin from "../views/admin.vue";
import adminsanpham from "../views/adminsanpham.vue";
import adminuser from "../views/adminuser.vue";
import admindonhang from "../views/admindonhang.vue";
import adminlienhe from "../views/adminlienhe.vue";
import admindanhgia from "../views/admindanhgia.vue";
import adminthongke from "../views/adminthongke.vue";
import adminbaocao from "../views/adminbaocao.vue";
import admindoanhthu from "../views/admindoanhthu.vue";

import themsanpham from "../views/themsanpham.vue";
import suasanpham from "../views/suasanpham.vue";

const routes = [

  {
    path: "/",
    component: trangchu,
  },

  {
    path: "/sanpham",
    component: sanpham,
  },

  {
    path: "/chitietsanpham/:id",
    component: chitietsanpham,
  },

  {
    path: "/giohang",
    component: giohang,
  },

  {
    path: "/Dathang",
    component: Dathang,
  },

  {
    path: "/LichSuDonHang",
    component: LichSuDonHang,
  },

  {
    path: "/lienhe",
    component: lienhe,
  },

  {
    path: "/dangnhap",
    component: dangnhap,
  },

  {
    path: "/dangky",
    component: dangky,
  },

  {
    path: "/quenmatkhau",
    component: quenmatkhau,
  },

  {
    path: "/resetmatkhau/:token",
    component: resetmatkhau,
  },

  {
    path: "/hosocanhan",
    component: hosocanhan,
  },

  {
    path: "/doimatkhau",
    component: doimatkhau,
  },

  {
    path: "/admin",
    component: admin,
  },

  {
    path: "/adminsanpham",
    component: adminsanpham,
  },

  {
    path: "/adminuser",
    component: adminuser,
  },

  {
    path: "/admindonhang",
    component: admindonhang,
  },

  {
    path: "/adminlienhe",
    component: adminlienhe,
  },

  {
    path: "/admindanhgia",
    component: admindanhgia,
  },

  {
    path: "/adminthongke",
    component: adminthongke,
  },

  {
    path: "/adminbaocao",
    component: adminbaocao,
  },

  {
    path: "/admindoanhthu",
    component: admindoanhthu,
  },

  {
    path: "/themsanpham",
    component: themsanpham,
  },

  {
    path: "/suasanpham/:id",
    component: suasanpham,
  },

];

const router = createRouter({

  history: createWebHistory(),

  routes,

});

router.beforeEach((to, from, next) => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (
    to.path.startsWith("/admin")
  ) {

    if (
      !user ||
      user.role !== "admin"
    ) {

      return next("/dangnhap");

    }

  }

  next();

});

export default router;