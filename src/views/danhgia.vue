<template>
  <div class="review-page">
    <div class="review-container">

      <!-- Tiêu đề -->
      <div class="review-header">
        <h1>Đánh giá sản phẩm</h1>
        <p>Chia sẻ trải nghiệm của bạn về sản phẩm</p>
      </div>

      <!-- Đang tải -->
      <div v-if="loading" class="loading-card">
        <div class="loading-spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>

      <template v-else>

        <!-- Form đánh giá -->
        <div class="review-card" v-if="user">
          <div class="card-title">
            <span class="star-icon">★</span>
            <div>
              <h2>Viết đánh giá</h2>
              <p>Đánh giá của bạn sẽ giúp những khách hàng khác có thêm thông tin.</p>
            </div>
          </div>

          <div class="form-group">
            <label>Mức độ đánh giá</label>

            <select v-model.number="star" class="rating-select">
              <option :value="5">★★★★★ - Rất tốt</option>
              <option :value="4">★★★★☆ - Tốt</option>
              <option :value="3">★★★☆☆ - Bình thường</option>
              <option :value="2">★★☆☆☆ - Chưa tốt</option>
              <option :value="1">★☆☆☆☆ - Không hài lòng</option>
            </select>
          </div>

          <div class="form-group">
            <label>Nội dung đánh giá</label>

            <textarea
              v-model="comment"
              class="review-textarea"
              maxlength="500"
              placeholder="Hãy chia sẻ trải nghiệm của bạn..."
              rows="5"
            ></textarea>

            <div class="character-count">
              {{ comment.length }}/500 ký tự
            </div>
          </div>

          <button
            class="submit-review"
            type="button"
            @click="gui"
            :disabled="submitting"
          >
            <span>★</span>
            {{ submitting ? "Đang gửi..." : "Gửi đánh giá" }}
          </button>
        </div>

        <!-- Chưa đăng nhập -->
        <div class="login-card" v-else>
          <div class="login-icon">🔐</div>

          <h2>Đăng nhập để đánh giá</h2>

          <p>
            Bạn cần đăng nhập tài khoản để có thể gửi đánh giá sản phẩm.
          </p>

          <RouterLink to="/dangnhap" class="login-button">
            Đăng nhập
          </RouterLink>
        </div>

        <!-- Danh sách đánh giá -->
        <div class="reviews-list">
          <div class="reviews-title">
            <div>
              <h2>Đánh giá từ khách hàng</h2>
              <p class="reviews-subtitle">
                Những chia sẻ thực tế từ khách hàng đã mua sản phẩm
              </p>
            </div>

            <span class="review-count">
              {{ product.reviews?.length || 0 }} đánh giá
            </span>
          </div>

          <template v-if="product.reviews?.length">
            <div
              v-for="item in product.reviews"
              :key="item._id"
              class="review-item"
            >
              <div class="review-user">
                <div class="avatar">
                  {{ getReviewerName(item).charAt(0).toUpperCase() || "U" }}
                </div>

                <div>
                  <h3>{{ getReviewerName(item) }}</h3>

                  <div class="stars">
                    {{ "★".repeat(Number(item.rating) || 0) }}
                    <span>
                      {{ "☆".repeat(5 - (Number(item.rating) || 0)) }}
                    </span>
                  </div>
                </div>
              </div>

              <p class="review-content">
                {{ item.comment }}
              </p>

              <!-- Phản hồi Admin -->
              <div
                v-if="item.adminReply"
                class="admin-reply"
              >
                <div class="reply-title">
                  <span>🏪</span>
                  Phản hồi từ DAT MOBILE
                </div>

                <p>{{ item.adminReply }}</p>
              </div>
            </div>
          </template>

          <!-- Không có đánh giá -->
          <div v-else class="empty-review">
            <div>💬</div>

            <h3>Chưa có đánh giá</h3>

            <p>
              Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm.
            </p>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const star = ref(5);
const comment = ref("");
const loading = ref(true);
const submitting = ref(false);

const token = localStorage.getItem("token");

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Không đọc được thông tin user:", error);
    return null;
  }
};

const user = ref(getUserFromStorage());

const product = ref({
  reviews: []
});

// Lấy thông tin sản phẩm theo ID trên URL
const loadProduct = async () => {
  try {
    const productId = route.params.productId;

    if (!productId) {
      console.error("Không tìm thấy productId trên URL");
      return;
    }

    const res = await axios.get(`/sanpham/${productId}`);

    product.value = res.data || {
      reviews: []
    };

    if (!Array.isArray(product.value.reviews)) {
      product.value.reviews = [];
    }
  } catch (err) {
    console.error("Lỗi tải thông tin sản phẩm:", err);
  } finally {
    loading.value = false;
  }
};

// Lấy tên người đánh giá, hỗ trợ nhiều dạng dữ liệu
const getReviewerName = (item) => {
  if (item?.name) return item.name;
  if (item?.user?.name) return item.user.name;
  if (item?.user?.hoTen) return item.user.hoTen;
  if (item?.user?.email) return item.user.email;

  return "Khách hàng";
};

// Gửi đánh giá
const gui = async () => {
  if (!token) {
    alert("Vui lòng đăng nhập để đánh giá sản phẩm.");
    router.push("/dangnhap");
    return;
  }

  if (!comment.value.trim()) {
    alert("Vui lòng nhập nội dung đánh giá.");
    return;
  }

  if (comment.value.length > 500) {
    alert("Nội dung đánh giá không được vượt quá 500 ký tự.");
    return;
  }

  try {
    submitting.value = true;

    const productId = route.params.productId;

    await axios.post(
      `/sanpham/${productId}/reviews`,
      {
        rating: star.value,
        comment: comment.value.trim()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Đánh giá thành công!");

    comment.value = "";
    star.value = 5;

    // Tải lại sản phẩm để hiển thị đánh giá vừa gửi
    await loadProduct();

    // Giữ người dùng ở lại trang đánh giá để xem kết quả
  } catch (err) {
    console.error("Lỗi gửi đánh giá:", err);

    alert(
      err.response?.data?.message ||
      "Đánh giá thất bại. Vui lòng thử lại."
    );
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadProduct();
});
</script>

<style scoped>

.review-page {
  min-height: calc(100vh - 80px);
  background: #f5f5f5;
  padding: 50px 20px 80px;
}

.review-container {
  max-width: 900px;
  margin: 0 auto;
}

/* =========================
   HEADER
========================= */

.review-header {
  text-align: center;
  margin-bottom: 35px;
}

.review-header h1 {
  font-size: 36px;
  margin: 0 0 10px;
  color: #111827;
}

.review-header p {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

/* =========================
   REVIEW CARD
========================= */

.review-card {
  background: white;
  border-radius: 18px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 35px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.star-icon {
  width: 50px;
  height: 50px;
  background: #fff7ed;
  color: #f59e0b;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;
}

.card-title h2 {
  margin: 0 0 5px;
  font-size: 22px;
  color: #111827;
}

.card-title p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* =========================
   FORM
========================= */

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 9px;

  font-weight: 600;
  color: #374151;
}

.rating-select {
  width: 100%;
  height: 48px;

  border: 1px solid #d1d5db;
  border-radius: 10px;

  padding: 0 14px;

  font-size: 16px;
  background: white;

  outline: none;
  cursor: pointer;
}

.rating-select:focus {
  border-color: #111827;
}

/* =========================
   TEXTAREA
========================= */

.review-textarea {
  width: 100%;
  box-sizing: border-box;

  min-height: 130px;

  padding: 14px;

  border: 1px solid #d1d5db;
  border-radius: 10px;

  font-family: inherit;
  font-size: 15px;

  resize: vertical;
  outline: none;
}

.review-textarea:focus {
  border-color: #111827;
}

.character-count {
  text-align: right;

  margin-top: 6px;

  color: #9ca3af;
  font-size: 13px;
}

/* =========================
   BUTTON
========================= */

.submit-review {
  width: 100%;

  height: 50px;

  border: none;
  border-radius: 10px;

  background: #111827;
  color: white;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.submit-review:hover {
  background: #000;
  transform: translateY(-1px);
}

.submit-review span {
  color: #fbbf24;
  margin-right: 8px;
}

/* =========================
   LOGIN
========================= */

.login-card {
  background: white;

  border-radius: 18px;

  padding: 45px 30px;

  text-align: center;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

  margin-bottom: 35px;
}

.login-icon {
  font-size: 45px;
  margin-bottom: 15px;
}

.login-card h2 {
  margin: 0 0 10px;
}

.login-card p {
  color: #6b7280;
  margin-bottom: 25px;
}

.login-button {
  display: inline-block;

  padding: 12px 28px;

  background: #111827;
  color: white;

  text-decoration: none;

  border-radius: 10px;

  font-weight: 600;
}

/* =========================
   REVIEWS LIST
========================= */

.reviews-list {
  background: white;

  border-radius: 18px;

  padding: 30px;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.reviews-title {
  display: flex;

  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #e5e7eb;

  padding-bottom: 18px;

  margin-bottom: 20px;
}

.reviews-title h2 {
  margin: 0;

  font-size: 22px;
}

.reviews-title span {
  color: #6b7280;
  font-size: 14px;
}

/* =========================
   REVIEW ITEM
========================= */

.review-item {
  padding: 22px 0;

  border-bottom: 1px solid #e5e7eb;
}

.review-item:last-child {
  border-bottom: none;
}

.review-user {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 12px;
}

.avatar {
  width: 44px;
  height: 44px;

  border-radius: 50%;

  background: #111827;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  font-size: 18px;
}

.review-user h3 {
  margin: 0 0 4px;

  font-size: 16px;
}

.stars {
  color: #f59e0b;

  font-size: 16px;
  letter-spacing: 1px;
}

.stars span {
  color: #d1d5db;
}

.review-content {
  margin: 10px 0 0 56px;

  color: #374151;

  line-height: 1.6;
}

/* =========================
   ADMIN REPLY
========================= */

.admin-reply {
  margin: 15px 0 0 56px;

  padding: 15px;

  background: #f9fafb;

  border-left: 4px solid #111827;

  border-radius: 8px;
}

.reply-title {
  font-weight: 600;

  margin-bottom: 7px;

  color: #111827;
}

.admin-reply p {
  margin: 0;

  color: #4b5563;

  line-height: 1.5;
}

/* =========================
   EMPTY
========================= */

.empty-review {
  text-align: center;

  padding: 50px 20px;

  color: #6b7280;
}

.empty-review div {
  font-size: 45px;

  margin-bottom: 10px;
}

.empty-review h3 {
  margin: 0 0 8px;

  color: #374151;
}

.empty-review p {
  margin: 0;
}

/* =========================
   LOADING
========================= */

.loading-card {
  background: white;
  border-radius: 18px;
  padding: 45px 30px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 35px;
}

.loading-spinner {
  width: 34px;
  height: 34px;
  margin: 0 auto 12px;
  border: 4px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: review-spin 0.8s linear infinite;
}

.loading-card p {
  margin: 0;
  color: #6b7280;
}

@keyframes review-spin {
  to {
    transform: rotate(360deg);
  }
}

.reviews-subtitle {
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.review-count {
  flex-shrink: 0;
  padding: 7px 12px;
  border-radius: 20px;
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 768px) {

  .review-page {
    padding: 30px 15px 50px;
  }

  .review-header h1 {
    font-size: 28px;
  }

  .review-card,
  .reviews-list {
    padding: 20px;
  }

  .review-content,
  .admin-reply {
    margin-left: 0;
  }

  .reviews-title {
    align-items: flex-start;
    gap: 10px;
  }

}

</style>