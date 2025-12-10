import { 
    getProveedores,
    buscarProductoPorCodigoBarras,
    incrementarStockPorCodigo,
    crearAlbaran,
    actualizarProductoPorCodigo,
    getPedidosProfesores,         
    actualizarPedidoProfesor               
} from "../services/economatoservice.js";
import { renderizarTablaRecepcion } from "../views/recepcionui.js";    

// Inicializar la página de recepción
export async function initRecepcion() {
    // formulario
    const form = document.getElementById("form-recepcion");
    // albarán
    const numAlbaranInput = document.getElementById("numAlbaran");
    const fechaInput = document.getElementById("fecha");
    const proveedorSelect = document.getElementById("proveedorId");
    const incidenciasInput = document.getElementById("incidencias");
    // producto
    const codigoBarrasInput = document.getElementById("codigoBarras");
    const cantidadInput = document.getElementById("cantidad");
    const nombreProductoInput = document.getElementById("nombreProducto");
    const pvpInput = document.getElementById("pvp");
    // botón
    const addProductoBtn = document.getElementById("btnAddLinea");
    // tabla
    const tablaBody = document.getElementById("tablaBody");

    // Rellenamos el nº de albarán si venimos de Resumen
    const albaranEnCurso = sessionStorage.getItem("albaranEnCurso");
    if (numAlbaranInput && albaranEnCurso) {
        numAlbaranInput.value = albaranEnCurso;
        sessionStorage.removeItem("albaranEnCurso");
    }

    // Info extra de recepción parcial (proveedor + pedidos afectados)
    const recepcionParcialInfoRaw = sessionStorage.getItem("recepcionParcialInfo");
    let recepcionParcialInfo = null;
    if (recepcionParcialInfoRaw) {
        try {
            recepcionParcialInfo = JSON.parse(recepcionParcialInfoRaw);
        } catch (e) {
            console.error("Error parseando recepcionParcialInfo:", e);
        }
    }

    // Lista de productos en el albarán
    const productosAlbaran = [];

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
        // Buscar el producto
        try {
            const producto = await buscarProductoPorCodigoBarras(codigoBarras);
            
            if (!producto) {
                const irCrear = confirm(
                    "Este código de barras no existe en el inventario.\n\n¿Deseas crear este producto?"
                );

                if (irCrear) {
                    const linkRegistro = document.querySelector('.nav a[data-page="registro"]'); 
                    if (linkRegistro) {
                        linkRegistro.click();  
                    } else {
                        console.warn("No se encontró el enlace de registro en el menú.");
                    }
                }

                nombreProductoInput.value = "";
                pvpInput.value = "";
                proveedorSelect.value = "";
                return;
            }
            // Si existe, autocompletamos
            nombreProductoInput.value = producto.nombre;
            pvpInput.value = Number(producto.precio).toFixed(2);
            proveedorSelect.value = producto.proveedorId;
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
        if(proveedorSelect.value === ""){
            alert("Debes seleccionar un proveedor.");
            return;
        }
        if(fechaInput.value === ""){
            alert("La fecha del albarán es obligatoria.");
            return;
        }

        // Verificar si el producto existe en el inventario
        const productoExistente = await buscarProductoPorCodigoBarras(codigoBarras);
        if (!productoExistente) {
            alert("Este producto no existe aún en el inventario.");
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
        if (!e.target.matches(".btn-eliminar-linea")) return;
        const fila = e.target.closest("tr");
        const codigoBarrasEliminar = fila.querySelector("td").textContent.trim();
        const index = productosAlbaran.findIndex(p => p.codigoBarras === codigoBarrasEliminar);
        productosAlbaran.splice(index, 1);
        renderizarTablaRecepcion(productosAlbaran);
    });

    // Enviar albarán / Actualizar stock
    const btnRegistrar = document.getElementById("btnRegistrarRecepcion");
    if (!btnRegistrar) {
        return;
    }

    // Manejar clic en registrar recepción
    btnRegistrar.addEventListener("click", async () => {
        if (productosAlbaran.length === 0) {
            alert("Añade al menos un producto antes de registrar la recepción.");
            return;
        }
        // Validaciones albarán
        if (numAlbaranInput.value.trim() === "") {
            alert("El número de albarán es obligatorio.");
            return;
        }
        if (proveedorSelect.value === "") {
            alert("Debes seleccionar un proveedor.");
            return;
        }
        if (fechaInput.value === "") {
            alert("La fecha del albarán es obligatoria.");
            return;
        }

        // Construir objeto albarán
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
            // Crear albarán en el sistema
            await crearAlbaran(nuevoAlbaran);

            // Actualizar stock para cada producto
            for (const linea of productosAlbaran) {
                await incrementarStockPorCodigo(linea.codigoBarras, linea.cantidad);

                const productoBD = await buscarProductoPorCodigoBarras(linea.codigoBarras);

                // Actualizar precio si ha cambiado
                if (productoBD && Number(productoBD.precio) !== Number(linea.pvp)) {
                    await actualizarProductoPorCodigo(linea.codigoBarras, {
                        precio: linea.pvp
                    });
                }
            }

            // 🔁 Si venimos de una recepción parcial, restar cantidades en los pedidos
            if (recepcionParcialInfo) {
                try {
                    const { proveedorId, pedidosProfesoresIds } = recepcionParcialInfo;

                    // mapa: codigoBarras -> cantidadRecepcionada
                    const recibidosPorCodigo = new Map();
                    for (const linea of productosAlbaran) {
                        const actual = recibidosPorCodigo.get(linea.codigoBarras) || 0;
                        recibidosPorCodigo.set(linea.codigoBarras, actual + linea.cantidad);
                    }

                    // Cargamos todos los pedidos actuales
                    const pedidos = await getPedidosProfesores();

                    for (const pedidoId of pedidosProfesoresIds) {
                        const pedido = pedidos.find(p => p.id === pedidoId);
                        if (!pedido) continue;

                        const nuevasLineas = [];

                        for (const linea of (pedido.lineas || [])) {
                            const provLinea = (linea.proveedorId ?? "LIBRE");
                            const provObjetivo = (proveedorId ?? "LIBRE");

                            // Si no es del proveedor que estamos recepcionando, se deja igual
                            if (provLinea != provObjetivo) {
                                nuevasLineas.push(linea);
                                continue;
                            }

                            const codigo = linea.codigoBarras;
                            let pendienteRecepcionar = recibidosPorCodigo.get(codigo) || 0;

                            // Si no hay nada recepcionado de este código, se deja la línea intacta
                            if (pendienteRecepcionar <= 0) {
                                nuevasLineas.push(linea);
                                continue;
                            }

                            // Hay cantidad pendiente por aplicar a esta línea
                            if (pendienteRecepcionar >= linea.cantidad) {
                                // Se cumple toda la línea: la quitamos
                                recibidosPorCodigo.set(codigo, pendienteRecepcionar - linea.cantidad);
                                // NO la añadimos a nuevasLineas → desaparece
                            } else {
                                // Solo se ha recibido parte: restamos y dejamos lo que falta
                                linea.cantidad = linea.cantidad - pendienteRecepcionar;
                                recibidosPorCodigo.set(codigo, 0);
                                nuevasLineas.push(linea);
                            }
                        }

                        const nuevoEstado = nuevasLineas.length > 0 ? "pendiente" : "recibido";

                        await actualizarPedidoProfesor(pedidoId, {
                            lineas: nuevasLineas,
                            estado: nuevoEstado,
                        });
                    }

                    // Limpiamos la info parcial, ya está procesada
                    sessionStorage.removeItem("recepcionParcialInfo");
                } catch (e) {
                    console.error("Error actualizando pedidos tras recepción parcial:", e);
                }
            }

            // Confirmación al usuario
            alert("Albarán registrado y stock actualizado correctamente.");

            // Resetear formulario y lista de productos
            form.reset();
            productosAlbaran.length = 0;
            renderizarTablaRecepcion(productosAlbaran);
            fechaInput.valueAsDate = new Date();
        } catch (error) {
            console.error("Error al registrar albarán o actualizar stock:", error);
        }
    });

    // Enfocar campo código de barras al cargar la página
    setTimeout(() => {
        const codigoInput = document.getElementById("codigoBarras");
        if (codigoInput) codigoInput.focus();
    }, 50);
}
