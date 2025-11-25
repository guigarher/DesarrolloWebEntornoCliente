import { getProveedores } from "../services/economatoservice.js";

export async function initRecepcion() {
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

}