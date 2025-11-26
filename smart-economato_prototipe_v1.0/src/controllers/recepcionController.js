import { getProveedores } from "../services/economatoservice.js";
import { buscarProductoPorCodigoBarras } from "../services/economatoservice.js";
import { renderizarTablaRecepcion } from "../views/recepcionui.js";    

export async function initRecepcion() {

    const productosAlbaran = [];
    //formulario
    const form = document.getElementById("form-recepcion");
    //albaran
    const numAlbaranInput = document.getElementById("numAlbaran");
    const fechaInput = document.getElementById("fecha");
    const proveedorSelect = document.getElementById("proveedorId");
    const incidenciasInput = document.getElementById("incidencias");
    //producto
    const codigoBarrasInput = document.getElementById("codigoBarras");
    const cantidadInput = document.getElementById("cantidad");
    const nombreProductoInput = document.getElementById("nombreProducto");
    const pvpInput = document.getElementById("pvp");
    //boton
    const addProductoBtn = document.getElementById("btnAddLinea");
    //tabla
    const tablaLineasBody = document.getElementById("tablaLineas");

    // Cargar proveedores en el select
    try {
        const proveedores =  await getProveedores();
        proveedores.forEach(proveedor => {
            const option = document.createElement("option");
            option.value = proveedor.id;
            option.textContent = proveedor.nombre;
            proveedorSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
    }

    addProductoBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const codigoBarras = codigoBarrasInput.value.trim();
        const cantidad = Number(cantidadInput.value);
        const nombreProducto = nombreProductoInput.value.trim();
        const pvp = Number(pvpInput.value);

        if (!codigoBarras){
            alert("El código de barras es obligatorio.");
            return;
        }
        if(!cantidad || cantidad <= 0){
            alert("La cantidad debe ser un número positivo.");
            return;
        }
        if(!nombreProducto){
            alert("El nombre del producto es obligatorio.");
            return;
        }
        if(!pvp || pvp <= 0){
            alert("El PVP debe ser un número positivo.");
            return;
        }

        const comprobarCodigo = await buscarProductoPorCodigoBarras(codigoBarras);
        if (!comprobarCodigo) {
            alert("Producto no encontrado en el inventario.");
            return;
        }

        const producto = { codigoBarras, cantidad, nombreProducto, pvp };
        productosAlbaran.push(producto);

        renderizarTablaRecepcion(productosAlbaran);

        
        
        });
}