import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "nav-link",
    "px-3 py-2",
    isActive
      ? "fw-semibold bg-white border-start border-4 border-primary text-dark"
      : "text-muted",
  ].join(" ");

export default function LeftNav() {
  return (
    <Nav className="flex-column py-2 m-1">
      <NavLink to="/" end className={linkClass}>
        Inicio
      </NavLink>

      <NavLink to="/products" end className={linkClass}>
        Productos
      </NavLink>

      <NavLink to="/orders" end className={linkClass}>
        Pedidos
      </NavLink>

      <NavLink to="/users" className={linkClass}>
        Usuarios
      </NavLink>

      <NavLink to="/settings" className={linkClass}>
        Ajustes
      </NavLink>
    </Nav>
  );
}
