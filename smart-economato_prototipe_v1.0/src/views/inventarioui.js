
// Función para renderizar la tabla de productos
export function renderizarTabla(datos) {
  // 👇 buscamos los elementos AHORA, no al cargar el módulo
  const tabla   = document.querySelector('#tablaProductos tbody');
  const resumen = document.querySelector('#resumen');

  if (!tabla || !resumen) {
    console.error("No se encontró la tabla o el resumen en el DOM");
    return;
  }

  tabla.innerHTML = '';

  if (!Array.isArray(datos) || datos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="8" style="text-align:center;">No se encontraron productos</td></tr>';
    resumen.textContent = '';
    return;
  }

  datos.forEach(p => {
    const fila = document.createElement('tr');
    if (Number(p.stock) <= Number(p.stockMinimo)) fila.classList.add('alerta');
    fila.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria?.nombre ?? ''}</td>
      <td>${Number(p.precio).toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>${p.stockMinimo}</td>
      <td>${p.proveedor?.nombre ?? ''}</td>
      <td>${p.proveedor?.isla ?? ''}</td>
    `;
    tabla.appendChild(fila);
  });

  const totalProductos = datos.length;
  const valorTotal = datos
    .reduce((acc, p) => acc + Number(p.precio) * Number(p.stock), 0)
    .toFixed(2);

  resumen.textContent = `Productos mostrados: ${totalProductos} | Valor total del stock: ${valorTotal} €`;
}

export function mostrarCategorias(categorias) {
  const selectCategoria = document.getElementById("categoriaSelect");

  if (!selectCategoria) {
    console.error("No se encontró #categoriaSelect en el DOM");
    return;
  }

  selectCategoria.textContent = "";

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "---Categoría---";
  selectCategoria.appendChild(optionDefault);

  categorias.forEach(categoria => {
    const option = document.createElement("option");

    // AQUÍ EL CAMBIO IMPORTANTE:
    option.value = categoria.id;             // <-- ID numérico
    option.textContent = categoria.nombre;   // <-- lo que ve el usuario

    selectCategoria.appendChild(option);
  });
}

