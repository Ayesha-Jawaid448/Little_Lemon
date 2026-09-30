import { Link, NavLink } from 'react-router-dom';
import LemonSlice from './LemonSlice';

export default function Header() {
  return (
    <header className="site-header on-dark">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Little Lemon, go to home page">
          <LemonSlice className="brand-mark" />
          <span className="brand-name">Little Lemon</span>
        </Link>

        <nav aria-label="Main">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <Link to="/#about">About</Link>
            </li>
            <li>
              <Link to="/#specials">Menu</Link>
            </li>
            <li>
              <NavLink to="/booking">Reservations</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
