export function filtrarPorCategoria(productos, categoria) {
  return productos.filter(p => p.categoria?.nombre?.toLowerCase() === categoria.toLowerCase());
}
export function buscarProductos(productos, termino) {
  const q = normaliza(termino);
  return productos.filter(p => normaliza(p.nombre).includes(q));
}
export function ordenarPorPrecio(productos, orden = 'asc') {
  const factor = orden === 'asc' ? 1 : -1;
  return [...productos].sort((a, b) => factor * (a.precio - b.precio));
}
export function comprobarStockMinimo(productos) {
  let alertas = 0;
  productos.forEach(p => {
    if (p.stock < p.stockMinimo) {      
      console.warn(`ALERTA: ${p.nombre} (${p.stock}/${p.stockMinimo})`);
      alertas++;
    }
  });
  if (alertas === 0) console.log("Todos los productos tienen suficiente stock.");
}
function normaliza(txt) {
  return String(txt)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}
