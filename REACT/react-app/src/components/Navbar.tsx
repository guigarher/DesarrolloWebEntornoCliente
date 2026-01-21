import { useState } from "react";

type NavItem = {
  id: string;
  label: string;
  href: string;
};

type NavbarProps = {
  brand: string;
  items: NavItem[];
  defaultActiveHref?: string;
};

function NavLinkItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: (href: string) => void;
}) {
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

export default function Navbar({
  brand,
  items,
  defaultActiveHref = "#inicio",
}: NavbarProps) {
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
