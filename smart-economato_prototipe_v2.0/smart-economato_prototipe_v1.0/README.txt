Smart Economato - Prototipo
Autor: Tanausú Castrillo Estévez
Módulo: Desarrollo Web Entorno Cliente
Año: 25/26




Descripción:
Este proyecto consiste en una aplicación web que permite visualizar y gestionar un inventario de productos alimenticios procedentes del almacén de
productos del CIFP Vigen de Candelaria.
El objetivo es reforzar las competencias en JavaScript moderno, el uso de módulos ES6, la manipulación del DOM, los eventos y las funciones puras.

Estructura del proyecto:
index.html: contiene la interfaz y estructura principal de la aplicación.
almacen.js: gestiona los eventos, el DOM y la lógica de interacción.
funciones.js: define las funciones puras que procesan los datos.
productos.js: contiene los datos del inventario de productos.
README.txt: documentación básica del proyecto.

Objetivos didácticos que nos planteamos:
- Trabajar con arrays y objetos complejos.
- Separar la lógica de la interfaz mediante módulos.
- Practicar la manipulación del DOM.
- Aprender a capturar eventos y responder dinámicamente.
- Introducir buenas prácticas de documentación (JSDoc).
- Usar el depurador de VSCode para comprender el flujo del programa.

Normas de uso:

- Con lo visto en clase no necitamos incorporar ChatGPT para nada.

Ejecución esperada de nuesto proyecto:
1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Instalar y ejecutar la extensión Live Server.
3. Ejecutar el proyecto desde index.html.
4. Interactuar con la interfaz: buscar, filtrar, ordenar, comprobar stock y mostrar todos los productos.

Generación de documentación con JSDoc:
1. Node.js me han confirmado que está desplegado en los equipos del entorno Medusa, por lo que no es necesario instalarlo manualmente.
2. Abrir una terminal en la carpeta del proyecto.
3. Instalar JSDoc de manera global con el siguiente comando:
   npm install -g jsdoc
4. Generar la documentación ejecutando:
   jsdoc . -r -d docs
   Este comando analiza todos los archivos JavaScript del proyecto y genera una carpeta llamada docs con la documentación en formato HTML.
5. Abrir el archivo docs/index.html en el navegador para consultar la documentación generada.
6. Si se desea actualizar la documentación tras cambios en el código, repetir el comando anterior.

