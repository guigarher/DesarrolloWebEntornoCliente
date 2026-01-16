//import Titulo from "./components/Titulo"
import Card from "./components/Card";
import { CardBody } from "./components/Card";
import "./App.css";

function App() {
  //Esto es JSX. Parecido al HTML pero con restricciones ---> React.createElement("p","Hola Mundo") babel.js pagina que te traduce este JSX y te enseña lo que esta haciendo REACT que es lo del comentario más o menos
  /*const nombre = "Clase"

  if(nombre){
    return <p>Hola {nombre}!</p>
  }
  return <p>Hola Mundo</p>*/
  //return <Card body="Hola Clase!"></Card>;
  return (
    <Card>
      <CardBody
        title="Titulo de la tarjeta"
        text="Descripción de la tarjeta"
      ></CardBody>
    </Card>
  );
}

export default App;
