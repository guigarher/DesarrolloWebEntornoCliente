export const UI = {
  showMessage(message, type = "error") {
    const msgElement = document.getElementById("loginMessage");
    msgElement.textContent = message;
    msgElement.className = `message ${type}`;
  },
  clearMessage() {
    const msgElement = document.getElementById("loginMessage");
    msgElement.textContent = "";
    msgElement.className = "message";
  }
};