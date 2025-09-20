// js/checkout.js
import { userSession } from "./userSession.js";
import { db } from "./firebase/firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ==== Kiểm tra đăng nhập ====
  const session = userSession.getSession();
  if (!session) {
    alert("❌ Bạn cần đăng nhập để thanh toán!");
    window.location.href = "../html/login.html";
    return;
  }

  // ==== DOM ====
  const orderSummary = document.getElementById("orderSummary");
  const orderTotalEl = document.getElementById("orderTotal");
  const checkoutForm = document.getElementById("checkoutForm");

  // ==== Lấy sản phẩm trong giỏ từ Firestore ====
  async function fetchCartItems() {
    const q = query(collection(db, "carts"), where("uid", "==", session.uid));
    const snapshot = await getDocs(q);

    const items = [];
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const productRef = doc(db, "products", data.productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) continue;
      const product = productSnap.data();

      items.push({
        id: docSnap.id,
        name: product.name,
        price: product.price,
        quantity: data.quantity,
        image: product.image || ""
      });
    }
    return items;
  }

  // ==== Render đơn hàng ====
  async function renderOrder() {
    orderSummary.innerHTML = "<p class='text-gray-500'>Đang tải đơn hàng...</p>";
    orderTotalEl.textContent = "";

    const cartItems = await fetchCartItems();

    if (!cartItems || cartItems.length === 0) {
      orderSummary.innerHTML =
        "<p class='text-gray-600'>Không có sản phẩm nào để thanh toán.</p>";
      return;
    }

    orderSummary.innerHTML = "";
    let total = 0;

    cartItems.forEach((item) => {
      const row = document.createElement("div");
      row.className = "flex justify-between items-center border-b py-3";
      row.innerHTML = `
        <div class="flex items-center gap-3">
          <img src="${item.image}" alt="${item.name}"
               class="w-12 h-12 object-contain rounded" />
          <span>${item.name} × ${item.quantity}</span>
        </div>
        <span>${(item.price * item.quantity).toLocaleString()}₫</span>
      `;
      orderSummary.appendChild(row);
      total += item.price * item.quantity;
    });

    orderTotalEl.textContent = `Tổng cộng: ${total.toLocaleString()}₫`;
  }

  // ==== Xử lý thanh toán & xoá giỏ hàng ====
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Xoá toàn bộ sản phẩm trong giỏ của user
      const q = query(collection(db, "carts"), where("uid", "==", session.uid));
      const snap = await getDocs(q);
      const deletes = snap.docs.map((d) => deleteDoc(doc(db, "carts", d.id)));
      await Promise.all(deletes);

      alert("✅ Đặt hàng thành công!");
      window.location.href = "../index.html";
    });
  }

  renderOrder();
});
