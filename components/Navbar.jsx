'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { FaChevronDown, FaThLarge } from 'react-icons/fa';

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();

  const toggleMega = () => setIsMegaOpen((prev) => !prev);

  // Fetch categories on client side
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`/api/categories`, {
          cache: 'no-store',
        });
        const { data } = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    void fetchCategories();
  }, []);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMegaOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Show first 4 categories directly, and rest in MORE (or if >4)
  const MAX_VISIBLE = 4;
  const visibleCategories = categories.slice(0, MAX_VISIBLE);
  const overflowCategories = categories.slice(MAX_VISIBLE);
  const hasOverflow = overflowCategories.length > 0;

  const isHomeActive = pathname === '/';

  return (
    <nav className={styles.nav} ref={navRef} aria-label="Main Navigation">
      <div className={`container ${styles.inner}`}>
        <ul className={styles.links}>
          <li>
            <Link
              href="/"
              className={`${styles.navLink} ${isHomeActive ? styles.activeLink : ''}`}
            >
              All Products
            </Link>
          </li>

          {visibleCategories.map((cat) => {
            const catHref = `/categories/${encodeURIComponent(cat.name)}`;
            const isActive = decodeURIComponent(pathname) === catHref;
            return (
              <li key={cat._id || cat.name}>
                <Link
                  href={catHref}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                >
                  {cat.name}
                </Link>
              </li>
            );
          })}

          {hasOverflow && (
            <li className={styles.moreItem}>
              <button
                type="button"
                className={`${styles.moreTrigger} ${isMegaOpen ? styles.active : ''}`}
                onClick={toggleMega}
                aria-expanded={isMegaOpen}
                aria-haspopup="true"
              >
                More <FaChevronDown className={styles.arrow} />
              </button>

              {isMegaOpen && (
                <div className={`${styles.megaMenu} ${styles.open}`}>
                  <div className={styles.megaHeader}>
                    <FaThLarge className={styles.megaIcon} />
                    <span>More Categories</span>
                  </div>
                  <div className={styles.megaGrid}>
                    {overflowCategories.map((cat) => {
                      const catHref = `/categories/${encodeURIComponent(cat.name)}`;
                      const isActive = decodeURIComponent(pathname) === catHref;
                      return (
                        <Link
                          key={cat._id || cat.name}
                          href={catHref}
                          className={`${styles.categoryItem} ${isActive ? styles.activeCategoryItem : ''}`}
                          onClick={() => setIsMegaOpen(false)}
                        >
                          <span className={styles.catName}>{cat.name}</span>
                          {cat.sub ? (
                            <span className={styles.catSub}>{cat.sub}</span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
