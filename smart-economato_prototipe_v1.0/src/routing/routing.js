import { initAlmacen } from "../controllers/almacen.js";

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav a");
  const content = document.getElementById("content");
  const sidebar = document.getElementById("nav");
  const pageTitle = document.getElementById("page-title");

  const TITULOS = {
    recepcion:      "Recepción",
    pedidosProfes:  "Pedidos profesores",
    resumen:        "Resumen pedidos",
    baja:           "Baja productos",
    inventario:     "Inventario",
    escandallo:     "Escandallo"
  };

  // Cargar contenido dinámicamente
  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const page = e.target.dataset.page;

      // Cambiar estado activo del menú
      links.forEach(l => l.classList.remove("active"));
      e.target.classList.add("active");

      try {
        const response = await fetch(`pages/${page}.html`);
        if (!response.ok) throw new Error("Página no encontrada");
        const html = await response.text();
        content.innerHTML = html;

        if (pageTitle) {
          pageTitle.textContent = TITULOS[page] || "Menú";
        }

        if (page === "inventario") {
          initAlmacen();
        }
        
        sidebar.classList.remove("open"); // cerrar menú móvil
      } catch (error) {
        content.innerHTML = `<p style='color:red'>${error.message}</p>`;
      }
    });
  });
});
