import { AuthService } from "../services/authservice.js";

document.addEventListener("DOMContentLoaded", () =>{
    const form =  document.getElementById("login-form")

    form.addEventListener("submit", async (e) =>{

        e.preventDefault();
        const usuario = document.getElementById("username").value
        const pass = document.getElementById("password").value

        try {
            const user = await AuthService.login(username, password)

            window.location.href = "index.html"
        } catch (error) {
            //vamos viendo
        }
    })
})