import { getProductos } from "../services/economatoservice.js";
import { pintarSugerenciasUI, renderizarTablaPedidoUI } from "../views/pedidosProfesUI.js";

let productos = [];
let lineasPedido = []; 

export async function initPedidosProfesores() {
  productos = await getProductos();

  const inputBuscar    = document.getElementById("input-buscar-producto");
  const listaSugerencias = document.getElementById("lista-sugerencias");
  const btnGuardar     = document.getElementById("btn-guardar-pedido");

  // Buscador en vivo
  inputBuscar.addEventListener("input", () => {
    const texto = inputBuscar.value.trim().toLowerCase();

    // delegamos el pintado a la UI y le pasamos un callback
    pintarSugerenciasUI({
      productos,
      texto,
      ul: listaSugerencias,
      onSeleccionProducto: pedirCantidadYAgregar
    });
  });

  // Guardar pedido
  btnGuardar.addEventListener("click", guardarPedidoProfesor);

  // Pintar tabla vacía
  renderizarTablaPedidoUI({ lineasPedido, productos });
}

// --------------------------
// Añadir línea al pedido
// --------------------------
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
      cantidad
    });
  }

  renderizarTablaPedidoUI({ lineasPedido, productos });
}

// --------------------------
// Guardar pedido del profesor
// --------------------------
function guardarPedidoProfesor() {
  if (lineasPedido.length === 0) {
    alert("No hay productos en el pedido");
    return;
  }

  const profesor = sessionStorage.getItem("usuarioActivo") || "Desconocido";

  const pedido = {
    profesor,
    fecha: new Date().toISOString(),
    lineas: structuredClone(lineasPedido)
  };

  console.log("Pedido del profesor:", pedido);
  alert(`Pedido guardado para el profesor: ${profesor}`);

  lineasPedido = [];
  renderizarTablaPedidoUI({ lineasPedido, productos });
}
