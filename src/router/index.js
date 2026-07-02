import { createRouter, createWebHistory }
from "vue-router";

import HomeView from "../views/HomeView.vue";
import ProductView from "../views/ProductView.vue";
import ContactView from "../views/ContactView.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/product/:id",
    component: ProductView,
  },
  {
    path: "/contact",
    component: ContactView,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});