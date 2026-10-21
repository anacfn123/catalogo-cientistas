import { Link, NavLink } from 'react-router';
import { Marca } from './Decoracao';

const links = [
  { to: '/', texto: 'Início' },
  { to: '/cientistas', texto: 'Cientistas' },
  { to: '/sobre', texto: 'Sobre' },
];

export default function Header() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <Marca /> Mulheres na Ciência
      </Link>

      <nav className="nav-links">
        {links.map(({ to, texto }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => (isActive ? 'ativo' : undefined)}
          >
            {texto}
          </NavLink>
        ))}
        <Link to="/sugerir" className="btn btn-destaque">
          Sugerir cientista
        </Link>
      </nav>
    </header>
  );
}