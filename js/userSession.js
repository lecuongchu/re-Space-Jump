// Quản lý thông tin đăng nhập và người dùng
export const userSession = {
    // Lưu thông tin phiên đăng nhập vào localStorage
    saveSession(user, additionalInfo = {}) {
        const sessionData = {
            uid: user.uid, // ID người dùng
            email: user.email, // Email đăng nhập
            displayName: user.displayName || "", // Tên hiển thị
            photoURL: user.photoURL || "", // Ảnh đại diện
            ...additionalInfo // Các thông tin bổ sung (ví dụ: role_id)
        };
        localStorage.setItem("userSession", JSON.stringify(sessionData));
    },

    // Lưu thêm thông tin chi tiết người dùng (không chỉ session)
    saveUserInfo(userInfo) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },

    // Lấy dữ liệu phiên đăng nhập hiện tại
    getSession() {
        const data = localStorage.getItem("userSession");
        return data ? JSON.parse(data) : null;
    },

    // Lấy thông tin người dùng chi tiết
    getUserInfo() {
        const data = localStorage.getItem("userInfo");
        return data ? JSON.parse(data) : null;
    },

    // Xóa toàn bộ thông tin phiên khi đăng xuất
    clearSession() {
        localStorage.removeItem("userSession");
        localStorage.removeItem("userInfo");
    }
};
