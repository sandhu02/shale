'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminSidebar.module.css';
import {
  FaStore,
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaShoppingBag,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaExternalLinkAlt,
} from 'react-icons/fa';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { href: '/admin/items', label: 'Items', icon: <FaBoxOpen /> },
    { href: '/admin/categories', label: 'Categories', icon: <FaTags /> },
    { href: '/admin/orders', label: 'Orders', icon: <FaShoppingBag /> },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={styles.mobileBar}>
        <div className={styles.mobileBrand}>
          <FaStore className={styles.brandIcon} />
          <span>Admin Panel</span>
        </div>
        <button
          className={styles.toggleBtn}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar Overlay on mobile */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.brandHeader}>
            <div className={styles.logoBadge}>
              <FaStore />
            </div>
            <div>
              <h2 className={styles.brandTitle}>Executive</h2>
              <span className={styles.brandSub}>Admin Control</span>
            </div>
          </div>
        </div>

        <div className={styles.sectionTitle}>Main Menu</div>

        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                <span className={styles.navLabel}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeLink}
            onClick={() => setMobileOpen(false)}
          >
            <span className={styles.navIcon}><FaExternalLinkAlt /></span>
            <span>View Store</span>
          </Link>

          <Link
            href="/admin/logout"
            className={styles.logoutLink}
            onClick={() => setMobileOpen(false)}
          >
            <span className={styles.navIcon}><FaSignOutAlt /></span>
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
