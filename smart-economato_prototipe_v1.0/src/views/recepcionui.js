
export function renderizarTablaRecepcion(producto) {
    const tablaLineasBody = document.getElementById("tablaLineas");
    tablaLineasBody.innerHTML = '';
    
    producto.forEach(p => {
        const fila = document.createElement('tr');

        const celdaCodigo = document.createElement('td');
        celdaCodigo.textContent = p.codigoBarras;

        const celdaProducto = document.createElement('td');
        celdaProducto.textContent = p.nombreProducto;

        const celdaCantidad = document.createElement('td');
        celdaCantidad.textContent = p.cantidad;

        const celdaPVP = document.createElement('td');
        celdaPVP.textContent = p.pvp.toFixed(2) + ' €';

        const celdaBtnEliminar = document.createElement('td');
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';

        fila.appendChild(celdaCodigo);
        fila.appendChild(celdaProducto);
        fila.appendChild(celdaCantidad);
        fila.appendChild(celdaPVP);
        fila.appendChild(celdaBtnEliminar);
        celdaBtnEliminar.appendChild(btnEliminar);

        tablaLineasBody.appendChild(fila);
    });
}