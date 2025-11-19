document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar a");
  const content = document.getElementById("content");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  // Toggle menú para móviles/tablets
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

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
        sidebar.classList.remove("open"); // cerrar menú móvil
      } catch (error) {
        content.innerHTML = `<p style='color:red'>${error.message}</p>`;
      }
    });
  });
});
