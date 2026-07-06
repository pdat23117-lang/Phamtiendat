import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimKiemStore =
  defineStore("timkiem", () => {
    const tuKhoa = ref("");

    return {
      tuKhoa,
    };
  });