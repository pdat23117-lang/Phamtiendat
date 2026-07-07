import { defineStore } from "pinia";

export const useTimKiemStore = defineStore(
  "timkiem",
  {
    state: () => ({
      tuKhoa: "",
      hang: "",
      gia: "",
      sapXep: "",
    }),

    actions: {

      setTuKhoa(value) {
        this.tuKhoa = value;
      },

      setHang(value) {
        this.hang = value;
      },

      setGia(value) {
        this.gia = value;
      },

      setSapXep(value) {
        this.sapXep = value;
      },

      reset() {

        this.tuKhoa = "";
        this.hang = "";
        this.gia = "";
        this.sapXep = "";

      }

    },

    getters: {

      coTimKiem: (state) => {

        return (
          state.tuKhoa !== "" ||
          state.hang !== "" ||
          state.gia !== "" ||
          state.sapXep !== ""
        );

      }

    }

  }
);