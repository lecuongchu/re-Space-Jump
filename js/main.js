import { signOutUser } from "../js/firebase/auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { userSession } from "./userSession.js";

// Đăng xuất
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOutUser().then(() => {
      alert("Đăng xuất thành công!");
      window.location.href = "html/login.html";
    });
  });
}

// Firebase config
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

// Render sao đánh giá
function renderStars(rating = 0) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "⭐" : "☆";
  }
  return stars;
}

// Render danh sách sản phẩm
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
    console.error("❌ Lỗi khi tải sản phẩm:", err);
    return [];
  }
}

let allProducts = [];

async function initProducts() {
  allProducts = await fetchAllProducts();
  renderProducts(allProducts);
}

initProducts();

// Tìm kiếm sản phẩm
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

// Nút giỏ hàng
const cartBtn = document.getElementById("cartBtn");
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    window.location.href = "./html/cart.html";
  });
}

// Nút admin
const adminBtn = document.getElementById("adminBtn");
if (adminBtn) {
  adminBtn.addEventListener("click", () => {
    window.location.href = "./html/admin.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const session = userSession.getSession();

  // Hiển thị email nếu có
  const emailEl = document.getElementById("userEmail");
  if (session && session.email && emailEl) {
    emailEl.textContent = session.email;
  }

  // Hiển thị nút admin nếu role_id = 1
  if (session && Number(session.role_id) === 1) {
    const adminBtnEl = document.getElementById("adminBtn");
    if (adminBtnEl) adminBtnEl.classList.remove("hidden");
  }
});
