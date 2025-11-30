import {
  filtrarPorCategoria,
  buscarProducto,
  ordenarPorPrecio,
  comprobarStockMinimo
} from '../utils/funciones.js';

import {
  renderizarTabla,
  mostrarCategorias
} from '../views/almacenui.js';

import {
  getProductos,
  getCategorias
} from '../services/economatoservice.js';

// ------------------------
// Estado global
// ------------------------
let productos = [];          // todos los productos
let productosMostrados = []; // lo que se ve en la tabla

// Referencias al DOM
let controles;
let inputBusqueda;
let selectCategoria;
let selectOrden;

// ------------------------
// Helper para centralizar el pintado
// ------------------------
function actualizarTabla(lista) {     
  productosMostrados = [...lista];
  renderizarTabla(productosMostrados);
}

// ------------------------
// Carga inicial de datos
// ------------------------
async function cargarInicial() {
  try {
    productos = await getProductos();
    productosMostrados = [...productos];
    renderizarTabla(productosMostrados);

    const categorias = await getCategorias();
    mostrarCategorias(categorias);
  } catch (e) {
    console.error('Error al cargar los productos:', e);
  }
}

// ------------------------
// Inicialización del módulo 
// ------------------------
export function initAlmacen() {
  controles       = document.querySelector('.controles');
  inputBusqueda   = document.querySelector('#busqueda');
  selectCategoria = document.querySelector('#categoriaSelect');
  selectOrden     = document.querySelector('#ordenSelect');

  if (!controles) {
    console.error('No se ha encontrado la vista de inventario (.controles).');
    return;
  }

  const acciones = {
    buscar:  manejarBusqueda,
    filtrar: manejarFiltro,
    ordenar: manejarOrden,
    stock:   manejarStock,
    mostrar: manejarMostrarTodos
  };

  controles.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (acciones[action]) {
      acciones[action]();
    }
  });

  cargarInicial();
}

// ------------------------
// Acciones
// ------------------------
function manejarBusqueda() {
  const nombre = (inputBusqueda?.value || '').trim();

  if (nombre) {
    //Buscar 
    const resultado = buscarProducto(productosMostrados, nombre);
    actualizarTabla(resultado);        
  } else {
    actualizarTabla(productosMostrados);        
  }
}

function manejarFiltro() {
  const cat = selectCategoria?.value;
  if (cat) {
    const filtrados = filtrarPorCategoria(productosMostrados, cat);
    actualizarTabla(filtrados);      
  } else {
    actualizarTabla(productos);       
  }
}

function manejarOrden() {
  const orden = selectOrden?.value || 'asc';
  const ordenados = ordenarPorPrecio(productosMostrados, orden);
  actualizarTabla(ordenados);         
}

function manejarStock() {
  const bajos = comprobarStockMinimo(productos);
  actualizarTabla(bajos);             
}

function manejarMostrarTodos() {
  if (inputBusqueda)   inputBusqueda.value   = '';
  if (selectCategoria) selectCategoria.value = '';
  if (selectOrden)     selectOrden.value     = 'asc';

  actualizarTabla(productos);        
}
