function Titulo() {
  //Esto es JSX. Parecido al HTML pero con restricciones ---> React.createElement("p","Hola Mundo") babel.js pagina que te traduce este JSX y te enseña lo que esta haciendo REACT que es lo del comentario más o menos
  const nombre = "Clase";

  if (nombre) {
    return <h1>Hola {nombre}!</h1>;
  }
  return <h1>Hola Mundo</h1>;
}

export default Titulo;
