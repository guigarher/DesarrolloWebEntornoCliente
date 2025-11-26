

 export const ROUTER = {
  async route(page) {
  try {
        // Cargamos el HTML de forma dinámica con fetch
        const response = await fetch(`../../pages/${page}.html`);
        if (!response.ok) 
          throw new Error("Página no encontrada");

        const html = await response.text();
        const fragment = document.createRange().createContextualFragment(html);

        content.textContent = "";
        content.appendChild(fragment);

        // Cargamos el controlador dinámicamente con nuestra convención de nombres *.Controller.js para controladores 
        // así no lo añado arriba a pelo y ven otra forma de cargarlo ...
        const controllerPath = `../controllers/${page}Controller.js`;

        try {
          // Añadimos dinamicamente mediante import el modulo JS que controla esa interfaz. 
          // No valdría hacerlo con fetch (ver diferencias en clase)
          const module = await import(`${controllerPath}`);


          // Ejecutar el metodo default() o inicializar() de nuestro Controller ... 
          // podemos establecer convención de nombres para inicializar nuestros controladores
          // ver con el Debugger como inicializar aparece como una propiedad del modulo exportado y podemos chequear su existencia
          
          if (module && module.inicializar) {
            await module.inicializar();
          }
        } catch (err) {
          console.warn(`No se encontró controlador para ${page}`);
        }


      } catch (error) {        
        throw new Error(error.message);
      }
    }
 }
