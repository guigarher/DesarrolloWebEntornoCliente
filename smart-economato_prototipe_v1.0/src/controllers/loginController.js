import { AuthService } from "../services/authservice.js";
import { LoginUI } from "../views/loginui.js";

document.addEventListener("DOMContentLoaded", () =>{
    const form =  document.getElementById("login-form")

    form.addEventListener("submit", async (e) =>{

        e.preventDefault();
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value

        

        try {
            if(!username || !password){
            LoginUI.showMessage("Por favor, complete todos los campos", "error");
            return;
        }
            const user = await AuthService.login(username, password)

            if (!user) {
                // El servicio ha devuelto null porque no hay coincidencias
                LoginUI.showMessage("Usuario o contraseña incorrectos", "error");
                return;
            }

            window.location.href = "index.html"
        } catch (error) {
            LoginUI.showMessage(error.message, "error");
        }
    })
})