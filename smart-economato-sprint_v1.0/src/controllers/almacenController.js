import { getProductos, getCategorias } from '../services/economatoService.js';
import { filtrarPorCategoria, buscarProductos, ordenarPorPrecio } from '../utils/funciones.js';
import { renderizarTabla, generarCategorias } from '../views/almacen-ui.js';
import { AuthService } from '../services/authService.js';


let inputBusqueda
let selectCategoria
let selectOrden
let productos = [];
let categorias = [];
let productosMostrados = [];


const eventMap = [
  { selector: '#btnBuscar', event: 'click', handler: onBuscar },
  { selector: '#ordenSelect', event: 'change', handler: onOrdenar },
  { selector: '#categoriaSelect', event: 'change', handler: onFiltrar },
  { selector: '#btnAllProducts', event: 'click', handler: onShowAll },
  { selector: '#busqueda', event: 'keydown', handler: onBuscarLive },
  { selector: '#btnLogout', event: 'click', handler: onLogout },
];

export async function inicializar() {
  cargarElementosDOM()
  productos = await getProductos()
  categorias = await getCategorias()
  productosMostrados = [...productos];
  renderizarTabla(productosMostrados);
  generarCategorias(categorias);
  bindEvents(eventMap);
}


function cargarElementosDOM() {
  inputBusqueda = document.querySelector('#busqueda');
  selectCategoria = document.querySelector('#categoriaSelect');
  selectOrden = document.querySelector('#ordenSelect');
}

function onShowAll() {
  productosMostrados = [...productos];
  inputBusqueda.value = '';
  selectCategoria.value = '';
  selectOrden.value = 'asc';
  renderizarTabla(productosMostrados);
}

function onBuscar() {
  const termino = document.querySelector('#busqueda').value.trim();
  productosMostrados = buscarProductos(productos, termino);
  renderizarTabla(productosMostrados);
}

function onOrdenar() {
  const orden = selectOrden.value;
  productosMostrados = ordenarPorPrecio(productosMostrados, orden);
  renderizarTabla(productosMostrados);
}

function onFiltrar() {
  const cat = selectCategoria.value;
  productosMostrados = cat ? filtrarPorCategoria(productos, cat) : [...productos];
  renderizarTabla(productosMostrados);
}

function onBuscarLive() {
  const termino = inputBusqueda.value.trim();
  if (termino.length < 2) {
    productosMostrados = [...productos];
    renderizarTabla(productosMostrados);
    return; // Evitamos búsquedas con 1 letra
  }
  productosMostrados = buscarProductos(productos, termino);
  renderizarTabla(productosMostrados);
}

function onLogout() {
  AuthService.logout()
} 


function bindEvents(events) {
  for (const { selector, event, handler, options } of events) {
    const el = document.querySelector(selector);
    if (el) el.addEventListener(event, handler, options);
  }
}


