import { defineStore } from "pinia";
import axios from "axios";

export const useGioHangStore = defineStore(
  "giohang",
  {
    state: () => ({
      items: [],
      loading: false,
    }),

    getters: {
      tongSoLuong: (state) => {
        return state.items.reduce(
          (sum, item) =>
            sum + item.soluong,
          0
        );
      },

      tongTien: (state) => {
        return state.items.reduce(
          (sum, item) =>
            sum +
            item.soluong *
              item.sanpham.gia,
          0
        );
      },
    },

    actions: {
      async loadCart() {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          this.items = [];
          return;
        }

        this.loading = true;

        try {
          const res =
            await axios.get(
              "/cart",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          this.items =
            res.data.items || [];
        } catch (err) {
          console.log(err);
        }

        this.loading = false;
      },

      async addCart(
        productId,
        soluong = 1
      ) {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(
          "/cart",
          {
            productId,
            soluong,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await this.loadCart();
      },

      async updateCart(
        productId,
        soluong
      ) {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `/cart/${productId}`,
          {
            soluong,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await this.loadCart();
      },

      async removeCart(
        productId
      ) {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          `/cart/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await this.loadCart();
      },

      async clearCart() {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          "/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.items = [];
      },
    },
  }
);