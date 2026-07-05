import { reactive } from "vue";

const data =
  JSON.parse(localStorage.getItem("giohang")) || [];

export const giohang = reactive(data);