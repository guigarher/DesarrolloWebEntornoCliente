export function filtrarPorCategoria(productos, categoria) {
  return productos.filter(p=>p.categoria?.nombre?.toLowerCase() == categoria.toLowerCase())
}

export function buscarProducto(productos, nombre) {
  //Normalizamos de alguna manera pero de momento lo dejo así
  return productos.filter(p=> p.nombre.includes(nombre))
}

export function ordenarPorPrecio(productos, orden = 'asc') {
  const factor = orden  ==='asc' ? 1 : -1
  return [...productos].sort((a,b) => factor * (a.precio -b.precio))
}

export function comprobarStockMinimo(productos) {
 //
}