import { signUp } from "../js/firebase/auth.js";

function validateEmail(email) {
    return email.includes("@");
}

function validatePassword(password) {
    return password.length >= 6;
}

const signupBtn = document.getElementById("signup-button");
if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
        const fullname = document.getElementById("signup-fullname").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (!fullname) return alert("Vui lòng nhập họ tên");
        if (!validateEmail(email)) return alert("Email không hợp lệ");
        if (!validatePassword(password)) return alert("Mật khẩu phải >= 6 ký tự");
        if (password !== confirmPassword) return alert("Mật khẩu nhập lại không khớp");
        signUp(email, password, 2).then(() => {
            alert("Đăng ký thành công!");
            window.location.href = "index.html";
        });
    }
)};
