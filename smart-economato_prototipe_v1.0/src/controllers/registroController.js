import { crearProducto, getProveedores, getCategorias, crearProveedor, crearCategoria, crearUsuario } from "../services/economatoservice.js"; 

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
  const btnBuscarOpenFood = document.getElementById("btnBuscarOpenFood");


  const registrarProductoBtn = document.getElementById("btnRegistrarProducto");
  //Formulario de registro de proveedor
  const nombreProveedorInput = document.getElementById("nombreProveedor");
  const nombreContactoInput = document.getElementById("nombreContacto");
  const numTelInput = document.getElementById("numeroTelefono");
  const mailInput = document.getElementById("emailProveedor");
  const dirInput = document.getElementById("direccionProveedor");

  const btnRegistroProveedor = document.getElementById("btnRegistrarProveedor");

  //Formulario de registro de categoría
  const nombreCategoriaInput = document.getElementById("nombreCategoria");
  const descripcionCategoriaInput = document.getElementById("descripcionCategoria");

  const btnRegistrarCategoria = document.getElementById("btnRegistrarCategoria");

  //Formulario de registro de usuario
  const usernameInput = document.getElementById("usernameUsuario");
  const passwordInput = document.getElementById("passwordUsuario");
  const roleSelect = document.getElementById("rolUsuario");
  const nombreInput = document.getElementById("nombreUsuario");
  const apellidosInput = document.getElementById("apellidosUsuario");
  const emailInput = document.getElementById("emailUsuario");
  const tlfInput = document.getElementById("telefonoUsuario");

  const btnRegistrarUsuario = document.getElementById("btnRegistrarUsuario");
  
  
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

// Buscar datos en Open Food Facts
btnBuscarOpenFood.addEventListener("click", async () => {
  const ean = codigoBarrasInput.value.trim();

  if (!ean) {
    alert("Introduce primero un código de barras.");
    return;
  }

  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(ean)}.json`);
    if (!res.ok) {
      alert("No se pudo conectar con Open Food Facts.");
      return;
    }

    const data = await res.json();

    // producto encontrado
    if (data.status === 0) {
      alert("Producto no encontrado en Open Food Facts.");
      return;
    }

    const p = data.product;

    // Nombre del producto (prioriza español si lo hay)
    if (!nombreProductoInput.value) {
      if (p.product_name_es) {
        nombreProductoInput.value = p.product_name_es;
      } else if (p.product_name) {
        nombreProductoInput.value = p.product_name;
      }
    }

    // Marca
    if (!marcaInput.value && p.brands) {
      marcaInput.value = p.brands;
    }

    // Imagen
    if (!imagenInput.value && p.image_url) {
      try {
        const urlObj = new URL(p.image_url);
        const partes = urlObj.pathname.split("/");
        const nombreArchivo = partes[partes.length - 1];
        imagenInput.value = nombreArchivo;
      } catch {
        
      }
    }

    if (Array.isArray(p.allergens_tags) && p.allergens_tags.length > 0) {
      const mapAlergenos = {
        gluten: "Gluten",
        milk: "Lácteos",
        egg: "Huevos",
        fish: "Pescado",
        crustaceans: "Crustáceos",
        molluscs: "Moluscos",
        sulphur_dioxide_and_sulphites: "Sulfitos"
      };

      const checkboxes = document.querySelectorAll('input[name="alergenos"]');

      p.allergens_tags.forEach(tag => {
        const clave = tag.split(":")[1];
        const nombreAlergeno = mapAlergenos[clave];
        if (!nombreAlergeno) return;

        checkboxes.forEach(chk => {
          if (chk.value === nombreAlergeno) {
            chk.checked = true;
          }
        });
      });
    }

    alert("Datos cargados desde Open Food Facts (si estaban disponibles). Puedes revisarlos antes de guardar.");

  } catch (error) {
    console.error("Error consultando Open Food Facts:", error);
    alert("Error al consultar Open Food Facts. Revisa la consola si necesitas más detalles.");
  }
});

  //Registrar producto
  registrarProductoBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  //Leer valores del formulario producto
  const nombre       = nombreProductoInput.value.trim();
  const codigoBarras = codigoBarrasInput.value.trim();
  const precio       = Number(pvpInput.value);
  const unidad       = unidadMedidaSelect.value;
  const stock        = Number(cantidadInput.value || 0);
  const stockMinimo  = Number(stockMinimoInput.value || 0);
  const categoriaId  = (categoriaSelect.value);
  const proveedorId  = (proveedorSelect.value);
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
    categoriaId: categoriaId ? Number(categoriaId) : null,
    proveedorId: proveedorId ? Number(proveedorId) : null,
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

    //Registrar proveedor
    btnRegistroProveedor.addEventListener("click", async(e)=>{
      e.preventDefault();

      //Leer valores formulario proveedor
      const nombre = nombreProveedorInput.value.trim();
      const contacto = nombreContactoInput.value.trim();
      const telefono = numTelInput.value.trim();
      const email = mailInput.value.trim();
      const direccion = dirInput.value.trim();

      //Validaciones

      if(!nombre){
        alert("El nombre del proveedor es obligatorio");
        return;
      }
      if (email && !email.includes("@")) {
        alert("El email del proveedor no parece válido.");
        return;
      }
      
      //Construir objeto proveedor
      const nuevoProveedor = {
        nombre,
        contacto,
        telefono,
        email,
        direccion
      };

      try {
      const creado = await crearProveedor(nuevoProveedor);

      alert(`Proveedor "${creado.nombre}" registrado con éxito`);

      // Añadirlo al <select> de proveedores para usarlo
      const option = document.createElement("option");
      option.value = creado.id;
      option.textContent = creado.nombre;
      proveedorSelect.appendChild(option);
      proveedorSelect.value = creado.id;

      // Limpiar formulario proveedor
      nombreProveedorInput.value   = "";
      nombreContactoInput.value    = "";
      numTelInput.value            = "";
      mailInput.value              = "";
      dirInput.value               = "";

    } catch (error) {
      alert("Error al registrar el proveedor.");
    }
  });

  //Registrar categoria
  btnRegistrarCategoria.addEventListener("click", async(e)=>{
    e.preventDefault();

    //Leer valores formulario categoria
    const nombre = nombreCategoriaInput.value.trim();
    const descripcion = descripcionCategoriaInput.value.trim();

    //Validaciones
    if(!nombre){
      alert("El nombre de la categoría es obligatorio");
      return;
    }

    //Construir objeto categoria
    const nuevaCategoria = {
      nombre,
      descripcion
    };

    try{
      const creado = await crearCategoria(nuevaCategoria);
      alert(`Categoría "${creado.nombre}" registrada con éxito`);
    } catch (error) {
      alert("Error al registrar la categoría.");
    }
  });

  //Registrar usuario
  btnRegistrarUsuario.addEventListener("click", async(e)=>{
    e.preventDefault;

    //Leer valores formulario usuario
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;
    const nombre = nombreInput.value.trim();
    const apellidos = apellidosInput.value.trim();
    const email = emailInput.value.trim();
    const telefono = tlfInput.value.trim();

    //Validaciones
    if(!username){
      alert("Debes rellenar el campo usuario");
    }
    if(!password){
      alert("Debes rellenar el campo contraseña");
    }
    if(!role){
      alert("Debes seleccionar un rol");
    }
    if(!nombre){
      alert("Debes rellenar el campo nombre");
    }
    if(!apellidos){
      alert("Debes rellenar el campo apellidos");
    }
    if(!email){
      alert("Debes rellenar el campo email");
    }
    if(!telefono){
      alert("Debes rellenar el campo telefono");
    }

    //Construir objeto usuario
    const nuevoUsuario = {
      username,
      password,
      role,
      nombre,
      apellidos,
      email,
      telefono
    };

    try{
      const creado = await crearUsuario(nuevoUsuario);
      alert(`Usuario "${creado.nombre}" registrado con éxito`);
    } catch (error) {
      alert("Error al registrar el usuario.");
    }

  });


}

