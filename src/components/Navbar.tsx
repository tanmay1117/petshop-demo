'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, cart, setIsCartOpen, theme, toggleTheme } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = cart.reduce((total, item) => total + item.cartQuantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container container">
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">🐾</span>
            <span className="logo-text">Petshop Demo</span>
          </Link>

          <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            <div className="navbar-actions">
              <button
                className="nav-icon-btn search-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                🔍
              </button>

              <button
                className="nav-icon-btn theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <button
                className="nav-icon-btn cart-btn"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                🛒
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </button>

              {user?.role === 'admin' && (
                <Link href="/erp" className="nav-admin-btn">
                  📊 Dashboard
                </Link>
              )}

              {user ? (
                <div className="user-menu">
                  <button className="user-avatar-btn">
                    {user.image ? (
                      <img src={user.image} alt="" className="user-avatar-img" />
                    ) : (
                      <span className="user-avatar-placeholder">
                        {(user.name || user.email || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </button>
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <span className="user-dropdown-name">{user.name || user.email}</span>
                      <span className="user-dropdown-role badge badge-primary">{user.role}</span>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    {user.role === 'admin' && (
                      <Link href="/erp" className="user-dropdown-item">📊 Dashboard</Link>
                    )}
                    <Link href="/orders" className="user-dropdown-item">📦 My Orders</Link>
                    <button onClick={logout} className="user-dropdown-item user-dropdown-logout">🚪 Sign Out</button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="nav-auth-btn">Sign In</Link>
              )}
            </div>
          </div>

          <button
            className={`hamburger ${mobileOpen ? 'hamburger-open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {searchOpen && (
          <div className="search-overlay" onClick={() => setSearchOpen(false)}>
            <div className="search-bar" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
              <button onClick={() => setSearchOpen(false)} className="search-close">✕</button>
            </div>
          </div>
        )}
      </nav>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
