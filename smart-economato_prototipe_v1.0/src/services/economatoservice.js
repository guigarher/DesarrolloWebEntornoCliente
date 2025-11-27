const API_URL = "http://localhost:3000";

// Productos
export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) {
    throw new Error("Error al cargar productos");
  }
  return await res.json();
}

// Obtener un producto por su ID
export async function getProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`);
  if (!res.ok) {
    throw new Error(`Producto con id ${id} no encontrado`);
  }
  return await res.json();
}

// Buscar producto por código de barras
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

// Filtrar productos por categoría
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

// Crear un nuevo albarán en json-server
export async function crearAlbaran(albaran) {
  const res = await fetch(`${API_URL}/albaranes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(albaran),
  });

  if (!res.ok) {
    throw new Error("Error al crear el albarán");
  }

  return await res.json(); 
}

// Incrementar el stock de un producto usando su código de barras
export async function incrementarStockPorCodigo(codigoBarras, cantidad) {
  const producto = await buscarProductoPorCodigoBarras(codigoBarras);

  if (!producto) {
    throw new Error(`Producto con código ${codigoBarras} no encontrado`);
  }

  const stockActual = Number(producto.stock ?? 0);
  const cantidadNum = Number(cantidad);
  const stockNuevo  = stockActual + cantidadNum;

  const res = await fetch(`${API_URL}/productos/${producto.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock: stockNuevo }),
  });

  if (!res.ok) {
    const texto = await res.text();
    throw new Error("Error al actualizar el stock");
  }

  const actualizado = await res.json();
  return actualizado;
}

// Crear un nuevo producto
export async function crearProducto(producto) {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });

  if (!res.ok) {
    throw new Error("Error al crear el producto");
  }

  return await res.json();
}

