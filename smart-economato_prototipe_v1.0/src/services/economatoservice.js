// src/services/economatoservice.js

//const DB_URL = "https://raw.githubusercontent.com/guigarher/DesarrolloWebEntornoCliente/main/smart-economato_prototipe_v1.0/src/services/db.json";
const API_URL = "http://localhost:3000";


// Caché en memoria para evitar múltiples descargas
let dbCache = null;

/**
 * Descarga el JSON remoto una única vez y lo devuelve parseado.
 * Si ya está en cache, devuelve el cache.
 */
/*async function fetchDB() {
  if (dbCache) return dbCache;

  const res = await fetch(DB_URL);
  if (!res.ok) {
    throw new Error("No se pudo cargar la BBDD remota");
  }
  const data = await res.json();
  dbCache = data; // guardamos en memoria
  return data;
}
  */

// --- Selectores de datos (APIs de lectura) ---

export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error("Error al cargar productos");
  return await res.json();
}

export async function getProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`);
  if (!res.ok) throw new Error(`Producto con id ${id} no encontrado`);
  return await res.json();
}

export async function getCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) throw new Error("Error al cargar categorías");
  return await res.json();
}

export async function getProveedores() {
  const res = await fetch(`${API_URL}/proveedores`);
  if (!res.ok) throw new Error("Error al cargar proveedores");
  return await res.json();
}

// Extras útiles

export async function buscarProductoPorCodigoBarras(ean) {
  const db = await fetchDB();
  const code = String(ean);
  return db.productos?.find(p => p.codigoBarras === code) ?? null;
}

export async function productosPorCategoria(categoriaId) {
  const db = await fetchDB();
  const numCat = Number(categoriaId);
  return (db.productos ?? []).filter(p => p.categoriaId === numCat);
}

// (Opcional) Si alguna vez quieres forzar recarga:
// export function forceRefresh() { dbCache = null; }
