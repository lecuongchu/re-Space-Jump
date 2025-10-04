// js/orders.js
import { userSession } from "./userSession.js";
import { db } from "./firebase/firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs
  // nếu muốn sắp xếp theo thời gian thì thêm: orderBy
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ==== Kiểm tra đăng nhập ====
  const session = userSession.getSession();
  if (!session) {
    alert("❌ Bạn cần đăng nhập để xem lịch sử mua hàng!");
    window.location.href = "../html/login.html";
    return;
  }

  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = "<p class='text-gray-500'>Đang tải...</p>";

  try {
    // ==== Query đơn hàng ====
    const q = query(
      collection(db, "orders"),
      where("uid", "==", session.uid)
      // Nếu chắc chắn có createdAt thì thêm: , orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    // ==== Nếu không có đơn hàng ====
    if (snapshot.empty) {
      ordersList.innerHTML = `
        <div class="text-center py-10">
          <p class="text-gray-600 text-lg mb-4">📭 Bạn chưa có đơn hàng nào</p>
          <a href="../index.html" 
             class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            ➕ Tiếp tục mua sắm
          </a>
        </div>
      `;
      return;
    }

    // ==== Render danh sách đơn hàng ====
    ordersList.innerHTML = "";
    snapshot.forEach(docSnap => {
      const order = docSnap.data();
      console.log("Order data:", order); // Debug

      const date = order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleString("vi-VN")
        : "Không rõ thời gian";

      const orderDiv = document.createElement("div");
      orderDiv.className = "border-b last:border-b-0 py-6 text-left";
      orderDiv.innerHTML = `
        <h2 class="font-semibold text-lg mb-2">🗓 ${date}</h2>
        <p class="text-red-600 font-bold mb-2">Tổng: ${order.total?.toLocaleString() || 0}₫</p>
        <div class="space-y-2">
          ${order.items
          .map(
            item => `
            <div class="flex justify-between text-gray-700">
              <span>${item.name} × ${item.quantity}</span>
              <span>${(item.price * item.quantity).toLocaleString()}₫</span>
            </div>
          `
          )
          .join("")}
        </div>
        <p class="mt-2 text-sm text-gray-500">
          Giao cho: ${order.shippingInfo?.fullName || ""}, 
          ${order.shippingInfo?.address || ""}, 
          ĐT: ${order.shippingInfo?.phone || ""}
        </p>
      `;
      ordersList.appendChild(orderDiv);
    });
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng:", error);
    ordersList.innerHTML = `<p class="text-red-600">❌ Có lỗi khi tải đơn hàng!</p>`;
  }
});
