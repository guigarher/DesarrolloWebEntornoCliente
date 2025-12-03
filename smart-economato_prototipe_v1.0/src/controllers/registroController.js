import { crearProducto, getProveedores, getCategorias } from "../services/economatoservice.js"; 

export async function initRegistro() {
  // Elementos del DOM
  const tabs = document.querySelectorAll(".registro-tab");
  const sections = document.querySelectorAll(".registro-section");
  // Formulario de registro de producto
  const nombreProductoInput = document.getElementById("nombreProducto");
  const codigoBarrasInput = document.getElementById("codigoBarras");
  const pvpInput = document.getElementById("pvp");
  const unidadMedidaSelect = document.getElementById("unidadMedida");
  const stockMinimoInput = document.getElementById("stockMinimo");
  const marcaInput          = document.getElementById("marca");
  const descripcionInput   = document.getElementById("descripcion");
  const caducidadInput      = document.getElementById("caducidad");
  const categoriaSelect = document.getElementById("categoria");
  const proveedorSelect = document.getElementById("proveedorProducto");
  const imagenInput         = document.getElementById("imagen");
  const cantidadInput = document.getElementById("cantidad");
  const registrarProductoBtn = document.getElementById("btnRegistrarProducto");
  //Formulario de registro de proveedor
  const nombreProveedorInput = document.getElementById("nombreProveedor");
  const nombreContactoInput = document.getElementById("nombreContacto");
  const numTelInput = document.getElementById("numeroTelefono");
  const mailInput = document.getElementById("emailProveedor");
  const dirInput = document.getElementById("DireccionProveedor");
  const btnRegistroProveedor = document.getElementById("btnRegistrarProveedor");

  

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.target;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      sections.forEach(sec => {
        sec.classList.remove("active");
        if (sec.id === target) sec.classList.add("active");
      });
    });
  });
  try {
      const proveedores = await getProveedores();
      proveedores.forEach(proveedor => {
          const option = document.createElement("option");
          option.value = proveedor.id;
          option.textContent = proveedor.nombre;
          proveedorSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  try {
    const categorias = await getCategorias(); 
    categorias.forEach(categoria => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      categoriaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }

  registrarProductoBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  //Leer valores del formulario producto
  const nombre       = nombreProductoInput.value.trim();
  const codigoBarras = codigoBarrasInput.value.trim();
  const precio       = Number(pvpInput.value);
  const unidad       = unidadMedidaSelect.value;
  const stock        = Number(cantidadInput.value || 0);
  const stockMinimo  = Number(stockMinimoInput.value || 0);
  const categoriaId  = Number(categoriaSelect.value);
  const proveedorId  = Number(proveedorSelect.value);
  const marca        = marcaInput.value.trim();
  const descripcion  = descripcionInput.value.trim();
  const fechaCad     = caducidadInput.value || null;
  const imagen       = imagenInput.value.trim();

  const alergenosCheckboxes = document.querySelectorAll('input[name="alergenos"]:checked');
  const alergenos = Array.from(alergenosCheckboxes).map(chk => chk.value);

  //VALIDACIONES
  if (!codigoBarras) {
    alert("El código de barras es obligatorio.");
    return;
  }

  if (!nombre) {
    alert("El nombre del producto es obligatorio.");
    return;
  }

  if (!precio || precio <= 0) {
    alert("El precio debe ser un número positivo.");
    return;
  }

  if (!unidad) {
    alert("Debes seleccionar una unidad de medida (kg, l, ud...).");
    return;
  }

  if (stock<0) {
    alert("El stock no puede ser negativo.");
    return;
  }
  if (stockMinimo<0) {
    alert("El stock mínimo no puede ser negativo.");
    return;
  }

  if (!categoriaId) {
    const irCategorias = confirm(
      "Debes seleccionar una categoría antes de crear el producto.\n\n" +
      "¿Quieres ir a la sección de categorías para crearlo?"
    );
    if (irCategorias) {
      const tabCategoria = document.querySelector('.registro-tab[data-target="seccion-categoria"]');
        if (tabCategoria) {
          tabCategoria.click();  
        } else {
          alert("No se encontró la pestaña de Categoría.");
        }
    }
    return;
  }

  if (!proveedorId) {
    const irProveedores = confirm(
      "Debes seleccionar un proveedor antes de crear el producto.\n\n" +
      "¿Quieres ir a la sección de proveedores para crearlo?"
    );

    if (irProveedores) {
      const tabProveedor = document.querySelector('.registro-tab[data-target="seccion-proveedor"]');
        if (tabProveedor) {
          tabProveedor.click();  
        } else {
          alert("No se encontró la pestaña de Proveedor.");
        }
      }
      return;
  }

  //Construir objeto producto
  const nuevoProducto = {
    nombre,
    precio,
    precioUnitario: unidad,   
    unidadMedida: unidad,     
    stock,
    stockMinimo,
    categoriaId,
    proveedorId,
    marca,
    codigoBarras,
    fechaCaducidad: fechaCad,
    alergenos,
    descripcion,
    imagen,
    activo: true
  };

  //Guardar en la API
  try {
    const creado = await crearProducto(nuevoProducto);
    alert(`Producto "${creado.nombre}" registrado con éxito (ID: ${creado.id})`);

    //Limpiar formulario
    nombreProductoInput.value   = "";
    codigoBarrasInput.value     = "";
    pvpInput.value              = "";
    unidadMedidaSelect.value    = "";
    stockMinimoInput.value      = "";
    categoriaSelect.value       = "";
    proveedorSelect.value       = "";
    marcaInput.value            = "";
    descripcionInput.value      = "";
    caducidadInput.value        = "";
    imagenInput.value           = "";
    cantidadInput.value         = "";
    alergenosCheckboxes.forEach(chk => chk.checked = false);

  } catch (error) {
    console.error("Error al registrar producto:", error);
    alert("Error al registrar el producto. Revisa la consola para más detalles.");
  }
});
// Enfocar campo código de barras al cargar la página
    setTimeout(() => {
        const codigoInput = document.getElementById("codigoBarras");
        if (codigoInput) codigoInput.focus();
    }, 50);


    btnRegistroProveedor.addEventListener("click", async(e)=>{
      e.preventDefault();
    })
}
