import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

const navItems = [
  { label: 'AI Chat', to: '/chat' },
  { label: 'Cyber Laws', to: '/docs' },
  { label: 'About', to: '/about' },
  { label: 'Terms & Conditions', to: '/legal' },
  { label: 'Contact', to: '/contact' }
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  /* Close mobile menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/chat" className="brand" aria-label="Sudarshan AI — Home">
          <img src="/src/assets/branding/favicon-32x32.png" alt="" className="brand-logo" aria-hidden="true" width="22" height="22" />
          <span className="brand-name">Sudarshan AI</span>
        </NavLink>

        <nav className="nav-desktop" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="theme-toggle-container">
          <ThemeToggle />
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <nav
        className={`nav-mobile ${menuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-mobile-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Header;
