import { signIn } from "../js/firebase/auth.js";
import { auth } from "../js/firebase/firebase-config.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

function validateEmail(email) {
    return email.includes("@");
}

function validatePassword(password) {
    return password.length >= 6;
}

const loginBtn = document.getElementById("login-button");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        if (!validateEmail(email)) return alert("Email không hợp lệ");
        if (!validatePassword(password)) return alert("Mật khẩu phải >= 6 ký tự");

        try {
            await signIn(email, password);
            alert("Đăng nhập thành công!");
            window.location.href = "index.html";
        } catch (err) {
            alert("Đăng nhập thất bại: " + err.message);
            console.error("❌ Lỗi login:", err);
        }
    });
}

const googleBtn = document.getElementById("google-button");
if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            alert(`Đăng nhập Google thành công: ${result.user.email}`);
            window.location.href = "index.html";
        } catch (err) {
            alert("Lỗi đăng nhập Google: " + err.message);
        }
    });
}
