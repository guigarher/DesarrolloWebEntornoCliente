
import { ROUTER } from "../router/router.js";

document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll(".sidebar a");
    const content = document.getElementById("content");
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    // Toggle menú para móviles/tablets
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    links.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;

            // Cambiar estado activo del menú
            links.forEach(l => l.classList.remove("active"));
            e.target.classList.add("active");

            try {

                ROUTER.route(page)
                

                sidebar.classList.remove("open");

            } catch (error) {
                // Esto debería hacernos pesar que ciertos componentes básicos para mostrar mensajes deberían ser genéricos
                // Hemos escrito uno ya para el login ... quizás deba ser genérico al proyecto ... pensarlo
                content.innerHTML = `<p style="color:red;">${error.message}</p>`;
            }
        });
    });
});