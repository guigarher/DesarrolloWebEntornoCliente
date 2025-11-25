const API_URL = "http://localhost:3000";

// Productos

export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) {
    throw new Error("Error al cargar productos");
  }
  return await res.json();
}

export async function getProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`);
  if (!res.ok) {
    throw new Error(`Producto con id ${id} no encontrado`);
  }
  return await res.json();
}

export async function buscarProductoPorCodigoBarras(ean) {
  const code = String(ean).trim();

  if (!code) return null;


  const res = await fetch(
    `${API_URL}/productos?codigoBarras=${encodeURIComponent(code)}`
  );

  if (!res.ok) {
    throw new Error("Error al buscar producto por código de barras");
  }

  const productos = await res.json();

  return productos[0] ?? null;
}

export async function productosPorCategoria(categoriaId) {
  const numCat = Number(categoriaId);
  if (!numCat) return [];

  const res = await fetch(
    `${API_URL}/productos?categoriaId=${encodeURIComponent(numCat)}`
  );

  if (!res.ok) {
    throw new Error("Error al filtrar productos por categoría");
  }

  return await res.json();
}

// Categorías

export async function getCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) {
    throw new Error("Error al cargar categorías");
  }
  return await res.json();
}

// Proveedores

export async function getProveedores() {
  const res = await fetch(`${API_URL}/proveedores`);
  if (!res.ok) {
    throw new Error("Error al cargar proveedores");
  }
  return await res.json();
}
