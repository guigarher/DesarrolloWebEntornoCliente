// Tabla de pedidos por profesor
export function pintarTablaPedidosProfesoresUI({
  pedidos,
  productos,
  calcularImportePedido
}) {
  const tbody = document.querySelector("#tabla-pedidos-profesores tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  pedidos.forEach(pedido => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = pedido.id ?? "-";

    const tdProfesor = document.createElement("td");
    tdProfesor.textContent = pedido.profesor;

    const tdFecha = document.createElement("td");
    tdFecha.textContent = pedido.fecha;

    const total = calcularImportePedido(pedido, productos);
    const tdTotal = document.createElement("td");
    tdTotal.textContent = total.toFixed(2);

    const tdProductos = document.createElement("td");
    tdProductos.textContent = pedido.lineas
      .map(l => `${l.nombreProducto} (${l.cantidad})`)
      .join(", ");

    tr.appendChild(tdId);
    tr.appendChild(tdProfesor);
    tr.appendChild(tdFecha);
    tr.appendChild(tdTotal);
    tr.appendChild(tdProductos);

    tbody.appendChild(tr);
  });
}

// Resumen mezclado por proveedor
export function pintarResumenProveedoresUI({
  resumen,
  onMarcarProveedorRecibido
}) {
  const contenedor = document.getElementById("resumen-proveedores");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (!resumen || resumen.length === 0) {
    contenedor.textContent = "No hay pedidos pendientes.";
    return;
  }

  resumen.forEach(grupo => {
    const div = document.createElement("div");
    div.classList.add("proveedor-resumen");

    const titulo = document.createElement("h4");
    titulo.textContent = grupo.nombreProveedor;
    div.appendChild(titulo);

    const tabla = document.createElement("table");
    tabla.classList.add("tabla-resumen");

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Producto</th>
        <th>Cantidad total</th>
        <th>Detalle por profesor</th>
      </tr>
    `;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

    grupo.productos.forEach(prod => {
      const tr = document.createElement("tr");

      const tdNombre = document.createElement("td");
      tdNombre.textContent = prod.nombreProducto;

      const tdCantidadTotal = document.createElement("td");
      tdCantidadTotal.textContent = prod.cantidadTotal;

      const tdDetalle = document.createElement("td");
      tdDetalle.textContent = prod.lineasPorProfesor
        .map(lp => `${lp.profesor}: ${lp.cantidad}`)
        .join(" | ");

      tr.appendChild(tdNombre);
      tr.appendChild(tdCantidadTotal);
      tr.appendChild(tdDetalle);

      tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    div.appendChild(tabla);

    if (grupo.proveedorId === "LIBRE" || grupo.proveedorId == null) {
        //pendientes de proveedor
        const btnIrRegistro = document.createElement("button");
        btnIrRegistro.textContent = "Registrar estos productos en inventario";

        btnIrRegistro.addEventListener("click", () => {
            const enlaceRegistro = document.querySelector('.nav a[data-page="registro"]');

            if (enlaceRegistro) {
            enlaceRegistro.click();
            } else {
            alert("No se encontró el enlace de Registro en el menú.");
            }
        });

        div.appendChild(btnIrRegistro);
        } else {
        //botón normal de albarán recepción
        const btnRecibirProv = document.createElement("button");
        btnRecibirProv.textContent =
            "Marcar pedidos de este proveedor como recibidos";

        btnRecibirProv.addEventListener("click", async () => {
            const numeroAlbaran = prompt(
            `Número de albarán para ${grupo.nombreProveedor}:`
            );
            if (!numeroAlbaran) return;

            const incidencias =
            prompt("Incidencias (puedes dejarlo vacío si todo está correcto):") || "";

            await onMarcarProveedorRecibido({
            proveedorId: grupo.proveedorId,
            numeroAlbaran,
            incidencias
            });
        });

        div.appendChild(btnRecibirProv);
    }



    contenedor.appendChild(div);
  });
}
