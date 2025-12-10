Smart Economato - Prototipo
Autor: Guillermo García Hernández
Módulo: Desarrollo Web Entorno Cliente/ Desarrollo de Interfaces Web
Año: 25/26

Este proyecto es un prototipo de aplicación web para gestionar un economato.

Está desarrollado en HTML + CSS + JavaScript (ES Modules) y usa un backend simulado con JSON-Server.


Descripción técnica de las principales partes


1. Login y control de sesión:

La página de login se encarga de la autenticación básica del usuario.

El código está montado sobre un DOMContentLoaded para asegurarse de que el formulario y los elementos del DOM existen antes de añadir eventos.

El formulario de login tiene un event.preventDefault() para evitar el envío “clásico” y manejar el proceso completamente en JavaScript (llamadas a la API, mensajes de error, etc.).

Desde el controller de login se importan:

authService → encapsula la lógica de autenticación (fetch, respuesta, etc.).

loginUI → se encarga de mostrar mensajes de error, limpiar campos, etc.

Lo que yo he añadido en esta parte es la lógica de manejo de sesión con sessionStorage:

Cuando el login es correcto, guardo los datos básicos del usuario en sessionStorage (username, rol, etc.), de forma que:

El resto de la aplicación puede saber si hay un usuario logeado.

Se puede comprobar rápidamente el rol del usuario.

Si el login falla, se muestra un mensaje y no se guarda nada en sesión.

Esta parte es la base para que el routing y las páginas privadas puedan saber si se puede entrar o hay que mandarte de vuelta al login.


2. SPA y routing:

El archivo routing.js es el que hace de “pegamento” entre todas las páginas/controladores y el estado de login.

En él se hace:

Importación de todos los init... de las diferentes páginas:

En el DOMContentLoaded:

Se comprueba si hay un usuario logeado en sessionStorage.

Si no lo hay, se redirige al login.

Si sí lo hay, se carga la página principal (menú/spa) y se muestra su nombre en el aside.

Pintar el nombre del usuario en el aside:
El nombre se obtiene del sessionStorage y se muestra en la zona de usuario del menú.

Botón de logout:

Borra el usuario de sessionStorage.

Devuelve al login.

Mapa de títulos:
Para que el SPA siga siendo “limpio” y reconocible, tengo un mapa de títulos, por ejemplo algo así como:

const TITULOS = {
  inventario: "Inventario",
  registro: "Registro",
  recepcion: "Recepción",
  resumen: "Resumen de pedidos",
  // ...
};


De esta forma, cuando se cambia de página (se carga dinámicamente el HTML correspondiente), también se actualiza el <h2> del header con el título adecuado.

Carga dinámica de páginas (SPA):
El routing carga el contenido de cada página sin recargar el navegador completo, usando fetch del HTML parcial y luego ejecutando el init... correspondiente según la sección:

if (page === "inventario") initAlmacen();
if (page === "registro")   initRegistro();
// ...


Control por rol de usuario:
Algunas páginas están restringidas.
Se comprueba el rol del usuario guardado en sessionStorage.
Si el rol es alumno, hay páginas a las que no se permite el acceso:


Mi nav está hecho con <details>
Cuando se hace clic en un enlace de navegación y la pantalla es pequeña, el <details> se cierra automáticamente, para que el menú no se quede abierto encima del contenido.


3. Inventario:

Esta parte sigue la estructura general explicada en clase:

Carga inicial de productos desde economatoservice.js con getProductos().

Carga de categorías con getCategorias() y pintado en los <select>.

Uso de utilidades de funciones.js:

filtrarPorCategoria

buscarProducto

ordenarPorPrecio

comprobarStockMinimo

inventarioui.js se encarga de:

renderizarTabla: pintar la tabla de productos en el DOM.

mostrarCategorias: rellenar el select de categorías.

No destaco nada más aquí porque es básicamente el estándar de lo visto en clase aplicado al contexto del economato.


4. Recepción de mercancía:

La página de recepción gestiona la entrada de productos al almacén a través de albaranes.

En esta parte:

Se importan las funciones necesarias para:

leer productos,

crear albaranes,

actualizar stock,

etc...

En el controller de recepción se le da focus automático al campo de código de barras al cargar la página:

Esto permite que el flujo natural sea: escanear código → enter → auto-rellenar.

Si se reconoce el código de barras:

Se autorrellenan los datos del producto en el formulario (nombre, precio, etc.).

Se pueden introducir cantidades recibidas y completar el albarán.

Si no se reconoce el código:

La página de recepción avisa de que el producto no está registrado.

Invita a ir primero al registro de productos para darlo de alta en inventario.

Yo había hecho todo esto de la recepción sin tener en cuenta lo de que estuvieran relacionado con los pedidos, y entonces, pues ya no tiene sentido, pero bueno ahí está funcionando pero no vale de nada.


5. Página de registro (productos, proveedores, categorías, usuarios):

La página tiene varias pestañas:

Registrar producto

Registrar proveedor

Registrar categoría

Registrar usuario

Activación de secciones por pestañas

En el controller (registroController.js):

Cada botón tiene un data-target y al hacer click:

Se desactiva la pestaña anterior,

Se activa la nueva,

Y se muestra solo la sección correspondiente (.registro-section).

Registro de productos

Validaciones varias (código de barras, precio, stock, unidad, categoría, proveedor…).

Construcción del objeto nuevoProducto con:

categoriaId y proveedorId (tratados como string porque los ids aveces se crean con letras y eso me volvió loco)

alergenos recogidos de checkboxes.

Información adicional como descripción, fecha caducidad, imagen, etc.

Autocompletado con una API externa (Open Food Facts):

Dado un código de barras, si existe en la API:

se rellena el nombre,

la marca,

la imagen,

y los alérgenos.

Registro de proveedor y categoría

Formularios sencillos para crear nuevos proveedores y categorías.

Una vez creados:

se añaden dinámicamente al <select> correspondiente (para usarlos inmediatamente en el registro de productos),

y se guardan en el array local.

Registro de usuario

Formulario con:

username, password, rol, nombre, apellidos, email, teléfono…

Validaciones básicas de campos obligatorios.

Envío a la API con crearUsuario.

Aunque después se matizó el tema de que las recepciones deberían venir siempre de un pedido, esta página de registro sigue siendo útil como entrada manual de datos iniciales al sistema.


6. Pedidos de profesores:

En la página de pedidos de profesores se crean los pedidos que cada profesor realiza al economato.

Las ideas clave de esta parte:

Se pueden buscar productos para añadirlos a la línea de pedido.

El controlador permite:

añadir productos existentes desde la base de datos,

o añadir productos que no están todavía en la base.

De aquí salen los pedidos que luego se verán en la parte de resumen y recepción.


7. Resumen de pedidos por profesor y por proveedor:

7.1. Cargar pedidos pendientes y mostrarlos por profesor

En initResumenPedidos (controller):

Se hace un Promise.all para cargar:

productos

pedidosProfesores

Se filtran solo los pedidos con estado === "pendiente".

Se llama a pintarTablaPedidosProfesoresUI pasando:

los pedidos pendientes,

la lista de productos,

y la función calcularImportePedido.

En la UI (pintarTablaPedidosProfesoresUI):

Se recorre cada pedido y se pinta una fila con:

ID,

profesor,

fecha,

importe total (calculado sumando líneas × precio),

y el detalle de productos y cantidades.

7.2. Agrupar los pedidos por proveedor

Para cada línea de cada pedido:

Busca qué producto es (según su código o id).

Mira qué proveedor tiene asignado ese producto.

Y va metiendo esa información en un objeto/estructura agrupada por proveedorId.

El resultado es una estructura que, para cada proveedor, tiene:

proveedorId

nombreProveedor

productos:
lista de productos con:

nombreProducto

cantidadTotal (sumando lo que han pedido todos los profesores)

lineasPorProfesor (para saber quién ha pedido cuánto)

Además:

Si grupo.proveedorId === "LIBRE" || grupo.proveedorId == null:

Se muestra un botón que lleva a la página de Registro para dar de alta esos productos en inventario.

Si el proveedor es normal:

Se muestra un botón de “Marcar pedidos de este proveedor como recibidos”.

7.3. Marcar proveedor como recibido (creación de albarán + actualización de stock)

Cuando el usuario pulsa el botón “Marcar pedidos de este proveedor como recibidos”:

Se pide por prompt:

número de albarán,

incidencias (opcional).

Se llama a una función tipo procesarRecepcionDeProveedor que:

crea un albarán con esos datos (crearAlbaran),

marca los pedidos correspondientes como recibidos (actualizarEstadoPedido),

y actualiza el stock de los productos (incrementarStockPorCodigo).

De esta forma, la pantalla de resumen no es solo informativa, sino que cierra el ciclo:

profesor hace pedidos →
resumen agrupa por proveedor →
economato marca “recibido” →
stock se actualiza →
pedidos pasan a estado recibido.


8. Por terminar más páginas, como las de baja de productos o escandallo, o logs o historal de pedidos y albaranes,... y mucho márgen de mejora para lo que ya hay.