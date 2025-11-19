export const LoginUI = {
    showMessage(message, type) {
        const msgElement = document.getElementById("loginMessage");
        msgElement.textContent = message;
        msgElement.className = `${type}`
    }
}
