// Módulo principal para la gestión del almacén
// ✅ ya NO importamos el array local de productos
// import { productos } from '../services/productos.js';
import { filtrarPorCategoria, buscarProducto, ordenarPorPrecio, comprobarStockMinimo } from '../utils/funciones.js';
import { renderizarTabla } from '../views/almacenui.js';

// ✅ importamos las funciones del servicio remoto
import {
  getProductos,
  getProducto,
  getCategorias,
  getProveedores,
  buscarProductoPorCodigoBarras,
  productosPorCategoria,
} from '../services/economatoservice.js';

// ------------------------
// Elementos del DOM
// ------------------------
const controles = document.querySelector('.controles');
const inputBusqueda = document.querySelector('#busqueda');
const btnBuscar = document.querySelector('#btnBuscar');
const btnFiltrar = document.querySelector('#btnFiltrarCategoria');
const btnOrdenar = document.querySelector('#btnOrdenar');
const btnStock = document.querySelector('#btnStock');
const btnMostrarTodos = document.querySelector('#btnMostrarTodos');
const selectCategoria = document.querySelector('#categoriaSelect');
const selectOrden = document.querySelector('#ordenSelect');

// ------------------------
// Estado global
// ------------------------
let productos = [];          // 🔹 ahora se llenará desde getProductos()
let productosMostrados = []; // 🔹 los que estás mostrando en la tabla

// ------------------------
// Carga inicial (antes de todo)
// ------------------------
async function cargarInicial() {
  try {
    productos = await getProductos();   // obtenemos todo el JSON remoto
    productosMostrados = [...productos];
    renderizarTabla(productosMostrados);
  } catch (e) {
    console.error('Error al cargar los productos:', e);
  }
}
document.addEventListener('DOMContentLoaded', cargarInicial);

// ------------------------
// Mapa de acciones (delegación de eventos)
// ------------------------
const acciones = {
  buscar: manejarBusqueda,
  filtrar: manejarFiltro,
  ordenar: manejarOrden,
  stock: manejarStock,
  mostrar: manejarMostrarTodos
};

controles.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (acciones[action]) acciones[action]();
});

// ------------------------
// Acciones
// ------------------------
function manejarBusqueda() {
  const nombre = inputBusqueda.value.trim();
  if (nombre) {
    const resultado = buscarProducto(productos, nombre);
    renderizarTabla(resultado ? resultado : []);
  }
}

function manejarFiltro() {
  const cat = selectCategoria.value;
  if (cat) {
    const filtrados = filtrarPorCategoria(productos, cat);
    renderizarTabla(filtrados);
  }
}

function manejarOrden() {
  const orden = selectOrden.value;
  const ordenados = ordenarPorPrecio(productosMostrados, orden);
  renderizarTabla(ordenados);
}

function manejarStock() {
  const bajos = comprobarStockMinimo(productos);
  renderizarTabla(bajos);
}

function manejarMostrarTodos() {
  productosMostrados = [...productos];
  inputBusqueda.value = '';
  selectCategoria.value = '';
  renderizarTabla(productosMostrados);
}
