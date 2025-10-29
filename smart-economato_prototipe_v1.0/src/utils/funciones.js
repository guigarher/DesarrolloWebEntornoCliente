export function filtrarPorCategoria(productos, categoria) {
  return productos.filter(p => p.categoria.nombre.toLowerCase() === categoria.toLowerCase());//devolver un array con todos los productos que coincidan
}

export function buscarProducto(productos, nombre) {
  const busqueda = nombre.toLowerCase();
  return productos.filter(p => p.nombre.toLowerCase().includes(busqueda));//devolver un array con todos los productos que coincidan
  //return productos.find(p => p.nombre.toLowerCase().includes(busqueda));//devolver solo el primer producto que coincida
  //cambiar en renderizarTabla para que acepte array o para que acepte un solo objeto
}

export function ordenarPorPrecio(productos, orden = 'asc') {
  const productosOrdenados = [...productos];
  productosOrdenados.sort((a, b) => {
    if (orden === 'asc') {
      return a.precio - b.precio;
    } else {
      return b.precio - a.precio;
    }
  });
  return productosOrdenados;
}

export function comprobarStockMinimo(productos) {
  return productos.filter(p => p.stock < p.stockMinimo);
}