// Trang chính: hiển thị danh sách sản phẩm và xử lý tìm kiếm
import { signOutUser } from "../js/firebase/auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { userSession } from "./userSession.js";

// Đăng xuất người dùng
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOutUser().then(() => {
      alert("Đăng xuất thành công!");
      window.location.href = "html/login.html";
    });
  });
}

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZ4U4Q2X3hUtmFO-4DyQ7CJdfS93tMcp8",
  authDomain: "spck-bf296.firebaseapp.com",
  projectId: "spck-bf296",
  storageBucket: "spck-bf296.firebasestorage.app",
  messagingSenderId: "438852280303",
  appId: "1:438852280303:web:31e4e145abaeb303bc601a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hàm hiển thị sao đánh giá
function renderStars(rating = 0) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "⭐" : "☆";
  }
  return stars;
}

// Hiển thị danh sách sản phẩm trên trang chủ
function renderProducts(products) {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = products.map(product => `
    <div class="border rounded-lg p-4 shadow hover:shadow-lg transition text-center cursor-pointer"
         onclick="window.location.href='html/product.html?id=${product.id}'">
      <img src="${product.image}" alt="${product.name}" class="mx-auto mb-4 h-48 object-contain">
      <h3 class="font-semibold text-lg">${product.name}</h3>
      <p class="text-sm text-gray-600">${product.code || ''}</p>
      <div class="flex justify-center mt-1">
        ${renderStars(product.rating)}
      </div>
      <p class="text-red-600 font-bold mt-2">
        ${Number(product.price).toLocaleString()}₫
      </p>
    </div>
  `).join("");
}

// Lấy toàn bộ sản phẩm từ Firestore
async function fetchAllProducts() {
  try {
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
    return [];
  }
}

let allProducts = [];

// Khởi tạo sản phẩm ban đầu
async function initProducts() {
  allProducts = await fetchAllProducts();
  renderProducts(allProducts);
}

initProducts();

// Xử lý tìm kiếm sản phẩm theo tên hoặc mã
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      (p.code && p.code.toLowerCase().includes(keyword))
    );
    renderProducts(filtered);
  });
}

// Nút mở giỏ hàng
const cartBtn = document.getElementById("cartBtn");
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    window.location.href = "./html/cart.html";
  });
}

// Nút mở trang admin (chỉ hiển thị nếu là admin)
const adminBtn = document.getElementById("adminBtn");
if (adminBtn) {
  adminBtn.addEventListener("click", () => {
    window.location.href = "./html/admin.html";
  });
}

// Hiển thị email và quyền của người dùng sau khi đăng nhập
document.addEventListener("DOMContentLoaded", () => {
  const session = userSession.getSession();

  // Hiển thị email người dùng
  const emailEl = document.getElementById("userEmail");
  if (session && session.email && emailEl) {
    emailEl.textContent = session.email;
  }

  // Nếu là admin (role_id = 1) thì hiển thị nút admin
  if (session && Number(session.role_id) === 1) {
    const adminBtnEl = document.getElementById("adminBtn");
    if (adminBtnEl) adminBtnEl.classList.remove("hidden");
  }
});
