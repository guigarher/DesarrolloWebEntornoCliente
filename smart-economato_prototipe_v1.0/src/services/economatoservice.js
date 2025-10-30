async function getProducto(id) {
  const response = await fetch(`http://${id}`);  
    if (!response.ok) {
        throw new Error(`Producto con id ${id} no encontrado`);
    }
    const producto = await response.json();
    return producto;
}

async function getProductos() {
    const promises = [];
    for (let id = 1; id <= 20; id++) {
        promises.push(getProducto(id));
    }
    const productos = await Promise.allSettled(promises);
    const ok = [];
    const failed = [];
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].status === "fulfilled") {
            ok.push(productos[i].value);
        } else {
            failed.push(i + 1); // id que falló (posición 1..20)
        }
    }
    return { ok, failed };
}