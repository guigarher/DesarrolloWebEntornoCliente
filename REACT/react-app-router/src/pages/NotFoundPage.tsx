import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <>
      <h1 className="h3">404</h1>
      <p>Página no encontrada.</p>
      <Link to="/">Volver al inicio</Link>
    </>
  );
}
