import { getProductos, crearPedidoProfesor } from "../services/economatoservice.js";
import { pintarSugerenciasUI, renderizarTablaPedidoUI } from "../views/pedidosProfesUI.js";

let productos = [];
let lineasPedido = []; 

export async function initPedidosProfesores() {
  productos = await getProductos();

  const inputBuscar        = document.getElementById("input-buscar-producto");
  const listaSugerencias   = document.getElementById("lista-sugerencias");
  const btnGuardar         = document.getElementById("btn-guardar-pedido");
  const inputProductoLibre = document.getElementById("input-producto-libre");
  const btnProductoLibre   = document.getElementById("btn-add-producto-libre");

  // Buscador en vivo
  inputBuscar.addEventListener("input", () => {
    const texto = inputBuscar.value.trim().toLowerCase();

    pintarSugerenciasUI({
      productos,
      texto,
      ul: listaSugerencias,
      onSeleccionProducto: pedirCantidadYAgregar
    });
  });

  // Añadir producto "libre"
  btnProductoLibre.addEventListener("click", () => {
    const nombreLibre = inputProductoLibre.value.trim();
    if (!nombreLibre) {
      alert("Escribe un nombre para el producto nuevo");
      return;
    }

    pedirCantidadProductoLibre(nombreLibre);
    inputProductoLibre.value = ""; // limpiar el input
  });

  // Guardar pedido
  btnGuardar.addEventListener("click", guardarPedidoProfesor);

  // Pintar tabla vacía
  renderizarTablaPedidoUI({ lineasPedido, productos });
}


// Añadir línea al pedido 
function pedirCantidadYAgregar(producto) {
  const cantidadStr = prompt(
    `Cantidad de "${producto.nombre}" (${producto.unidadMedida || ""}):`
  );

  if (!cantidadStr) return;

  const cantidad = Number(cantidadStr);
  if (Number.isNaN(cantidad) || cantidad <= 0) {
    alert("Cantidad no válida");
    return;
  }

  const existente = lineasPedido.find(l => l.productoId === producto.id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    lineasPedido.push({
      productoId: producto.id,
      nombreProducto: producto.nombre,
      proveedorId: producto.proveedorId,
      codigoBarras: producto.codigoBarras, 
      cantidad
    });
  }

  renderizarTablaPedidoUI({ lineasPedido, productos });
}

// Añadir línea al pedido fuera de inventario
function pedirCantidadProductoLibre(nombreProducto) {
  const cantidadStr = prompt(
    `Cantidad de "${nombreProducto}" (unidades / kg / etc.):`
  );

  if (!cantidadStr) return;

  const cantidad = Number(cantidadStr);
  if (Number.isNaN(cantidad) || cantidad <= 0) {
    alert("Cantidad no válida");
    return;
  }

  const productoLibre = {
    id: `LIBRE-${Date.now()}`,
    nombre: nombreProducto,
    proveedorId: null,
    unidadMedida: ""
  };

  const existente = lineasPedido.find(
    l => l.productoId === productoLibre.id
  );

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    lineasPedido.push({
      productoId: productoLibre.id,
      nombreProducto: productoLibre.nombre,
      proveedorId: productoLibre.proveedorId,
      codigoBarras: null, 
      cantidad
    });
  }

  renderizarTablaPedidoUI({ lineasPedido, productos });
}


// Guardar pedido del profesor
async function guardarPedidoProfesor() {
  if (lineasPedido.length === 0) {
    alert("No hay productos en el pedido");
    return;
  }

  const usuarioString = sessionStorage.getItem("usuarioActivo");

  let profesor = "Desconocido";

  if (usuarioString) {
    try {
      const usuario = JSON.parse(usuarioString);
      profesor = usuario.nombre || usuario.username || "Desconocido";
    } catch (e) {
      console.error("Error al leer usuarioActivo:", e);
    }
  }

  const pedido = {
    profesor, 
    fecha: new Date().toLocaleString("es-ES"),
    estado: "pendiente",
    lineas: structuredClone(lineasPedido)
  };

  try {
    await crearPedidoProfesor(pedido);
    alert(`Pedido guardado para el profesor: ${profesor}`);
  } catch {
    alert("Error al guardar el pedido.");
    return;
  }

  // Limpiamos el pedido actual
  lineasPedido = [];
  renderizarTablaPedidoUI({ lineasPedido, productos });
}
