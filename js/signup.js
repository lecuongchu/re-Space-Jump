// Xử lý đăng ký tài khoản người dùng
import { signUp } from "../js/firebase/auth.js";

// Kiểm tra email hợp lệ
function validateEmail(email) {
    return email.includes("@");
}

// Kiểm tra độ dài mật khẩu
function validatePassword(password) {
    return password.length >= 6;
}

// Bắt sự kiện khi người dùng bấm nút đăng ký
const signupBtn = document.getElementById("signup-button");
if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
        const fullname = document.getElementById("signup-fullname").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Kiểm tra dữ liệu hợp lệ
        if (!fullname) return alert("Vui lòng nhập họ tên");
        if (!validateEmail(email)) return alert("Email không hợp lệ");
        if (!validatePassword(password)) return alert("Mật khẩu phải >= 6 ký tự");
        if (password !== confirmPassword) return alert("Mật khẩu nhập lại không khớp");

        // Gọi hàm đăng ký Firebase, role_id = 2 (người dùng thường)
        signUp(email, password, 2).then(() => {
            alert("Đăng ký thành công!");
            window.location.href = "index.html"; // chuyển về trang chính
        });
    });
}
