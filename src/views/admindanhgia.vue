<template>
  <div class="container">

    <!-- =========================
         HEADER
    ========================== -->
    <div class="page-header">

      <div>
        <h1>Quản lý đánh giá</h1>

        <p>
          Quản lý đánh giá và phản hồi của khách hàng
        </p>
      </div>

      <button
        class="refresh-btn"
        @click="loadData"
        :disabled="loading"
      >
        🔄 Làm mới
      </button>

    </div>


    <!-- =========================
         THỐNG KÊ
    ========================== -->
    <div class="stats">

      <div class="stat-card">

        <div class="stat-icon blue">
          ⭐
        </div>

        <div>
          <span>Tổng đánh giá</span>

          <strong>
            {{ reviews.length }}
          </strong>
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon yellow">
          ⭐
        </div>

        <div>
          <span>Đánh giá 5 sao</span>

          <strong>
            {{ countRating(5) }}
          </strong>
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon green">
          💬
        </div>

        <div>
          <span>Đã phản hồi</span>

          <strong>
            {{ repliedCount }}
          </strong>
        </div>

      </div>


      <div class="stat-card">

        <div class="stat-icon red">
          ⚠️
        </div>

        <div>
          <span>Chưa phản hồi</span>

          <strong>
            {{ unrepliedCount }}
          </strong>
        </div>

      </div>

    </div>


    <!-- =========================
         LOADING
    ========================== -->
    <div
      v-if="loading"
      class="loading"
    >

      <div class="spinner"></div>

      <p>
        Đang tải đánh giá...
      </p>

    </div>


    <!-- =========================
         DANH SÁCH
    ========================== -->
    <div
      v-else
      class="review-card"
    >

      <div class="card-header">

        <div>
          <h2>
            Danh sách đánh giá
          </h2>

          <p>
            Có {{ reviews.length }} đánh giá từ khách hàng
          </p>
        </div>

      </div>


      <!-- Không có đánh giá -->
      <div
        v-if="reviews.length === 0"
        class="empty"
      >

        <div class="empty-icon">
          💬
        </div>

        <h3>
          Chưa có đánh giá
        </h3>

        <p>
          Hiện tại chưa có khách hàng nào đánh giá sản phẩm.
        </p>

      </div>


      <!-- =========================
           REVIEW LIST
      ========================== -->
      <div
        v-else
        class="review-list"
      >

        <div
          v-for="review in reviews"
          :key="review._id"
          class="review-item"
        >

          <!-- =========================
               TOP
          ========================== -->
          <div class="review-top">

            <div class="product-info">

              <div class="product-icon">
                📱
              </div>

              <div>

                <h3>
                  {{ review.productName }}
                </h3>

                <span class="product-label">
                  Sản phẩm
                </span>

              </div>

            </div>


            <!-- Rating -->
            <div class="rating">

              <span
                v-for="star in 5"
                :key="star"
                :class="[
                  'star',
                  {
                    active:
                      star <= review.rating
                  }
                ]"
              >
                ★
              </span>

              <strong>
                {{ review.rating }}/5
              </strong>

            </div>

          </div>


          <!-- =========================
               BODY
          ========================== -->
          <div class="review-body">

            <!-- KHÁCH HÀNG -->
            <div class="customer">

              <div class="avatar">

                {{
                  getInitial(
                    review.name
                  )
                }}

              </div>

              <div>

                <strong>
                  {{ review.name }}
                </strong>

                <span>
                  Khách hàng
                </span>

              </div>

            </div>


            <!-- COMMENT -->
            <div class="comment-box">

              <div class="comment-title">
                💬 Bình luận của khách hàng
              </div>

              <p>
                "{{ review.comment }}"
              </p>

            </div>


            <!-- STATUS -->
            <div class="reply-status">

              <span
                v-if="review.adminReply"
                class="status replied"
              >
                ✓ Đã phản hồi
              </span>

              <span
                v-else
                class="status waiting"
              >
                ⏳ Chưa phản hồi
              </span>

            </div>

          </div>


          <!-- =========================
               ADMIN REPLY
          ========================== -->
          <div class="reply-section">

            <div class="reply-label">

              <span>
                💬 Phản hồi của cửa hàng
              </span>

              <small>
                Trả lời khách hàng
              </small>

            </div>


            <textarea
              v-model="review.adminReply"
              placeholder="Nhập nội dung phản hồi cho khách hàng..."
              maxlength="500"
            ></textarea>


            <div class="reply-footer">

              <span>
                {{
                  (review.adminReply || "").length
                }}/500 ký tự
              </span>


              <div class="actions">

                <button
                  class="save-btn"
                  @click="reply(review)"
                  :disabled="savingId === review._id"
                >

                  <span
                    v-if="
                      savingId === review._id
                    "
                  >
                    ⏳ Đang lưu...
                  </span>

                  <span v-else>
                    💾 Lưu phản hồi
                  </span>

                </button>


                <button
                  class="delete-btn"
                  @click="remove(review)"
                >
                  🗑 Xóa
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup>

import axios from "axios";

import {
  ref,
  computed,
  onMounted
} from "vue";


// =========================
// TOKEN
// =========================

const token =
  localStorage.getItem("token");


// =========================
// DATA
// =========================

const reviews =
  ref([]);

const loading =
  ref(true);

const savingId =
  ref(null);


// =========================
// LOAD DATA
// =========================

const loadData =
  async () => {

  loading.value = true;

  try {

    const res =
      await axios.get(
        "/sanpham/admin/reviews",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


    reviews.value =
      Array.isArray(res.data)
        ? res.data
        : [];


    console.log(
      "Reviews:",
      reviews.value
    );

  }
  catch (err) {

    console.error(
      "Lỗi lấy đánh giá:",
      err.response?.data ||
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể tải danh sách đánh giá"
    );

  }
  finally {

    loading.value = false;

  }

};


// =========================
// ĐẾM 5 SAO
// =========================

const countRating =
  (rating) => {

  return reviews.value.filter(
    review =>
      Number(review.rating) ===
      rating
  ).length;

};


// =========================
// ĐÃ PHẢN HỒI
// =========================

const repliedCount =
  computed(() => {

    return reviews.value.filter(
      review =>
        review.adminReply &&
        review.adminReply.trim() !== ""
    ).length;

  });


// =========================
// CHƯA PHẢN HỒI
// =========================

const unrepliedCount =
  computed(() => {

    return (
      reviews.value.length -
      repliedCount.value
    );

  });


// =========================
// LẤY CHỮ CÁI ĐẦU
// =========================

const getInitial =
  (name) => {

  if (!name) {

    return "?";

  }


  return name
    .trim()
    .charAt(0)
    .toUpperCase();

};


// =========================
// PHẢN HỒI
// =========================

const reply =
  async (review) => {

  const content =
    review.adminReply?.trim();


  if (!content) {

    alert(
      "Vui lòng nhập nội dung phản hồi."
    );

    return;

  }


  savingId.value =
    review._id;


  try {

    const res =
      await axios.put(

        `/sanpham/admin/${review.productId}/reviews/${review._id}/reply`,

        {
          reply: content,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


    /*
      Cập nhật ngay giao diện
    */

    review.adminReply =
      res.data?.review?.adminReply ||
      content;


    alert(
      "✓ Đã lưu phản hồi thành công!"
    );

  }
  catch (err) {

    console.error(
      "Lỗi phản hồi:",
      err.response?.data ||
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể lưu phản hồi"
    );

  }
  finally {

    savingId.value =
      null;

  }

};


// =========================
// XÓA ĐÁNH GIÁ
// =========================

const remove =
  async (review) => {

  const ok =
    confirm(

      `Bạn có chắc muốn xóa đánh giá của "${review.name}"?`

    );


  if (!ok) {

    return;

  }


  try {

    await axios.delete(

      `/sanpham/admin/${review.productId}/reviews/${review._id}`,

      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }

    );


    /*
      Xóa ngay khỏi giao diện
    */

    reviews.value =
      reviews.value.filter(
        item =>
          item._id !== review._id
      );


    alert(
      "✓ Đã xóa đánh giá!"
    );

  }
  catch (err) {

    console.error(
      "Lỗi xóa đánh giá:",
      err.response?.data ||
      err
    );


    alert(
      err.response?.data?.message ||
      "Không thể xóa đánh giá"
    );

  }

};


// =========================
// INIT
// =========================

onMounted(
  loadData
);

</script>


<style scoped>

/* ==================================================
   CONTAINER
================================================== */

.container {

  min-height:
    calc(100vh - 80px);

  padding:
    40px;

  background:
    #f5f7fb;

}


/* ==================================================
   HEADER
================================================== */

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

  font-size:
    15px;

}


.refresh-btn {

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

  font-size:
    14px;

  font-weight:
    700;

  cursor:
    pointer;

  transition:
    .2s;

}


.refresh-btn:hover {

  background:
    #2563eb;

  transform:
    translateY(-1px);

}


.refresh-btn:disabled {

  opacity:
    .6;

  cursor:
    not-allowed;

}


/* ==================================================
   STATS
================================================== */

.stats {

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    20px;

  margin-bottom:
    28px;

}


.stat-card {

  background:
    white;

  border-radius:
    14px;

  padding:
    22px;

  display:
    flex;

  align-items:
    center;

  gap:
    16px;

  box-shadow:
    0 5px 20px
    rgba(15,23,42,.06);

  transition:
    .2s;

}


.stat-card:hover {

  transform:
    translateY(-3px);

  box-shadow:
    0 10px 25px
    rgba(15,23,42,.09);

}


.stat-icon {

  width:
    50px;

  height:
    50px;

  border-radius:
    12px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    23px;

}


.stat-icon.blue {

  background:
    #dbeafe;

}


.stat-icon.yellow {

  background:
    #fef3c7;

}


.stat-icon.green {

  background:
    #dcfce7;

}


.stat-icon.red {

  background:
    #fee2e2;

}


.stat-card span {

  display:
    block;

  color:
    #6b7280;

  font-size:
    13px;

  margin-bottom:
    5px;

}


.stat-card strong {

  font-size:
    26px;

  color:
    #111827;

}


/* ==================================================
   LOADING
================================================== */

.loading {

  background:
    white;

  border-radius:
    16px;

  padding:
    70px;

  text-align:
    center;

  color:
    #6b7280;

}


.spinner {

  width:
    42px;

  height:
    42px;

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


/* ==================================================
   REVIEW CARD
================================================== */

.review-card {

  background:
    white;

  border-radius:
    16px;

  box-shadow:
    0 8px 30px
    rgba(15,23,42,.07);

  overflow:
    hidden;

}


.card-header {

  padding:
    24px 28px;

  border-bottom:
    1px solid #eef0f4;

}


.card-header h2 {

  margin:
    0 0 5px;

  color:
    #111827;

  font-size:
    20px;

}


.card-header p {

  margin:
    0;

  color:
    #6b7280;

  font-size:
    14px;

}


/* ==================================================
   REVIEW ITEM
================================================== */

.review-item {

  padding:
    25px 28px;

  border-bottom:
    1px solid #eef0f4;

  transition:
    .2s;

}


.review-item:last-child {

  border-bottom:
    none;

}


.review-item:hover {

  background:
    #fafbfc;

}


/* ==================================================
   TOP
================================================== */

.review-top {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom:
    22px;

}


.product-info {

  display:
    flex;

  align-items:
    center;

  gap:
    14px;

}


.product-icon {

  width:
    48px;

  height:
    48px;

  border-radius:
    12px;

  background:
    #eef4ff;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    22px;

}


.product-info h3 {

  margin:
    0 0 4px;

  color:
    #111827;

  font-size:
    17px;

}


.product-label {

  color:
    #9ca3af;

  font-size:
    12px;

}


/* ==================================================
   RATING
================================================== */

.rating {

  display:
    flex;

  align-items:
    center;

  gap:
    3px;

  padding:
    8px 13px;

  background:
    #fff8e1;

  border-radius:
    10px;

}


.star {

  color:
    #d1d5db;

  font-size:
    18px;

}


.star.active {

  color:
    #f59e0b;

}


.rating strong {

  margin-left:
    7px;

  color:
    #92400e;

  font-size:
    13px;

}


/* ==================================================
   BODY
================================================== */

.review-body {

  display:
    grid;

  grid-template-columns:
    220px 1fr auto;

  gap:
    20px;

  align-items:
    center;

}


/* ==================================================
   CUSTOMER
================================================== */

.customer {

  display:
    flex;

  align-items:
    center;

  gap:
    12px;

}


.avatar {

  width:
    44px;

  height:
    44px;

  border-radius:
    50%;

  background:
    #111827;

  color:
    white;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-weight:
    800;

}


.customer strong {

  display:
    block;

  color:
    #111827;

}


.customer span {

  display:
    block;

  color:
    #9ca3af;

  font-size:
    12px;

  margin-top:
    3px;

}


/* ==================================================
   COMMENT
================================================== */

.comment-box {

  background:
    #f8fafc;

  border:
    1px solid #e8edf3;

  border-radius:
    12px;

  padding:
    15px 17px;

}


.comment-title {

  color:
    #64748b;

  font-size:
    12px;

  font-weight:
    700;

  margin-bottom:
    7px;

}


.comment-box p {

  margin:
    0;

  color:
    #374151;

  line-height:
    1.5;

}


/* ==================================================
   STATUS
================================================== */

.status {

  display:
    inline-flex;

  align-items:
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


.status.replied {

  background:
    #dcfce7;

  color:
    #15803d;

}


.status.waiting {

  background:
    #fef3c7;

  color:
    #a16207;

}


/* ==================================================
   REPLY
================================================== */

.reply-section {

  margin-top:
    22px;

  padding:
    18px;

  background:
    #f8fafc;

  border:
    1px solid #e8edf3;

  border-radius:
    12px;

}


.reply-label {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom:
    10px;

}


.reply-label span {

  font-weight:
    700;

  color:
    #111827;

}


.reply-label small {

  color:
    #9ca3af;

}


textarea {

  width:
    100%;

  min-height:
    90px;

  box-sizing:
    border-box;

  padding:
    13px 15px;

  border:
    1px solid #dbe1e8;

  border-radius:
    10px;

  background:
    white;

  font-family:
    inherit;

  font-size:
    14px;

  resize:
    vertical;

  outline:
    none;

  transition:
    .2s;

}


textarea:focus {

  border-color:
    #2563eb;

  box-shadow:
    0 0 0 3px
    rgba(37,99,235,.10);

}


/* ==================================================
   REPLY FOOTER
================================================== */

.reply-footer {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-top:
    12px;

}


.reply-footer > span {

  color:
    #9ca3af;

  font-size:
    12px;

}


.actions {

  display:
    flex;

  gap:
    10px;

}


.save-btn,
.delete-btn {

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


.save-btn {

  background:
    #2563eb;

  color:
    white;

}


.save-btn:hover {

  background:
    #1d4ed8;

  transform:
    translateY(-1px);

}


.save-btn:disabled {

  opacity:
    .6;

  cursor:
    not-allowed;

}


.delete-btn {

  background:
    #fee2e2;

  color:
    #dc2626;

}


.delete-btn:hover {

  background:
    #dc2626;

  color:
    white;

}


/* ==================================================
   EMPTY
================================================== */

.empty {

  text-align:
    center;

  padding:
    80px 20px;

}


.empty-icon {

  font-size:
    50px;

  margin-bottom:
    12px;

}


.empty h3 {

  margin:
    0 0 7px;

  color:
    #111827;

}


.empty p {

  margin:
    0;

  color:
    #9ca3af;

}


/* ==================================================
   RESPONSIVE
================================================== */

@media(max-width:1100px) {

  .stats {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .review-body {

    grid-template-columns:
      1fr;

  }


  .reply-status {

    justify-self:
      start;

  }

}


@media(max-width:700px) {

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


  .refresh-btn {

    width:
      100%;

  }


  .stats {

    grid-template-columns:
      1fr;

  }


  .review-item {

    padding:
      20px;

  }


  .review-top {

    flex-direction:
      column;

    align-items:
      flex-start;

    gap:
      15px;

  }


  .reply-footer {

    flex-direction:
      column;

    align-items:
      flex-start;

    gap:
      12px;

  }


  .actions {

    width:
      100%;

  }


  .save-btn,
  .delete-btn {

    flex:
      1;

  }

}

</style>