import { db } from "./firebase/firebase-config.js";
import { doc, onSnapshot, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { userSession } from "./userSession.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
console.log("🔎 Product ID:", productId);

function renderStars(rating = 0) {
  const maxStars = 5;
  let stars = "";
  for (let i = 1; i <= maxStars; i++) {
    stars += i <= rating ? "⭐" : "☆";
  }
  return stars;
}

function render(product) {
  document.getElementById("product-detail").innerHTML = `
    <div class="flex items-center justify-center">
      <img src="${product.image}" alt="${product.name}"
           class="w-full max-h-[550px] object-contain bg-white p-6 rounded-2xl shadow-2xl">
    </div>
    <div class="flex flex-col">
      <h2 class="text-4xl font-bold mb-4 text-gray-900 leading-snug">${product.name}</h2>
      
      <!-- Rating sao -->
      <p class="text-yellow-500 text-2xl mb-6">
        ${renderStars(product.rating || 0)} 
        <span class="text-gray-600 text-base ml-2">(${product.rating || 0}/5)</span>
      </p>

      <p class="text-gray-600 text-base mb-2">Mã SP: ${product.code || "N/A"}</p>
      <p class="text-red-600 text-3xl font-bold mb-6">
        ${Number(product.price || 0).toLocaleString()}₫
      </p>
      <div class="border-t pt-6 mt-6">
        <h3 class="text-2xl font-semibold mb-3">Mô tả chi tiết</h3>
        <p class="text-gray-800 text-lg leading-relaxed">
          ${product.longDescription || "Chưa có mô tả chi tiết sản phẩm"}
        </p>
      </div>
      <button id="add-to-cart"
        class="mt-8 bg-[#0d1b2a] text-white text-lg px-8 py-4 rounded-xl shadow hover:bg-[#1e293b] transition">
        🛒 Thêm vào giỏ hàng
      </button>
    </div>
  `;

  document.getElementById("add-to-cart").addEventListener("click", onAddToCart);
}

async function onAddToCart() {
  try {
    const session = userSession.getSession();
    if (!session) {
      alert("Bạn cần đăng nhập để thêm vào giỏ!");
      window.location.href = "../login.html";
      return;
    }

    await addDoc(collection(db, "carts"), {
      uid: session.uid,
      productId,
      quantity: 1,
      createdAt: new Date()
    });

    alert("✅ Đã thêm vào giỏ hàng!");
  } catch (err) {
    console.error("❌ Lỗi thêm giỏ hàng:", err);
    alert("❌ Thêm giỏ hàng thất bại");
  }
}

function loadProductRealtime() {
  if (!productId) {
    document.getElementById("product-detail").innerHTML =
      "<p>❌ Không tìm thấy sản phẩm (id null)</p>";
    return;
  }

  const productRef = doc(db, "products", productId);

  onSnapshot(
    productRef,
    (snap) => {
      if (!snap.exists()) {
        document.getElementById("product-detail").innerHTML =
          "<p>❌ Sản phẩm không tồn tại</p>";
        return;
      }

      const product = snap.data();
      console.log("🔄 Realtime update:", product);
      render(product);
    },
    (err) => {
      console.error("❌ Lỗi realtime:", err);
    }
  );
}

loadProductRealtime();

const cartBtn = document.getElementById("cartBtn");
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    window.location.href = "./cart.html";
  });
}
