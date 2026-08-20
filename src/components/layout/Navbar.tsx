import { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_ROUTES } from '../../data/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={`container ${styles.navInner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="LAYER LAB home">
          <span className={styles.statusDot} aria-hidden="true" />
          <span>LAYER</span>
          <span className={styles.logoSlash} aria-hidden="true">//</span>
          <span>LAB</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {NAV_ROUTES.map(route => (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.caseNum}>{route.caseNumber}</span>
              {route.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={toggleMobile}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}
        role="menu"
      >
        {NAV_ROUTES.map(route => (
          <NavLink
            key={route.path}
            to={route.path}
            end={route.path === '/'}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
            }
            role="menuitem"
            onClick={() => setMobileOpen(false)}
          >
            <span className={styles.mobileNavLabel}>
              <span className={styles.mobileCaseNum}>{route.caseNumber}</span>
              {route.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
