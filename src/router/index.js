import { createRouter, createWebHistory } from "vue-router";

import trangchu from "../views/trangchu.vue";
import sanpham from "../views/sanpham.vue";
import lienhe from "../views/lienhe.vue";
import chitietsanpham from "../views/chitietsanpham.vue";
import GioHang from "../views/giohang.vue";
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
  ],
});

export default router;