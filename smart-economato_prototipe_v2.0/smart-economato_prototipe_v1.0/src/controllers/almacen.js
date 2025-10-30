import { productos } from '../services/productos.js';
import { filtrarPorCategoria, buscarProducto, ordenarPorPrecio, comprobarStockMinimo } from '../utils/funciones.js';
import { renderizarTabla } from '../view/almacen-ui.js';



const inputBusqueda = document.querySelector('#busqueda');
const btnBuscar = document.querySelector('#btnBuscar');
const btnStock = document.querySelector('#btnStock');
const btnMostrarTodos = document.querySelector('#btnAllProducts');
const selectCategoria = document.querySelector('#categoriaSelect');
const selectOrden = document.querySelector('#ordenSelect');


const evenMap = [
  {selector: '#btnBuscar', event: 'click', handler: onBuscar},
  {selector: '#ordenSelect', event: 'change', handler: onOrdenar},
  {selector: '#btnAllProducts', event: 'click', handler: onShowAll},

]

let productosMostrados = [];

function inicializar() {
  productosMostrados = [...productos];
  renderizarTabla(productosMostrados)
  bindEvents(evenMap)
}


function onBuscar() {
  const termino = inputBusqueda.value.trim()
  productosMostrados = buscarProducto(productos, termino)
  renderizarTabla(productosMostrados)
}

function onOrdenar() {
  const orden = selectOrden.value
  productosMostrados = ordenarPorPrecio(productos, orden)
}

function onShowAll() {
  productosMostrados = [...productos];
  inputBusqueda.value = '';
  selectCategoria.value = '';
  renderizarTabla(productosMostrados);
}

function bindEvents(events) {
  for (const {selector, event, handler, options} of events) {
    const el = document.querySelector(selector)
      if (el) el.addEventListener(event, handler, options)
  }
}

inicializar()