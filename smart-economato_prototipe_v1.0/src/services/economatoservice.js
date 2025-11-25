const API_URL = "http://localhost:3000";

let dbCache = null;

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

