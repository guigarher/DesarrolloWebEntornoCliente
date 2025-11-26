import { AuthService } from '../services/authService.js';
import { UI } from '../views/login-ui.js'

document.addEventListener("DOMContentLoaded", () => { //Esperamos a que el documento esté correctamente cargado

  const form = document.getElementById("loginForm");  //Cogemos el formulario del DOM

  form.addEventListener("submit", async (event) => {
    event.preventDefault();     //Eliminamos el comportamiento por defecto de un formulario, es decir, que al hacer submit se recargue la pag. y manejamos nosotros la lógica
    UI.clearMessage();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Lo dejo aquí y así el tipo de estilo es warning y ven la flexibilidad del método
    if (!username || !password) {
      UI.showMessage("Por favor, rellena todos los campos", "warning");
      return;
    }

    try {     

      const user = await AuthService.login(username, password);
      UI.showMessage("Login exitoso", "success");
     
      // Redirigir después a nuestra página de inicio

      window.location.href = "./pages/main.html";
      //window.location.replace("./pages/main.html"); miren la diferencia please ...

    } catch (error) {
      UI.showMessage(error.message, "error");
    }
  });
});
