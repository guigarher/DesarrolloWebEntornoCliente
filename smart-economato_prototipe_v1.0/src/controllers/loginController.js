import { AuthService } from "../services/authservice";

document.addEventListener("DOMContentLoaded", () =>{
    const form =  document.getElementById("login/form")

    form.addEventListener("submit", XXXXXX =>{

        
        const usuario = document.getElementById("username").value
        const pass = document.getElementById("password").value

        try {
            const user = AuthService.login(username, password)

            window.location.href = "index.html"
        } catch (error) {
            //vamos viendo
        }
    })
})