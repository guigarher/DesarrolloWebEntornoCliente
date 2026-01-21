import { useState } from "react";

// Tipo de datos para un enlace del menú de navegación
type NavItem = {
  id: string;
  label: string;
  href: string;
};

// Props del componente NavLinkItem:
// - item: datos del enlace
// - isActive: indica si el enlace está activo
// - setActiveHref: función para marcar este enlace como activo al hacer click
type NavLinkItemProps = {
  item: NavItem;
  isActive: boolean;
  onClick: (href: string) => void;
};

// Componente que pinta un solo enlace del menú
function NavLinkItem({ item, isActive, onClick }: NavLinkItemProps) {
  // Según si el enlace está activo o no, aplicamos distintas clases de Bootstrap
  const className = isActive
    ? "nav-link fw-semibold text-primary"
    : "nav-link text-secondary";

  return (
    <li className="nav-item">
      <a
        className={className}
        href={item.href}
        onClick={() => onClick(item.href)}
      >
        {item.label}
      </a>
    </li>
  );
}

// Props del componente Navbar (barra de navegación completa)
type NavbarProps = {
  brand: string;
  items: NavItem[];
  defaultActiveHref?: string;
};

// Componente Navbar que renderiza la barra de navegación completa
export default function Navbar({
  brand,
  items,
  defaultActiveHref = "#inicio",
}: NavbarProps) {
  // Estado que guarda el href del enlace activo
  // Se inicializa con el hash de la URL si existe, o con el valor por defecto
  const [activeHref, setActiveHref] = useState<string>(
    window.location.hash || defaultActiveHref,
  );

  return (
    <nav className="navbar navbar-expand bg-dark-subtle navbar-dark rounded-3">
      <div className="container">
        <span className="navbar-brand">{brand}</span>

        <ul className="navbar-nav">
          {items.map((item) => (
            <NavLinkItem
              key={item.id}
              item={item}
              isActive={item.href === activeHref}
              onClick={setActiveHref}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}
