import { db } from "./firebase/firebase-config.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { uploadimg } from "./uploadimg.js";
import { userSession } from "./userSession.js";


// ==== 1. DOM ==== //
const form = document.getElementById("productForm");
const statusEl = document.getElementById("status");
const productList = document.getElementById("productList");

// ==== 2. Render sản phẩm từ Firestore ==== //
async function renderProducts() {
  productList.innerHTML = "⏳ Đang tải sản phẩm...";
  try {
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) {
      productList.innerHTML = "<p class='text-gray-500 italic'>Chưa có sản phẩm nào.</p>";
      return;
    }

    productList.innerHTML = snap.docs.map(docSnap => {
      const p = docSnap.data();
      return `
        <div class="border rounded-lg p-4 shadow hover:shadow-md transition flex flex-col">
          <img src="${p.image}" alt="${p.name}" class="h-48 w-full object-contain mb-3"/>
          <h3 class="font-semibold text-lg">${p.name}</h3>
          <p class="text-sm text-gray-500">${p.code || ""}</p>
          <p class="text-red-600 font-bold mt-1">${Number(p.price).toLocaleString()}₫</p>
          <p class="mt-1">${"⭐".repeat(p.rating || 0)}</p>
          <button data-id="${docSnap.id}" 
            class="deleteBtn mt-3 bg-red-500 hover:bg-red-600 text-white py-1 rounded">
            🗑 Xóa
          </button>
        </div>
      `;
    }).join("");

    // Gắn sự kiện cho nút Xóa
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
          await deleteDoc(doc(db, "products", btn.dataset.id));
          renderProducts(); // reload
        }
      });
    });
  } catch (err) {
    console.error("❌ Lỗi load sản phẩm:", err);
    productList.innerHTML = "<p class='text-red-600'>Lỗi khi tải sản phẩm</p>";
  }
}

// ==== 3. Submit form thêm sản phẩm ==== //
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    statusEl.textContent = "⏳ Đang upload ảnh...";
    const name = document.getElementById("name").value.trim();
    const code = document.getElementById("code").value.trim();
    const price = Number(document.getElementById("price").value);
    const rating = Number(document.getElementById("rating").value) || 0;
    const imageUrl = document.getElementById("imageUrl").value.trim();

    if (!name || !price || !imageUrl) {
      statusEl.textContent = "⚠️ Vui lòng nhập đủ tên, giá và link ảnh.";
      return;
    }

    const cloudinaryUrl = await uploadimg(imageUrl);

    await addDoc(collection(db, "products"), {
      name, code, price, rating,
      image: cloudinaryUrl,
      createdAt: serverTimestamp()
    });

    statusEl.textContent = "✅ Thêm sản phẩm thành công!";
    form.reset();
    renderProducts();
  } catch (err) {
    console.error("❌ Lỗi thêm sản phẩm:", err);
    statusEl.textContent = "❌ " + err.message;
  }
});

renderProducts();



