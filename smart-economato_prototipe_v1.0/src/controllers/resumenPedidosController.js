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


let estado = {
  productos: [],
  pedidos: [],
  proveedores: [],
  lineasPendientes: [] 
};


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

    await limpiarLineasResueltas(productos);

    const pedidosPendientes = estado.pedidos.filter(p => p.estado === "pendiente");

    estado.lineasPendientes = construirLineasPendientes(pedidosPendientes, productos);

    pintarTablaPedidosProfesoresUI({
      pedidos: pedidosPendientes,
      productos,
      calcularImportePedido
    });

    repintarResumen();

  } catch (e) {
    console.error("Error en initResumenPedidos:", e);
    alert("Error al cargar el resumen de pedidos");
  }
  setTimeout(() => {
    const titulo = document.getElementById("titulo-resumen");
    if (titulo) titulo.focus();
  }, 50);
}

async function limpiarLineasResueltas(productos) {
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

      
      if (!tieneProveedor && existeProducto) {
        hayCambios = true;
        continue; 
      }

      nuevasLineas.push(linea);
    }

    if (hayCambios) {
      const nuevoEstado = nuevasLineas.length > 0 ? pedido.estado : "recibido";

      try {
        const actualizado = await actualizarPedidoProfesor(pedido.id, {
          lineas: nuevasLineas,
          estado: nuevoEstado
        });

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

  const nombresProductos = new Set(
    productos
      .map(p => (p.nombre || "").toLowerCase().trim())
      .filter(n => n !== "")
  );

  pedidosPendientes.forEach(pedido => {
    const lineasPedido = pedido.lineas || [];

    lineasPedido.forEach(linea => {
      const nombreLinea = (linea.nombreProducto || "").toLowerCase().trim();

      const existeProducto = nombresProductos.has(nombreLinea);

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

    });
  });

  return lineas;
}



function calcularImportePedido(pedido, productos) {
  let total = 0;
  pedido.lineas.forEach(linea => {
    const prod = productos.find(p => p.id === linea.productoId);
    const precioUnitario = prod?.precio || 0;
    total += precioUnitario * linea.cantidad;
  });
  return total;
}

function repintarResumen() {
  const resumenProveedores = agruparPorProveedor(
    estado.lineasPendientes,
    estado.productos
  );

  pintarResumenProveedoresUI({
    resumen: resumenProveedores,
    onMarcarProveedorRecibido: async ({ proveedorId, numeroAlbaran, todoCorrecto }) => {
      await procesarRecepcionProveedor({ proveedorId, numeroAlbaran, todoCorrecto });

      const pedidosPendientesActualizados = estado.pedidos.filter(
        p => p.estado === "pendiente"
      );

      pintarTablaPedidosProfesoresUI({
        pedidos: pedidosPendientesActualizados,
        productos: estado.productos,
        calcularImportePedido
      });

      repintarResumen();
    }
  });
}



async function procesarRecepcionProveedor({ proveedorId, numeroAlbaran, todoCorrecto }) {
  const { productos, proveedores } = estado;

  const lineasProveedor = estado.lineasPendientes.filter(
    l => (l.proveedorId ?? "LIBRE") === proveedorId
  );

  if (lineasProveedor.length === 0) {
    alert("No hay líneas pendientes para este proveedor.");
    return;
  }

  // Construimos las líneas del albarán (lo usamos en ambos casos)
  const lineasAlbaran = lineasProveedor.map(l => {
    const prodInv = productos.find(p => p.id === l.productoId);
    return {
      productoId: l.productoId,
      nombreProducto: l.nombreProducto || prodInv?.nombre || "Producto sin nombre",
      codigoBarras: l.codigoBarras || null,
      cantidad: l.cantidad
    };
  });

  let nombreProveedor;
  if (proveedorId === "LIBRE" || proveedorId == null) {
    nombreProveedor = "Pendiente de proveedor";
  } else {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    nombreProveedor = proveedor?.nombre || `Proveedor ID ${proveedorId}`;
  }

  const pedidosProfesoresIds = Array.from(
    new Set(lineasProveedor.map(l => l.pedidoId))
  );

  //CASO 1: TODO CORRECTO → recibir todo, sumar stock, cerrar pedidos
  if (todoCorrecto) {

    // 1) Actualizar stock
    for (const linea of lineasProveedor) {
      if (!linea.codigoBarras) continue;

      try {
        await incrementarStockPorCodigo(linea.codigoBarras, linea.cantidad);
      } catch (e) {
        console.error("Error actualizando stock para línea:", linea, e);
      }
    }

    // 2) Crear albarán
    const albaran = {
      numeroAlbaran,
      fecha: new Date().toLocaleString("es-ES"),
      proveedorId,
      proveedorNombre: nombreProveedor,
      incidencias: "",
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

    // 3) Crear pedidoProveedor marcado como recibido
    const pedidoProveedor = {
      proveedorId,
      nombreProveedor,
      fechaCreacion: new Date().toISOString(),
      numeroAlbaran,
      estado: "recibido",
      incidencias: "",
      lineas: lineasAlbaran,
      pedidosProfesoresIds
    };

    try {
      await crearPedidoProveedor(pedidoProveedor);
    } catch (e) {
      console.error("Error al crear pedidoProveedor:", e);
    }

    // 4) Quitar líneas de ese proveedor de las pendientes
    const nuevasLineasPendientes = estado.lineasPendientes.filter(
      l => (l.proveedorId ?? "LIBRE") !== proveedorId
    );
    estado.lineasPendientes = nuevasLineasPendientes;

    // 5) Actualizar pedidos de profesor
    for (const pedidoId of pedidosProfesoresIds) {
      const pedido = estado.pedidos.find(p => p.id === pedidoId);
      if (!pedido) continue;

      const lineasRestantes = (pedido.lineas || []).filter(
        l => (l.proveedorId ?? "LIBRE") !== proveedorId
      );

      const nuevoEstado = lineasRestantes.length > 0 ? "pendiente" : "recibido";

      try {
        const pedidoActualizado = await actualizarPedidoProfesor(pedidoId, {
          lineas: lineasRestantes,
          estado: nuevoEstado,
        });

        pedido.lineas = pedidoActualizado.lineas;
        pedido.estado = pedidoActualizado.estado;

      } catch (e) {
        console.error("Error al actualizar pedido de profesor:", pedidoId, e);
      }
    }

    alert("Albarán registrado, stock actualizado y pedidos marcados como recibidos.");
    return;
  }

    //CASO 2: NO está todo correcto

    // Guardamos nº albarán para pre-rellenar en Recepción
    sessionStorage.setItem("albaranEnCurso", numeroAlbaran);

    // Guardamos también qué proveedor y qué pedidos están afectados
    sessionStorage.setItem(
      "recepcionParcialInfo",
      JSON.stringify({
        proveedorId,
        pedidosProfesoresIds
      })
    );

    alert(
      "Recepción incompleta.\n\n" +
      "Te llevo a la pantalla de Recepción para que registres " +
      "solo los productos que han llegado."
    );

    const enlaceRecepcion = document.querySelector('.nav a[data-page="recepcion"]');
    if (enlaceRecepcion) {
      enlaceRecepcion.click();
    } else {
      alert("No se encontró la pantalla de Recepción en el menú.");
    }
  }






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
