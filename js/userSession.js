export const userSession = {
    saveSession(user, additionalInfo = {}) {
        const sessionData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            ...additionalInfo
        };
        localStorage.setItem("userSession", JSON.stringify(sessionData));
    },

    saveUserInfo(userInfo) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },

    getSession() {
        const data = localStorage.getItem("userSession");
        return data ? JSON.parse(data) : null;
    },

    getUserInfo() {
        const data = localStorage.getItem("userInfo");
        return data ? JSON.parse(data) : null;
    },

    clearSession() {
        localStorage.removeItem("userSession");
        localStorage.removeItem("userInfo");
    }
};
