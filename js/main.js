import { signOutUser } from "../js/firebase/auth.js";

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', (e) => {
    signOutUser().then(() => {
        alert("Đăng xuất thành công!");
        window.location.href = "html/login.html";
    })
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

async function loadProducts() {
  console.log("Loading products..."); 
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const productList = document.getElementById("product-list");
    productList.innerHTML = products.map(product => `
      <div class="border rounded-lg p-4 shadow hover:shadow-lg transition text-center cursor-pointer"
           onclick="window.location.href='html/product.html?id=${product.id}'">
        <img src="${product.image}" alt="${product.name}" class="mx-auto mb-4 h-48 object-contain">
        <h3 class="font-semibold text-lg">${product.name}</h3>
        <p class="text-sm text-gray-600">${product.code}</p>
        <div class="flex justify-center mt-1">
          ${renderStars(product.rating)}
        </div>
        <p class="text-red-600 font-bold mt-2">
          ${Number(product.price).toLocaleString()}₫
        </p>
      </div>
    `).join("");
  } catch (err) {
    console.error("❌ Lỗi khi tải sản phẩm:", err);
  }
}


function renderStars(rating = 0) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? "⭐" : "☆";
    }
    return stars;
}

loadProducts();

const cartBtn = document.getElementById("cartBtn");
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    window.location.href = "./html/cart.html";
  });
}

import { userSession } from "./userSession.js";

const adminBtn = document.getElementById("adminBtn");

const session = userSession.getSession();
if (session && session.additionalInfo && session.additionalInfo.role_id === 1) {
  adminBtn.classList.remove("hidden");
  adminBtn.addEventListener("click", () => {
    window.location.href = "./html/admin.html";
  });
}