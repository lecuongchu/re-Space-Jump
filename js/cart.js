import { db } from "./firebase/firebase-config.js";
import { collection, query, where, onSnapshot, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { userSession } from "./userSession.js";

const cartListEl = document.getElementById("cart-list");
const cartSummaryEl = document.getElementById("cart-summary");

async function renderCart(cartItems) {
  cartListEl.innerHTML = "";
  let total = 0;

  if (!cartItems || cartItems.length === 0) {
    cartListEl.innerHTML = `
      <div class="text-center py-20">
        <p class="text-2xl font-semibold text-gray-600 mb-4">🛒 Giỏ hàng của bạn đang trống</p>
        <a href="../index.html" 
           class="inline-block mt-4 px-6 py-3 bg-[#0d1b2a] text-white rounded-lg shadow hover:bg-[#1e293b] transition">
          ➕ Tiếp tục mua sắm
        </a>
      </div>
    `;
    cartSummaryEl.textContent = "";
    return;
  }

  for (const item of cartItems) {
    const productRef = doc(db, "products", item.productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) continue;
    const product = productSnap.data();

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    const rating = product.rating || 0;
    const fullStars = "⭐".repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? "✨" : "";
    const emptyStars = "☆".repeat(5 - Math.ceil(rating));

    const cartItemEl = document.createElement("div");
    cartItemEl.className = "flex bg-white p-6 rounded-2xl shadow-md mb-6 items-start gap-6 w-full";

    cartItemEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}" 
           class="w-40 h-40 object-contain bg-gray-50 rounded-xl shadow" />

      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name}</h2>
        <p class="text-gray-600">Mã SP: <span class="font-medium">${product.code || "N/A"}</span></p>
        <p class="text-gray-600">Giá: <span class="font-semibold">${Number(product.price).toLocaleString()}₫</span></p>
        <p class="text-gray-600">Số lượng: <span class="font-semibold">${item.quantity}</span></p>
        <p class="text-red-600 font-bold text-lg mt-2">Tạm tính: ${itemTotal.toLocaleString()}₫</p>

        <p class="text-gray-700 mt-2">Mô tả: ${product.shortDescription || "Chưa có mô tả"}</p>
        <div class="mt-2 text-yellow-500 text-lg">
          ${fullStars}${halfStar}${emptyStars} 
          <span class="text-sm text-gray-500 ml-2">(${rating}/5)</span>
        </div>
      </div>

      <button class="delete-btn bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition text-lg">
        ❌ Xóa
      </button>
    `;

    cartItemEl.querySelector(".delete-btn").addEventListener("click", async () => {
      await deleteDoc(doc(db, "carts", item.id));
      alert("🗑️ Đã xóa sản phẩm khỏi giỏ");
    });

    cartListEl.appendChild(cartItemEl);
  }

  cartSummaryEl.textContent = `Tổng cộng: ${total.toLocaleString()}₫`;
}

function loadCart() {
  const session = userSession.getSession();
  if (!session) {
    cartListEl.innerHTML = `<p class="text-center text-red-600">❌ Bạn cần đăng nhập để xem giỏ hàng</p>`;
    return;
  }

  const q = query(collection(db, "carts"), where("uid", "==", session.uid));

  onSnapshot(q, (snapshot) => {
    const cartItems = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    renderCart(cartItems);
  });
}

loadCart();
