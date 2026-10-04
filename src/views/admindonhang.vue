<template>
  <div class="container">

    <!-- =========================
         HEADER
    ========================== -->
    <div class="page-header">

      <div>
        <h1>Quản lý đơn hàng</h1>

        <p>
          Quản lý đơn hàng và xác nhận thanh toán
        </p>
      </div>

      <button
        class="refresh"
        @click="loadOrders"
        :disabled="loading"
      >
        🔄 Làm mới
      </button>

    </div>


    <!-- =========================
         LOADING
    ========================== -->
    <div
      v-if="loading"
      class="loading"
    >

      <div class="spinner"></div>

      <p>Đang tải dữ liệu...</p>

    </div>


    <!-- =========================
         TABLE
    ========================== -->
    <div
      v-else
      class="table-wrapper"
    >

      <table>

        <thead>

          <tr>

            <th>Mã đơn</th>

            <th>Khách hàng</th>

            <th>SĐT</th>

            <th>Tổng tiền</th>

            <th>Thanh toán</th>

            <th>Trạng thái</th>

            <th>Cập nhật</th>

            <th>Chi tiết</th>

          </tr>

        </thead>


        <tbody>

          <tr
            v-for="order in orders"
            :key="order._id"
          >

            <!-- =========================
                 MÃ ĐƠN
            ========================== -->
            <td>

              <div class="order-id">
                #{{ order._id.slice(-8) }}
              </div>

              <small>
                {{ formatDate(order.createdAt) }}
              </small>

            </td>


            <!-- =========================
                 KHÁCH HÀNG
            ========================== -->
            <td>

              <strong>
                {{
                  order.shippingAddress?.ten ||
                  "Không có"
                }}
              </strong>

            </td>


            <!-- =========================
                 SĐT
            ========================== -->
            <td>

              {{
                order.shippingAddress?.sodienthoai ||
                "Không có"
              }}

            </td>


            <!-- =========================
                 TỔNG TIỀN
            ========================== -->
            <td>

              <strong class="price">

                {{
                  Number(order.thanhTien || 0)
                    .toLocaleString("vi-VN")
                }}đ

              </strong>

            </td>


            <!-- =========================
                 THANH TOÁN
            ========================== -->
            <td>

              <!-- COD -->
              <div
                v-if="
                  order.paymentMethod === 'cod'
                "
              >

                <span
                  class="payment-badge cod"
                >
                  💵 COD
                </span>


                <div
                  v-if="order.isPaid"
                  class="payment-success"
                >
                  ✓ Đã thanh toán
                </div>


                <div
                  v-else
                  class="payment-unpaid"
                >
                  Chưa thanh toán
                </div>

              </div>


              <!-- BANK -->
              <div
                v-else-if="
                  order.paymentMethod === 'bank'
                "
              >

                <!-- ĐÃ THANH TOÁN -->
                <span
                  v-if="
                    order.isPaid ||
                    order.paymentStatus === 'paid'
                  "
                  class="payment-badge paid"
                >
                  ✓ Đã thanh toán
                </span>


                <!-- KHÁCH ĐÃ BÁO CHUYỂN -->
                <div
                  v-else-if="
                    order.paymentStatus === 'waiting'
                  "
                >

                  <span
                    class="payment-badge waiting"
                  >
                    ⏳ Chờ xác nhận
                  </span>


                  <button
                    class="confirm-payment"
                    @click="confirmPayment(order)"
                  >
                    ✓ Xác nhận đã nhận tiền
                  </button>

                </div>


                <!-- CHƯA THANH TOÁN -->
                <span
                  v-else
                  class="payment-badge unpaid"
                >
                  🔴 Chưa thanh toán
                </span>

              </div>


              <!-- PHƯƠNG THỨC KHÁC -->
              <div v-else>

                <span
                  class="payment-badge unpaid"
                >
                  {{ order.paymentMethod }}
                </span>

              </div>

            </td>


            <!-- =========================
                 TRẠNG THÁI
            ========================== -->
            <td>

              <!--
                QUAN TRỌNG:

                _savedStatus = trạng thái đã lưu
                trong MongoDB.

                order.status = trạng thái hiện tại
                đang được chọn trên giao diện.
              -->


              <!-- ĐƠN ĐÃ HỦY VÀ ĐÃ LƯU -->
              <div
                v-if="
                  order._savedStatus === 'cancelled'
                "
                class="status-locked cancelled"
              >
                ❌ Đã hủy
              </div>


              <!-- ĐƠN ĐÃ GIAO VÀ ĐÃ LƯU -->
              <div
                v-else-if="
                  order._savedStatus === 'delivered'
                "
                class="status-locked delivered"
              >
                ✅ Đã giao
              </div>


              <!--
                CÒN LẠI:
                CHO PHÉP CHỌN TRẠNG THÁI
              -->
              <select
                v-else
                v-model="order.status"
                :class="'status-' + order.status"
              >

                <option value="pending">
                  Chờ xác nhận
                </option>

                <option value="processing">
                  Đang xử lý
                </option>

                <option value="shipping">
                  Đang giao
                </option>

                <option value="delivered">
                  Đã giao
                </option>

                <option value="cancelled">
                  Đã hủy
                </option>

              </select>

            </td>


            <!-- =========================
                 CẬP NHẬT
            ========================== -->
            <td>

              <!--
                CHỈ KHÓA KHI TRẠNG THÁI
                ĐÃ ĐƯỢC LƯU TRONG DATABASE
              -->

              <button
                v-if="
                  order._savedStatus !== 'cancelled' &&
                  order._savedStatus !== 'delivered'
                "
                class="save"
                @click="update(order)"
              >
                💾 Lưu
              </button>


              <span
                v-else
                class="locked-text"
              >
                🔒 Đã khóa
              </span>

            </td>


            <!-- =========================
                 CHI TIẾT
            ========================== -->
            <td>

              <button
                class="detail"
                @click="detail(order)"
              >
                👁 Xem
              </button>

            </td>

          </tr>


          <!-- =========================
               KHÔNG CÓ ĐƠN
          ========================== -->
          <tr
            v-if="orders.length === 0"
          >

            <td
              colspan="8"
              class="empty"
            >
              Không có đơn hàng nào
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>
</template>


<script setup>

import axios from "axios";

import {
  ref,
  onMounted
} from "vue";


// =========================
// TOKEN
// =========================

const token =
  localStorage.getItem("token");


// =========================
// STATE
// =========================

const loading =
  ref(true);

const orders =
  ref([]);


// =========================
// LẤY DANH SÁCH ĐƠN
// =========================

const loadOrders = async () => {

  loading.value = true;

  try {

    const res =
      await axios.get(
        "/dathang/admin/all",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    /*
      API có thể trả:

      [
        ...
      ]

      hoặc:

      {
        orders: [...]
      }
    */

    let data = [];


    if (
      Array.isArray(res.data)
    ) {

      data =
        res.data;

    }
    else if (
      Array.isArray(
        res.data?.orders
      )
    ) {

      data =
        res.data.orders;

    }


    /*
      ============================
      RẤT QUAN TRỌNG
      ============================

      Lưu lại trạng thái thực tế
      từ MongoDB.

      _savedStatus KHÔNG gửi lên
      server.

      Nó chỉ dùng để biết:

      - Trạng thái nào đã lưu
      - Trạng thái nào đang chọn
    */

    orders.value =
      data.map(order => ({

        ...order,

        _savedStatus:
          order.status

      }));


    console.log(
      "Danh sách đơn hàng:",
      orders.value
    );

  }
  catch (err) {

    console.error(
      "Lỗi lấy đơn hàng:",
      err.response?.data ||
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể lấy danh sách đơn hàng"
    );

  }
  finally {

    loading.value = false;

  }

};


// =========================
// CẬP NHẬT TRẠNG THÁI
// =========================

const update = async (order) => {


  /*
    ==========================
    KIỂM TRA ĐƠN ĐÃ KHÓA
    ==========================
  */

  if (
    order._savedStatus === "cancelled" ||
    order._savedStatus === "delivered"
  ) {

    alert(
      "Đơn hàng này đã khóa, không thể cập nhật."
    );

    return;

  }


  /*
    ==========================
    BANK CHƯA THANH TOÁN
    ==========================

    Không cho:

    Chưa thanh toán
        ↓
    Đang giao / Đã giao
  */

  if (

    order.paymentMethod === "bank"

    &&

    !order.isPaid

    &&

    order.paymentStatus !== "paid"

    &&

    (
      order.status === "shipping" ||
      order.status === "delivered"
    )

  ) {

    alert(
      "Khách hàng chưa thanh toán. Không thể chuyển đơn sang trạng thái giao hàng."
    );


    /*
      Khôi phục trạng thái
      đang có trong database
    */

    order.status =
      order._savedStatus;


    return;

  }


  /*
    ==========================
    XÁC NHẬN NẾU HỦY ĐƠN
    ==========================
  */

  if (
    order.status === "cancelled"
  ) {

    const ok =
      confirm(
        "Bạn có chắc muốn hủy đơn hàng này?"
      );

    if (!ok) {

      order.status =
        order._savedStatus;

      return;

    }

  }


  /*
    ==========================
    GỌI API
    ==========================
  */

  try {

    const res =
      await axios.put(

        `/dathang/admin/${order._id}/status`,

        {
          status:
            order.status
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );


    /*
      ==========================
      THÀNH CÔNG
      ==========================
    */

    alert(
      res.data?.message ||
      "Cập nhật trạng thái thành công!"
    );


    /*
      ==========================
      TẢI LẠI TỪ DATABASE
      ==========================

      Đây là bước rất quan trọng.

      Nếu MongoDB đã lưu:

      delivered

      thì sau loadOrders():

      _savedStatus = delivered

      và giao diện mới khóa.
    */

    await loadOrders();

  }
  catch (err) {

    console.error(
      "Lỗi cập nhật trạng thái:",
      err.response?.data ||
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể cập nhật trạng thái"
    );


    /*
      Nếu API lỗi,
      lấy lại trạng thái thật
      từ database.
    */

    await loadOrders();

  }

};


// =========================
// XÁC NHẬN THANH TOÁN BANK
// =========================

const confirmPayment =
  async (order) => {


  /*
    Kiểm tra phương thức
  */

  if (
    order.paymentMethod !== "bank"
  ) {

    alert(
      "Đơn hàng này không sử dụng chuyển khoản."
    );

    return;

  }


  /*
    Chỉ xác nhận khi khách
    đã bấm "Tôi đã chuyển khoản"
  */

  if (
    order.paymentStatus !== "waiting"
  ) {

    alert(
      "Khách hàng chưa báo đã chuyển khoản."
    );

    return;

  }


  const money =
    Number(
      order.thanhTien || 0
    ).toLocaleString("vi-VN");


  const ok =
    confirm(

      `Xác nhận đã nhận đủ ${money}đ từ khách hàng?\n\n` +

      `Mã đơn: ${order._id}\n` +

      `Khách hàng: ${
        order.shippingAddress?.ten || ""
      }\n\n` +

      `Chỉ xác nhận sau khi đã kiểm tra giao dịch ngân hàng.`

    );


  if (!ok) {

    return;

  }


  try {

    const res =
      await axios.put(

        `/dathang/admin/${order._id}/confirm-payment`,

        {},

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );


    alert(
      res.data?.message ||
      "✓ Đã xác nhận thanh toán thành công!"
    );


    await loadOrders();

  }
  catch (err) {

    console.error(
      "Lỗi xác nhận thanh toán:",
      err.response?.data ||
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể xác nhận thanh toán"
    );

  }

};


// =========================
// XEM CHI TIẾT
// =========================

const detail =
  (order) => {

  let text = "";


  /*
    ==========================
    SẢN PHẨM
    ==========================
  */

  order.items?.forEach(
    (item, index) => {

      text +=

`${index + 1}. ${item.ten}

Số lượng: ${item.soluong}

Bộ nhớ: ${
  item.bonho ||
  "Không có"
}

Màu: ${
  item.mau ||
  "Không có"
}

Giá: ${
  Number(item.gia || 0)
    .toLocaleString("vi-VN")
} đ

-------------------------

`;

    }
  );


  /*
    ==========================
    THÔNG TIN ĐƠN
    ==========================
  */

  alert(

`KHÁCH HÀNG

Tên:
${order.shippingAddress?.ten || ""}

SĐT:
${order.shippingAddress?.sodienthoai || ""}

Địa chỉ:
${order.shippingAddress?.diachi || ""}


PHƯƠNG THỨC THANH TOÁN

${
  order.paymentMethod === "bank"
    ? "Chuyển khoản ngân hàng"
    : "Thanh toán khi nhận hàng"
}


TRẠNG THÁI THANH TOÁN

${getPaymentText(order)}


TRẠNG THÁI ĐƠN HÀNG

${getStatusText(order.status)}


-------------------------

${text}

TỔNG TIỀN:

${
  Number(order.thanhTien || 0)
    .toLocaleString("vi-VN")
} đ`

  );

};


// =========================
// TRẠNG THÁI THANH TOÁN
// =========================

const getPaymentText =
  (order) => {

  if (
    order.isPaid ||
    order.paymentStatus === "paid"
  ) {

    return "✓ Đã thanh toán";

  }


  if (
    order.paymentStatus === "waiting"
  ) {

    return "⏳ Chờ admin xác nhận";

  }


  return "🔴 Chưa thanh toán";

};


// =========================
// TRẠNG THÁI ĐƠN
// =========================

const getStatusText =
  (status) => {

  const map = {

    pending:
      "⏳ Chờ xác nhận",

    processing:
      "⚙️ Đang xử lý",

    shipping:
      "🚚 Đang giao",

    delivered:
      "✅ Đã giao",

    cancelled:
      "❌ Đã hủy"

  };


  return (
    map[status] ||
    status
  );

};


// =========================
// FORMAT NGÀY
// =========================

const formatDate =
  (date) => {

  if (!date) {

    return "";

  }


  return new Date(date)
    .toLocaleString(
      "vi-VN"
    );

};


// =========================
// INIT
// =========================

onMounted(
  loadOrders
);

</script>


<style scoped>

/* =========================
   CONTAINER
========================= */

.container {

  padding: 40px;

  background:
    #f5f7fb;

  min-height:
    calc(100vh - 80px);

}


/* =========================
   HEADER
========================= */

.page-header {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom:
    28px;

}


.page-header h1 {

  margin:
    0 0 6px;

  font-size:
    30px;

  color:
    #111827;

}


.page-header p {

  margin:
    0;

  color:
    #6b7280;

}


/* =========================
   REFRESH
========================= */

.refresh {

  border:
    none;

  background:
    #111827;

  color:
    white;

  padding:
    12px 20px;

  border-radius:
    10px;

  cursor:
    pointer;

  font-weight:
    700;

  transition:
    .2s;

}


.refresh:hover {

  background:
    #2563eb;

  transform:
    translateY(-1px);

}


.refresh:disabled {

  opacity:
    .6;

  cursor:
    not-allowed;

}


/* =========================
   LOADING
========================= */

.loading {

  text-align:
    center;

  padding:
    80px;

  color:
    #6b7280;

}


.spinner {

  width:
    40px;

  height:
    40px;

  border:
    4px solid #e5e7eb;

  border-top-color:
    #2563eb;

  border-radius:
    50%;

  margin:
    0 auto 15px;

  animation:
    spin .8s linear infinite;

}


@keyframes spin {

  to {

    transform:
      rotate(360deg);

  }

}


/* =========================
   TABLE
========================= */

.table-wrapper {

  background:
    white;

  border-radius:
    16px;

  overflow-x:
    auto;

  box-shadow:
    0 8px 30px
    rgba(15,23,42,.08);

}


table {

  width:
    100%;

  min-width:
    1250px;

  border-collapse:
    collapse;

}


th {

  background:
    #111827;

  color:
    white;

  padding:
    16px 14px;

  font-size:
    14px;

  white-space:
    nowrap;

}


td {

  padding:
    15px 14px;

  border-bottom:
    1px solid #edf0f4;

  text-align:
    center;

  vertical-align:
    middle;

}


tbody tr {

  transition:
    .2s;

}


tbody tr:hover {

  background:
    #f8fafc;

}


/* =========================
   ORDER ID
========================= */

.order-id {

  font-weight:
    800;

  color:
    #111827;

}


td small {

  display:
    block;

  margin-top:
    5px;

  color:
    #9ca3af;

  font-size:
    11px;

}


/* =========================
   PRICE
========================= */

.price {

  color:
    #e11d48;

  font-size:
    16px;

  white-space:
    nowrap;

}


/* =========================
   PAYMENT
========================= */

.payment-badge {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  padding:
    8px 12px;

  border-radius:
    20px;

  font-size:
    12px;

  font-weight:
    700;

  white-space:
    nowrap;

}


.payment-badge.cod {

  color:
    #1d4ed8;

  background:
    #dbeafe;

}


.payment-badge.paid {

  color:
    #15803d;

  background:
    #dcfce7;

}


.payment-badge.waiting {

  color:
    #a16207;

  background:
    #fef3c7;

}


.payment-badge.unpaid {

  color:
    #b91c1c;

  background:
    #fee2e2;

}


.payment-success {

  color:
    #15803d;

  font-size:
    12px;

  margin-top:
    6px;

  font-weight:
    700;

}


.payment-unpaid {

  color:
    #dc2626;

  font-size:
    12px;

  margin-top:
    6px;

}


/* =========================
   CONFIRM PAYMENT
========================= */

.confirm-payment {

  display:
    block;

  margin:
    9px auto 0;

  padding:
    9px 13px;

  border:
    none;

  border-radius:
    9px;

  background:
    #16a34a;

  color:
    white;

  cursor:
    pointer;

  font-size:
    12px;

  font-weight:
    700;

  white-space:
    nowrap;

  transition:
    .2s;

}


.confirm-payment:hover {

  background:
    #15803d;

  transform:
    translateY(-1px);

}


/* =========================
   SELECT
========================= */

select {

  min-width:
    135px;

  padding:
    10px 12px;

  border:
    1px solid #d1d5db;

  border-radius:
    9px;

  background:
    white;

  cursor:
    pointer;

  font-weight:
    700;

}


select:focus {

  outline:
    none;

  border-color:
    #2563eb;

  box-shadow:
    0 0 0 3px
    rgba(37,99,235,.12);

}


/* =========================
   STATUS COLOR
========================= */

.status-pending {

  color:
    #b45309;

  border-color:
    #f59e0b;

}


.status-processing {

  color:
    #1d4ed8;

  border-color:
    #3b82f6;

}


.status-shipping {

  color:
    #7c3aed;

  border-color:
    #8b5cf6;

}


.status-delivered {

  color:
    #15803d;

  border-color:
    #22c55e;

  background:
    #f0fdf4;

}


.status-cancelled {

  color:
    #dc2626;

  border-color:
    #ef4444;

  background:
    #fff7f7;

}


/* =========================
   LOCKED STATUS
========================= */

.status-locked {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  min-width:
    115px;

  padding:
    9px 14px;

  border-radius:
    10px;

  font-size:
    13px;

  font-weight:
    700;

}


.status-locked.cancelled {

  background:
    #fee2e2;

  color:
    #dc2626;

  border:
    1px solid #fecaca;

}


.status-locked.delivered {

  background:
    #dcfce7;

  color:
    #15803d;

  border:
    1px solid #bbf7d0;

}


/* =========================
   LOCKED TEXT
========================= */

.locked-text {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  padding:
    9px 13px;

  border-radius:
    9px;

  background:
    #f1f5f9;

  color:
    #64748b;

  font-size:
    13px;

  font-weight:
    700;

  white-space:
    nowrap;

}


/* =========================
   SAVE BUTTON
========================= */

.save {

  background:
    #2563eb;

  color:
    white;

  border:
    none;

  padding:
    10px 17px;

  border-radius:
    9px;

  cursor:
    pointer;

  font-weight:
    700;

  transition:
    .2s;

}


.save:hover {

  background:
    #1d4ed8;

  transform:
    translateY(-1px);

}


/* =========================
   DETAIL BUTTON
========================= */

.detail {

  background:
    #16a34a;

  color:
    white;

  border:
    none;

  padding:
    10px 17px;

  border-radius:
    9px;

  cursor:
    pointer;

  font-weight:
    700;

  transition:
    .2s;

}


.detail:hover {

  background:
    #15803d;

  transform:
    translateY(-1px);

}


/* =========================
   EMPTY
========================= */

.empty {

  padding:
    60px !important;

  color:
    #6b7280;

  font-size:
    16px;

}


/* =========================
   MOBILE
========================= */

@media(max-width:768px) {

  .container {

    padding:
      20px;

  }


  .page-header {

    flex-direction:
      column;

    align-items:
      flex-start;

    gap:
      15px;

  }


  .refresh {

    width:
      100%;

  }

}

</style>