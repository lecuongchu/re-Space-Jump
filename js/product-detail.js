// đường dẫn đúng vì product-detail.js nằm cùng cấp với folder firebase/
import { db } from "./firebase/firebase-config.js";
import { doc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { userSession } from "./userSession.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
console.log("🔎 Product ID:", productId);
  
async function loadProduct() {
  if (!productId) {
    document.getElementById("product-detail").innerHTML = "<p>❌ Không tìm thấy sản phẩm (id null)</p>";
    return;
  }

  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      document.getElementById("product-detail").innerHTML = "<p>❌ Sản phẩm không tồn tại trong Firestore</p>";
      return;
    }

    const product = productSnap.data();
    console.log("✅ Load product:", product);

    document.getElementById("product-detail").innerHTML = `
      <div>
        <img src="${product.image}" class="w-full h-[400px] object-contain bg-white p-4 rounded">
      </div>
      <div>
        <h2 class="text-3xl font-bold mb-4">${product.name}</h2>
        <p class="text-gray-600 mb-2">Mã SP: ${product.code || "N/A"}</p>
        <p class="text-red-600 text-2xl font-semibold mb-4">${Number(product.price).toLocaleString()}₫</p>
        <p class="mb-6">${product.description || "Chưa có mô tả sản phẩm"}</p>
        <button id="add-to-cart" class="bg-[#0d1b2a] text-white px-6 py-3 rounded hover:bg-[#1e293b]">
          🛒 Thêm vào giỏ hàng
        </button>
      </div>
    `;

    document.getElementById("add-to-cart").addEventListener("click", async () => {
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
    });

  } catch (err) {
    console.error("❌ Lỗi load sản phẩm:", err);
  }
}

loadProduct();
