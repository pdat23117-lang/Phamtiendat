import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {

  const token = ref(localStorage.getItem("token"));

  const user = ref(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  function login(data) {

    token.value = data.token;

    user.value = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("token", token.value);

    localStorage.setItem(
      "user",
      JSON.stringify(user.value)
    );
  }

  function logout() {

    token.value = null;

    user.value = null;

    localStorage.removeItem("token");

    localStorage.removeItem("user");
  }

  return {
    token,
    user,
    login,
    logout,
  };

});