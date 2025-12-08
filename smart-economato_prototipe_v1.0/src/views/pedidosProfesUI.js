export function pintarSugerenciasUI({ productos, texto, ul, onSeleccionProducto }) {
  ul.innerHTML = "";

  if (!texto) return;

  const coincidencias = productos
    .filter(p => p.nombre.toLowerCase().includes(texto))
    .slice(0, 10);

  if (coincidencias.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No hay productos que coincidan";
    li.classList.add("sin-resultados");
    ul.appendChild(li);
    return;
  }

  coincidencias.forEach(prod => {
    const li = document.createElement("li");
    li.textContent = prod.nombre;

    li.addEventListener("click", () => {
      onSeleccionProducto(prod);   
      ul.innerHTML = "";          
    });

    ul.appendChild(li);
  });
}

// Pintar la tabla del pedido
export function renderizarTablaPedidoUI({ lineasPedido, productos }) {
  const tbody = document.querySelector("#tabla-pedido-profesor tbody");
  tbody.innerHTML = "";

  lineasPedido.forEach((linea, index) => {
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = linea.nombreProducto;

    const producto = productos.find(p => p.id === linea.productoId);

    let nombreProveedor;
    if (!producto && linea.proveedorId == null) {
      // Producto fuera de inventario
      nombreProveedor = "Pendiente de proveedor";
    } else {
      nombreProveedor = producto?.proveedor?.nombre || `ID ${linea.proveedorId}`;
    }

    const tdProveedor = document.createElement("td");
    tdProveedor.textContent = nombreProveedor;


    const tdCantidad = document.createElement("td");
    tdCantidad.textContent = linea.cantidad;

    const tdAcciones = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => {
      lineasPedido.splice(index, 1);
      renderizarTablaPedidoUI({ lineasPedido, productos });
    });
    tdAcciones.appendChild(btnEliminar);

    tr.appendChild(tdNombre);
    tr.appendChild(tdProveedor);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
}
