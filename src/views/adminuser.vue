<template>
  <div class="container">

    <h1>Quản lý người dùng</h1>

    <table>

      <thead>
        <tr>
          <th>Họ tên</th>
          <th>Email</th>
          <th>Quyền</th>
          <th>Cập nhật</th>
          <th>Xóa</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="user in users"
          :key="user._id"
        >

          <td>{{ user.name }}</td>

          <td>{{ user.email }}</td>

          <td>

            <select
              v-model="user.role"
            >
              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </td>

          <td>

            <button
              class="save"
              @click="capNhat(user)"
            >
              Lưu
            </button>

          </td>

          <td>

            <button
              class="delete"
              @click="xoa(user._id)"
            >
              Xóa
            </button>

          </td>

        </tr>

      </tbody>

    </table>

  </div>
</template>

<script setup>
import axios from "axios";
import {
  ref,
  onMounted,
} from "vue";

const users = ref([]);

const token =
localStorage.getItem("token");

const loadUsers = async () => {

  try{

    const res =
    await axios.get(
      "/auth/users",
      {
        headers:{
          Authorization:
          `Bearer ${token}`,
        },
      }
    );

    users.value =
    res.data;

  }
  catch(err){

    console.log(err);

  }

};

const capNhat =
async(user)=>{

  try{

    await axios.put(
      `/auth/users/${user._id}/role`,
      {
        role:user.role,
      },
      {
        headers:{
          Authorization:
          `Bearer ${token}`,
        },
      }
    );

    alert("Đã cập nhật");

  }
  catch(err){

    alert(
      err.response?.data?.message
    );

  }

};

const xoa =
async(id)=>{

  if(
    !confirm(
      "Xóa người dùng?"
    )
  )
  return;

  try{

    await axios.delete(
      `/auth/users/${id}`,
      {
        headers:{
          Authorization:
          `Bearer ${token}`,
        },
      }
    );

    loadUsers();

  }
  catch(err){

    alert(
      err.response?.data?.message
    );

  }

};

onMounted(loadUsers);

</script>

<style scoped>

.container{
  padding:40px;
}

h1{
  margin-bottom:30px;
}

table{
  width:100%;
  border-collapse:collapse;
}

th{
  background:black;
  color:white;
}

th,
td{
  padding:15px;
  border:1px solid #ddd;
  text-align:center;
}

select{
  padding:8px;
}

button{
  border:none;
  padding:10px 18px;
  border-radius:8px;
  cursor:pointer;
}

.save{
  background:#2563eb;
  color:white;
}

.delete{
  background:red;
  color:white;
}

button:hover{
  opacity:.9;
}

</style>