import { initAlmacen } from "../controllers/inventarioController.js";
import { initRecepcion } from "../controllers/recepcionController.js";

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav a");
  const content = document.getElementById("content");
  const sidebar = document.getElementById("nav");
  const pageTitle = document.getElementById("page-title");
  const allDetails = document.querySelectorAll('aside details');

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

        if (page === "recepcion") {
          initRecepcion();
        }
        
        sidebar.classList.remove("open"); // cerrar menú móvil
      } catch (error) {
        content.innerHTML = `<p style='color:red'>${error.message}</p>`;
      }
    });
  });
  allDetails.forEach(det => {
    det.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
        det.removeAttribute('open');
        }
      });
    });
  });
});
