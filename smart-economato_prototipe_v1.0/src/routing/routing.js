import { initAlmacen } from "../controllers/inventarioController.js";
import { initRecepcion } from "../controllers/recepcionController.js";
import { initRegistro } from "../controllers/registroController.js";  
import { initPedidosProfesores } from "../controllers/pedidosProfesController.js";
import { initResumenPedidos } from "../controllers/resumenPedidosController.js";

//Comprobar si hay un usuario logeado en sessionStorage
const usuarioData = sessionStorage.getItem("usuarioActivo");

if (!usuarioData) {
  // Si NO hay usuario, lo mandamos al login
  window.location.href = "login.html";
  throw new Error("Usuario no autenticado");
}

// Si llega aquí, SÍ hay usuario: lo parseamos
let usuarioActivo = null;
try {
  usuarioActivo = JSON.parse(usuarioData);
} catch (e) {
  // Si está corrupto, limpiamos y mandamos al login
  sessionStorage.removeItem("usuarioActivo");
  window.location.href = "login.html";
  throw e;
}
// Manejo de la navegación y carga dinámica de contenido
document.addEventListener("DOMContentLoaded", () => {
  //Pintar el nombre del usuario en el aside
  const userName = document.getElementById("user-name");
  if (userName && usuarioActivo && usuarioActivo.nombre) {
    userName.textContent = usuarioActivo.nombre;
  }

  //botón Salir
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      // Borramos al usuario del sessionStorage
      sessionStorage.removeItem("usuarioActivo");
      // Volvemos al login
      window.location.href = "login.html";
    });
  }
  const links = document.querySelectorAll(".nav a");
  const content = document.getElementById("content");
  const sidebar = document.getElementById("nav");
  const pageTitle = document.getElementById("page-title");
  const allDetails = document.querySelectorAll('aside details');
  // Mapa de títulos para cada página
  const TITULOS = {
    recepcion:      "Recepción",
    pedidosProfes:  "Pedidos profesores",
    resumen:        "Resumen pedidos",
    baja:           "Baja productos",
    inventario:     "Inventario",
    escandallo:     "Escandallo",
    registro:       "Registro"
  };


  // Cargar contenido dinámicamente
  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const page = e.target.dataset.page;
      //Validaciones
      if (page === "registro" && usuarioActivo.role === "alumno") {
        alert("No tienes permiso para acceder a esta sección.");
        return; 
      }
      if (page === "pedidosProfes" && usuarioActivo.role === "alumno") {
          alert("No tienes permiso para acceder a esta sección.");
          return;
      } 

      try {
        const response = await fetch(`pages/${page}.html`);
        if (!response.ok) throw new Error("Página no encontrada");
        const html = await response.text();
        content.innerHTML = html;

        if (pageTitle) {
          pageTitle.textContent = TITULOS[page] || "Menú";
        }
        document.title = `Smart-Economato · ${TITULOS[page] || "Menú"}`;

        if (page === "inventario") {
          initAlmacen();
        }

        if (page === "recepcion") {
          initRecepcion();
        }

        if (page === "pedidosProfes") {
          initPedidosProfesores();
        }
        
        if (page === "registro") {
          initRegistro();
        }

        if (page === "resumen") {
          initResumenPedidos();
        }
      } catch (error) {
        content.innerHTML = `<p style='color:red'>${error.message}</p>`;
      }
    });
  });
  // Cerrar detalles en móvil al hacer clic en un enlace
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
