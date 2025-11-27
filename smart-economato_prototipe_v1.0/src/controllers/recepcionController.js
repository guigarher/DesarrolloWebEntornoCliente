import { 
    getProveedores,
    buscarProductoPorCodigoBarras,
    crearAlbaran,
    incrementarStockPorCodigo
} from "../services/economatoservice.js";
import { renderizarTablaRecepcion } from "../views/recepcionui.js";    

// Inicializar la página de recepción
export async function initRecepcion() {
    // Lista de productos en el albarán
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
    const tablaBody = document.getElementById("tablaBody");
    // Establecer la fecha actual por defecto
    fechaInput.valueAsDate = new Date();

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
    // Buscar producto por código de barras y completar campos
    codigoBarrasInput.addEventListener("change", async () => {
        const codigoBarras = codigoBarrasInput.value.trim();
        if (!codigoBarras) {
            nombreProductoInput.value = "";
            pvpInput.value = "";
            proveedorSelect.value = "";
            return;
        }
        try {
            const producto = await buscarProductoPorCodigoBarras(codigoBarras);
            if (producto) {
                nombreProductoInput.value = producto.nombre;
                pvpInput.value = Number(producto.precio.toFixed(2));
                proveedorSelect.value = producto.proveedorId;
            } else {
                nombreProductoInput.value = "";
                pvpInput.value = "";
                proveedorSelect.value = "";
                
            }
        } catch (error) {
            console.error("Error al buscar producto:", error);
        }
    });
     // Añadir producto al albarán
    addProductoBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const codigoBarras = codigoBarrasInput.value.trim();
        const cantidad = Number(cantidadInput.value);
        const nombreProducto = nombreProductoInput.value.trim();
        const pvp = Number(pvpInput.value);
        // Validaciones básicas
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
        if(numAlbaranInput.value.trim() === ""){
            alert("El número de albarán es obligatorio.");
            return;
        }
        // Crear objeto producto
        const producto = { codigoBarras, cantidad, nombreProducto, pvp };
        // Verificar si el producto ya está en la lista
        const existente = productosAlbaran.find(p => p.codigoBarras === codigoBarras);
        if (existente) {
            alert("Ya has añadido ese producto.");
        } else {
            productosAlbaran.push(producto);
        }
        // Renderizar tabla
        renderizarTablaRecepcion(productosAlbaran);
        // Limpiar campos de producto
        codigoBarrasInput.value = "";
        cantidadInput.value = "1";
        nombreProductoInput.value = "";
        pvpInput.value = "";
        codigoBarrasInput.focus();
    });
     // Eliminar producto de la tabla
    tablaBody.addEventListener("click", (e) => { 
        if (!e.target.matches(".btn-eliminar-linea")) return;{
            const fila = e.target.closest("tr");
            const codigoBarrasEliminar = fila.querySelector("td").textContent.trim();
            const index = productosAlbaran.findIndex(p => p.codigoBarras === codigoBarrasEliminar);
            productosAlbaran.splice(index, 1);
            renderizarTablaRecepcion(productosAlbaran);
        }
    });
    // Enviar albarán
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (productosAlbaran.length === 0) {
            alert("Añade al menos un producto al albarán.");
            return;
        }
        const nuevoAlbaran = {
            numeroAlbaran: numAlbaranInput.value.trim(),
            fecha: fechaInput.value,
            proveedorId: Number(proveedorSelect.value),
            proveedorNombre: proveedorSelect.options[proveedorSelect.selectedIndex].text,
            incidencias: incidenciasInput.value.trim(),
            lineas: productosAlbaran.map(p => ({
                codigoBarras: p.codigoBarras,
                cantidad: p.cantidad,
                nombreProducto: p.nombreProducto,
                pvp: p.pvp
            }))
        };
        try {
            await crearAlbaran(nuevoAlbaran);
            for (const producto of productosAlbaran) {
                await incrementarStockPorCodigo(producto.codigoBarras, producto.cantidad);
            }
            form.reset();
            productosAlbaran.length = 0;
            renderizarTablaRecepcion(productosAlbaran);
            fechaInput.valueAsDate = new Date();
        } catch (error) {
            console.error("Error al crear albarán o actualizar stock:", error);
            alert("Hubo un error al procesar el albarán. Revisa la consola para más detalles.");
        }
    });
}