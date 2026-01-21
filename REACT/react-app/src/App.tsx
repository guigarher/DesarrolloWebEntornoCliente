import Titulo from "./components/Titulo";
import Navbar from "./components/Navbar";
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
  const menu = [
    { id: "home", label: "Inicio", href: "#inicio" },
    { id: "prod", label: "Productos", href: "#productos" },
    { id: "cont", label: "Contacto", href: "#contacto" },
    { id: "inv", label: "Inventario", href: "#inventario" },
  ];

  return (
    <div className="min-vh-100 bg-light m-0 p-0">
      <Titulo texto="Mi primera app en React" />
      <details className="container mt-3">
        <summary className="mb-2">Abrir menú</summary>
        <Navbar brand="Smart-Economato" items={menu} />
      </details>

      <div className="container mt-4">
        <Card>
          <CardBody title="Título de tarjeta" text="Texto de tarjeta en cursiva pues por probar bootstrap" />
        </Card>
      </div>
    </div>
  );
}

export default App;
