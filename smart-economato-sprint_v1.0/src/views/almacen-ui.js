const fmtEUR = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export function renderizarTabla(datos) {
  const tabla = document.querySelector('#tablaProductos tbody');
  const resumen = document.querySelector('#resumen');
  tabla.innerHTML = '';
  if (datos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="8" style="text-align:center;">No se encontraron productos</td></tr>';
    resumen.textContent = '';
    return;
  }
  
  //Podríamos usar esto de otra manera usando POO para delegar lógica del stock mínimo y los estilos asociados
  for (const p of datos) {
    const fila = document.createElement('tr');
    if (p.stock < p.stockMinimo) fila.classList.add('alerta');
    fila.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria.nombre}</td>
      <td>${fmtEUR.format(p.precio)}</td>
      <td>${p.stock}</td>
      <td>${p.stockMinimo}</td>
      <td>${p.proveedor.nombre}</td>     
    `;
    tabla.appendChild(fila);
  }
  const totalProductos = datos.length;
  const valorTotal = datos.reduce((acc, p) => acc + p.precio * p.stock, 0);
  resumen.textContent = `Productos mostrados: ${totalProductos} | Valor total del stock: ${fmtEUR.format(valorTotal)}`;
}



export function generarCategorias(categorias) {
  const selectCategoria = document.querySelector('#categoriaSelect');
 
  // Limpiamos opciones previas
  selectCategoria.textContent = '';

  // Agregar opción por defecto
  const opcionDefault = document.createElement('option');
  opcionDefault.value = '';
  opcionDefault.textContent = '-- Categoría --';
  selectCategoria.appendChild(opcionDefault);

  // Agregar cada categoría como <option>
  categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria.nombre;
    option.textContent = categoria.nombre;
    selectCategoria.appendChild(option);
  });
}
