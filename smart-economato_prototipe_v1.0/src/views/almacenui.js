const tabla   = document.querySelector('#tablaProductos tbody');
const resumen = document.querySelector('#resumen');
const selectCategoria = document.querySelector('#categoriaSelect');
// Función para renderizar la tabla de productos
export function renderizarTabla(datos) {
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
  const valorTotal = datos.reduce((acc, p) => acc + Number(p.precio) * Number(p.stock), 0).toFixed(2);
  resumen.textContent = `Productos mostrados: ${totalProductos} | Valor total del stock: ${valorTotal} €`;
}

export function mostrarCategorias(categorias) {
  const opcionTodas = document.createElement('option');
  opcionTodas.value = '';
  opcionTodas.textContent = 'Todas las categorías';
  selectCategoria.appendChild(opcionTodas);   
  categorias.forEach(cat => {
    const opcion = document.createElement('option');
    opcion.value = cat.id;
    opcion.textContent = cat.nombre;
    selectCategoria.appendChild(opcion);
  });
}