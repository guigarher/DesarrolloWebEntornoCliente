// Módulo principal para la gestión del almacén

import { filtrarPorCategoria, buscarProducto, ordenarPorPrecio, comprobarStockMinimo } from '../utils/funciones.js';
import { renderizarTabla, mostrarCategorias } from '../views/almacenui.js';
import {
  getProductos,
  getProducto,
  getCategorias,
  getProveedores,
  buscarProductoPorCodigoBarras,
  productosPorCategoria,
} from '../services/economatoservice.js';

// ------------------------
// Estado global
// ------------------------
let productos = [];          // ahora se llenará desde getProductos()
let productosMostrados = []; // los que estamos mostrando en la tabla

// Referencias al DOM (las rellenaremos en initAlmacen)
let controles;
let inputBusqueda;
let btnBuscar;
let btnFiltrar;
let btnOrdenar;
let btnStock;
let btnMostrarTodos;
let selectCategoria;
let selectOrden;

// ------------------------
// Carga inicial de datos
// ------------------------
async function cargarInicial() {
  try {
    productos = await getProductos();   // obtenemos todo el JSON remoto
    productosMostrados = [...productos];
    renderizarTabla(productosMostrados);

    const categorias = await getCategorias();
    mostrarCategorias(categorias);
  } catch (e) {
    console.error('Error al cargar los productos:', e);
  }
}

// ------------------------
// Inicialización del módulo (la llama routing.js)
// ------------------------
export function initAlmacen() {
  // 1. Capturamos los elementos del DOM AHORA, que la vista ya está cargada
  controles        = document.querySelector('.controles');
  inputBusqueda    = document.querySelector('#busqueda');
  btnBuscar        = document.querySelector('#btnBuscar');
  btnFiltrar       = document.querySelector('#btnFiltrarCategoria');
  btnOrdenar       = document.querySelector('#btnOrdenar');
  btnStock         = document.querySelector('#btnStock');
  btnMostrarTodos  = document.querySelector('#btnMostrarTodos');
  selectCategoria  = document.querySelector('#categoriaSelect');
  selectOrden      = document.querySelector('#ordenSelect');

  if (!controles) {
    console.error('No se ha encontrado la vista de inventario (.controles). ¿Seguro que pages/inventario.html tiene ese HTML?');
    return;
  }

  // 2. Mapa de acciones (delegación de eventos)
  const acciones = {
    buscar:  manejarBusqueda,
    filtrar: manejarFiltro,
    ordenar: manejarOrden,
    stock:   manejarStock,
    mostrar: manejarMostrarTodos
  };

  // 3. Listener de clicks en los botones dentro de .controles
  controles.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (acciones[action]) {
      acciones[action]();
    }
  });

  // 4. Cargamos los datos por primera vez
  cargarInicial();
}

// ------------------------
// Acciones
// ------------------------
function manejarBusqueda() {
  const nombre = (inputBusqueda?.value || '').trim();
  if (nombre) {
    const resultado = buscarProducto(productos, nombre);
    renderizarTabla(resultado ? resultado : []);
  } else {
    renderizarTabla(productosMostrados);
  }
}

function manejarFiltro() {
  const cat = selectCategoria?.value;
  if (cat) {
    const filtrados = filtrarPorCategoria(productos, cat);
    renderizarTabla(filtrados);
  } else {
    renderizarTabla(productosMostrados);
  }
}

function manejarOrden() {
  const orden = selectOrden?.value;
  const ordenados = ordenarPorPrecio(productosMostrados, orden);
  renderizarTabla(ordenados);
}

function manejarStock() {
  const bajos = comprobarStockMinimo(productos);
  renderizarTabla(bajos);
}

function manejarMostrarTodos() {
  productosMostrados = [...productos];
  if (inputBusqueda)    inputBusqueda.value = '';
  if (selectCategoria)  selectCategoria.value = '';
  renderizarTabla(productosMostrados);
}
