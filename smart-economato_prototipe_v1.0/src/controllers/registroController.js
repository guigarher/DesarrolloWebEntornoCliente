import { crearProducto } from "../services/economatoservice.js"; 

export function initRegistro() {
  // Elementos del DOM
  const tabs = document.querySelectorAll(".registro-tab");
  const sections = document.querySelectorAll(".registro-section");
  // Formulario de registro de producto
  const nombreProductoInput = document.getElementById("nombreProducto");
  const codigoBarrasInput = document.getElementById("codigoBarras");
  const pvpInput = document.getElementById("pvp");
  const unidadMedidadSelect = document.getElementById("unidadmedidad");
  const stockMinimoInput = document.getElementById("stockMinimo");
  const marcaInput          = document.getElementById("marca");
  const descripcionInput   = document.getElementById("descripcion");
  const caducidadInput      = document.getElementById("caducidad");
  const categoriaSelect = document.getElementById("categoria");
  const proveedorSelect = document.getElementById("proveedorProducto");
  const imagenInput         = document.getElementById("imagen");
  const registrarProductoBtn = document.getElementById("btnRegistrarProducto");
  

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      sections.forEach(sec => {
        sec.classList.remove("active");
        if (sec.id === target) sec.classList.add("active");
      });
    });
  });
/*
  registrarProductoBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const alergenosCheckboxes = document.querySelectorAll('input[name="alergenos"]:checked');
    const alergenos = Array.from(alergenosCheckboxes).map(chk => chk.value);

    const nuevoProducto = {
      nombre: nombreProductoInput.value.trim(),
      precio: Number(pvpInput.value),
      precioUnitario: unidadMedidaSelect.value || "ud",
      stock: 0,
      stockMinimo: Number(stockMinimoInput.value || 0),
      categoriaId: Number(categoriaSelect.value),
      proveedorId: Number(proveedorSelect.value),
      unidadMedidaSelect: unidadMedidaSelect.value || "ud",
      marca: marcaInput.value.trim(),
      codigoBarras: codigoBarrasInput.value.trim(),
      fechaCaducidad: caducidadInput.value || null,
      alergenos,                                
      descripcion: descripcionInput.value.trim(),                     
      imagen: imagenInput.value.trim(),         
      activo: true
  };*/

}
