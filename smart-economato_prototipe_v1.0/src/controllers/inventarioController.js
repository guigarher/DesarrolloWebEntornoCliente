import {
  filtrarPorCategoria,
  buscarProducto,
  ordenarPorPrecio,
  comprobarStockMinimo
} from '../utils/funciones.js';

import {
  renderizarTabla,
  mostrarCategorias
} from '../views/inventarioui.js';

import {
  getProductos,
  getCategorias
} from '../services/economatoservice.js';


let productos = [];          
let productosMostrados = []; 

// Referencias al DOM
let controles;
let inputBusqueda;
let selectCategoria;
let selectOrden;


function actualizarTabla(lista) {     
  productosMostrados = [...lista];
  renderizarTabla(productosMostrados);
}


// Carga de datos

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

  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', () => {
      console.log('EVENTO INPUT');
      manejarBusqueda();
    });
  } else {
    console.warn('No se ha encontrado el input de búsqueda #busqueda');
  }

  cargarInicial();
}


// Acciones

function manejarBusqueda() {
  const nombre = (inputBusqueda?.value || '').trim().toLowerCase();

  if (nombre) {
    const resultado = buscarProducto(productos, nombre);
    actualizarTabla(resultado);
  } else {
    actualizarTabla(productos);
  }
}

function manejarFiltro() {
  const cat = selectCategoria?.value;

  if (!cat) {
    actualizarTabla(productos);
    return;
  }

  const id = Number(cat); 

  const filtrados = productos.filter(p => p.categoriaId === id);

  actualizarTabla(filtrados);
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
