import {
  getProductos,
  getPedidosProfesores,
  actualizarEstadoPedido,
  crearAlbaran,
  incrementarStockPorCodigo,
  getProveedores,
  crearPedidoProveedor,
  actualizarPedidoProfesor   
} from "../services/economatoservice.js";

import {
  pintarTablaPedidosProfesoresUI,
  pintarResumenProveedoresUI
} from "../views/resumenPedidosUI.js";

/**
 * Estado en memoria para controlar bien qué líneas siguen pendientes.
 * Así no nos cargamos las de otros proveedores al marcar recibido uno solo.
 */
let estado = {
  productos: [],
  pedidos: [],
  proveedores: [],
  lineasPendientes: [] // cada elemento: { pedidoId, profesor, proveedorId, productoId, nombreProducto, codigoBarras, cantidad }
};

/**
 * Punto de entrada de la página de resumen.
 */
export async function initResumenPedidos() {
  try {
    const [productos, pedidos, proveedores] = await Promise.all([
      getProductos(),
      getPedidosProfesores(),
      getProveedores()
    ]);

    estado.productos = productos;
    estado.pedidos = pedidos;
    estado.proveedores = proveedores;

    // 🆕 1) Limpiar del backend las líneas sin proveedor
    //     que ya tienen producto registrado (como el café)
    await limpiarLineasResueltas(productos);

    // 2) Volvemos a calcular los pedidos pendientes con el estado ya limpio
    const pedidosPendientes = estado.pedidos.filter(p => p.estado === "pendiente");

    // 3) Construimos las líneas pendientes usando también la lista de productos
    estado.lineasPendientes = construirLineasPendientes(pedidosPendientes, productos);

    // 4) Pintar tabla de pedidos profesores (arriba)
    pintarTablaPedidosProfesoresUI({
      pedidos: pedidosPendientes,
      productos,
      calcularImportePedido
    });

    // 5) Pintar resumen inicial por proveedor (debajo)
    repintarResumen();

  } catch (e) {
    console.error("Error en initResumenPedidos:", e);
    alert("Error al cargar el resumen de pedidos");
  }
}

async function limpiarLineasResueltas(productos) {
  // Nombres de productos existentes, normalizados
  const nombresProductos = new Set(
    productos
      .map(p => (p.nombre || "").toLowerCase().trim())
      .filter(n => n !== "")
  );

  for (const pedido of estado.pedidos) {
    const lineasOriginales = pedido.lineas || [];
    const nuevasLineas = [];
    let hayCambios = false;

    for (const linea of lineasOriginales) {
      const nombreLinea = (linea.nombreProducto || "").toLowerCase().trim();
      const tieneProveedor = linea.proveedorId != null && linea.proveedorId !== "";
      const existeProducto = nombresProductos.has(nombreLinea);

      // Si no tiene proveedor y el producto YA existe → la consideramos resuelta y NO la dejamos
      if (!tieneProveedor && existeProducto) {
        hayCambios = true;
        continue; // NO la añadimos a nuevasLineas
      }

      // El resto de líneas se mantienen
      nuevasLineas.push(linea);
    }

    if (hayCambios) {
      const nuevoEstado = nuevasLineas.length > 0 ? pedido.estado : "recibido";

      try {
        const actualizado = await actualizarPedidoProfesor(pedido.id, {
          lineas: nuevasLineas,
          estado: nuevoEstado
        });

        // Actualizamos también en memoria
        pedido.lineas = actualizado.lineas;
        pedido.estado = actualizado.estado;
      } catch (e) {
        console.error("Error limpiando líneas resueltas en pedido", pedido.id, e);
      }
    }
  }
}

function construirLineasPendientes(pedidosPendientes, productos) {
  const lineas = [];

  // Conjunto de nombres de productos ya registrados (normalizados a minúsculas)
  const nombresProductos = new Set(
    productos
      .map(p => (p.nombre || "").toLowerCase().trim())
      .filter(n => n !== "")
  );

  pedidosPendientes.forEach(pedido => {
    const lineasPedido = pedido.lineas || [];

    lineasPedido.forEach(linea => {
      const nombreLinea = (linea.nombreProducto || "").toLowerCase().trim();

      // ¿Ya existe este producto en la BBDD?
      const existeProducto = nombresProductos.has(nombreLinea);

      // 1) Si la línea tiene proveedor normal → va al grupo de ese proveedor
      if (linea.proveedorId != null && linea.proveedorId !== "") {
        lineas.push({
          pedidoId: pedido.id,
          profesor: pedido.profesor,
          proveedorId: linea.proveedorId,
          productoId: linea.productoId,
          nombreProducto: linea.nombreProducto,
          codigoBarras: linea.codigoBarras,
          cantidad: linea.cantidad
        });
        return;
      }

      // 2) Si NO tiene proveedor y TAMPOCO existe como producto → "Pendiente de proveedor"
      if (!existeProducto) {
        lineas.push({
          pedidoId: pedido.id,
          profesor: pedido.profesor,
          proveedorId: "LIBRE",
          productoId: null,
          nombreProducto: linea.nombreProducto,
          codigoBarras: linea.codigoBarras,
          cantidad: linea.cantidad
        });
        return;
      }

      // 3) Si NO tiene proveedor pero el producto YA existe → no lo añadimos al resumen
      // (desaparece de "productos sin proveedor")
    });
  });

  return lineas;
}



/**
 * Calcula el importe total de un pedido de profesor.
 */
function calcularImportePedido(pedido, productos) {
  let total = 0;
  pedido.lineas.forEach(linea => {
    const prod = productos.find(p => p.id === linea.productoId);
    const precioUnitario = prod?.precio || 0;
    total += precioUnitario * linea.cantidad;
  });
  return total;
}

/**
 * Vuelve a agrupar lineasPendientes por proveedor y repinta el resumen en la UI.
 */
function repintarResumen() {
  const resumenProveedores = agruparPorProveedor(estado.lineasPendientes, estado.productos);

  pintarResumenProveedoresUI({
    resumen: resumenProveedores,
    onMarcarProveedorRecibido: async ({ proveedorId, numeroAlbaran, incidencias }) => {
      await procesarRecepcionProveedor({ proveedorId, numeroAlbaran, incidencias });

      // Tras procesar el proveedor, repintamos tabla y resumen con el nuevo estado
      const pedidosPendientesActualizados = estado.pedidos.filter(p => p.estado === "pendiente");

      pintarTablaPedidosProfesoresUI({
        pedidos: pedidosPendientesActualizados,
        productos: estado.productos,
        calcularImportePedido
      });

      repintarResumen();
    }
  });
}

/**
 * Procesa la recepción de TODOS los productos pendientes de un proveedor concreto.
 * - Actualiza stock solo de esas líneas
 * - Genera albarán
 * - Genera pedidoProveedor
 * - Marca pedidos de profesor como "recibido" SOLO si ya no les queda ninguna línea pendiente
 */
async function procesarRecepcionProveedor({ proveedorId, numeroAlbaran, incidencias }) {
  const { productos, proveedores } = estado;

  // 1) Buscar líneas PENDIENTES de este proveedor
  const lineasProveedor = estado.lineasPendientes.filter(
    l => (l.proveedorId ?? "LIBRE") === proveedorId
  );

  if (lineasProveedor.length === 0) {
    alert("No hay líneas pendientes para este proveedor.");
    return;
  }

  // 2) Actualizar stock SOLO de esas líneas
  for (const linea of lineasProveedor) {
    if (!linea.codigoBarras) continue;

    try {
      await incrementarStockPorCodigo(linea.codigoBarras, linea.cantidad);
    } catch (e) {
      console.error("Error actualizando stock para línea:", linea, e);
    }
  }

  // 3) Construir las líneas para el albarán
  const lineasAlbaran = lineasProveedor.map(l => {
    const prodInv = productos.find(p => p.id === l.productoId);
    return {
      productoId: l.productoId,
      nombreProducto: l.nombreProducto || prodInv?.nombre || "Producto sin nombre",
      codigoBarras: l.codigoBarras || null,
      cantidad: l.cantidad
    };
  });

  // 4) Resolver nombre del proveedor
  let nombreProveedor;
  if (proveedorId === "LIBRE" || proveedorId == null) {
    nombreProveedor = "Pendiente de proveedor";
  } else {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    nombreProveedor = proveedor?.nombre || `Proveedor ID ${proveedorId}`;
  }

  // 5) Crear ALBARÁN
  const pedidosProfesoresIds = Array.from(
    new Set(lineasProveedor.map(l => l.pedidoId))
  );

  const albaran = {
    numeroAlbaran,
    fecha: new Date().toLocaleString("es-ES"),
    proveedorId,
    proveedorNombre: nombreProveedor,
    incidencias,
    lineas: lineasAlbaran,
    pedidosProfesoresIds
  };

  try {
    await crearAlbaran(albaran);
  } catch (e) {
    console.error("Error al crear albarán:", e);
    alert("Error al crear el albarán.");
    return;
  }

  // 6) Crear PEDIDO A PROVEEDOR
  const pedidoProveedor = {
    proveedorId,
    nombreProveedor,
    fechaCreacion: new Date().toISOString(),
    numeroAlbaran,
    estado: "recibido",
    incidencias,
    lineas: lineasAlbaran,
    pedidosProfesoresIds
  };

  try {
    await crearPedidoProveedor(pedidoProveedor);
  } catch (e) {
    console.error("Error al crear pedidoProveedor:", e);
    // No hacemos return porque albarán y stock ya se han registrado
  }

  // 7) Actualizar líneas pendientes en memoria:
  //    eliminamos solo las de este proveedor (ya recibidas)
  const nuevasLineasPendientes = estado.lineasPendientes.filter(
    l => (l.proveedorId ?? "LIBRE") !== proveedorId
  );

  estado.lineasPendientes = nuevasLineasPendientes;

  // 8) Actualizar cada pedido de profesor en la BBDD:
    //    - Quitamos de sus 'lineas' las del proveedor recibido
    //    - Si ya no quedan líneas → estado = 'recibido'
    //    - Si quedan → estado = 'pendiente'
    for (const pedidoId of pedidosProfesoresIds) {
        const pedido = estado.pedidos.find(p => p.id === pedidoId);
        if (!pedido) continue;

        // Líneas que QUEDAN pendientes en este pedido (las que NO son de este proveedor)
        const lineasRestantes = (pedido.lineas || []).filter(
            l => (l.proveedorId ?? "LIBRE") !== proveedorId
        );

        const nuevoEstado = lineasRestantes.length > 0 ? "pendiente" : "recibido";

        try {
            // Actualizamos en json-server
            const pedidoActualizado = await actualizarPedidoProfesor(pedidoId, {
            lineas: lineasRestantes,
            estado: nuevoEstado,
            });

            // Actualizamos también en memoria
            pedido.lineas = pedidoActualizado.lineas;
            pedido.estado = pedidoActualizado.estado;

        } catch (e) {
            console.error("Error al actualizar pedido de profesor:", pedidoId, e);
        }
    }


  alert("Albarán registrado, stock actualizado y pedidos actualizados.");
}

/**
 * Agrupa las líneas pendientes por proveedor para la UI de resumen.
 */
function agruparPorProveedor(lineasPendientes, productos) {
  const mapaProveedores = new Map();

  lineasPendientes.forEach(linea => {
    const provId = linea.proveedorId ?? "LIBRE";

    if (!mapaProveedores.has(provId)) {
      mapaProveedores.set(provId, {
        proveedorId: provId,
        productos: new Map()
      });
    }

    const grupoProv = mapaProveedores.get(provId);

    const productoInv = productos.find(p => p.id === linea.productoId);
    const nombreProducto = linea.nombreProducto || productoInv?.nombre || "Producto sin nombre";
    const precioUnitario = productoInv?.precio || 0;

    if (!grupoProv.productos.has(linea.productoId)) {
      grupoProv.productos.set(linea.productoId, {
        productoId: linea.productoId,
        nombreProducto,
        cantidadTotal: 0,
        lineasPorProfesor: [],
        precioUnitario
      });
    }

    const infoProd = grupoProv.productos.get(linea.productoId);
    infoProd.cantidadTotal += linea.cantidad;
    infoProd.lineasPorProfesor.push({
      profesor: linea.profesor,
      cantidad: linea.cantidad
    });
  });

  // Convertimos el mapa a array y resolvemos nombreProveedor
  const resultado = Array.from(mapaProveedores.values()).map(grupoProv => {
    let nombreProveedor;

    if (grupoProv.proveedorId === "LIBRE" || grupoProv.proveedorId == null) {
      nombreProveedor = "Pendiente de proveedor";
    } else {
      const prodConEseProv = productos.find(
        p => p.proveedorId === grupoProv.proveedorId
      );
      nombreProveedor =
        prodConEseProv?.proveedor?.nombre ||
        `Proveedor ID ${grupoProv.proveedorId}`;
    }

    return {
      proveedorId: grupoProv.proveedorId,
      nombreProveedor,
      productos: Array.from(grupoProv.productos.values())
    };
  });

  return resultado;
}
