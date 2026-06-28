'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';


export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const navRef = useRef(null);
  const [loading, setLoading] = useState(false);


  const toggleMega = () => setIsMegaOpen((prev) => !prev);


  // Fetch categories on client side
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
          cache: 'no-store',
        });
        const { data } = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
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

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={`container ${styles.inner}`}>
        <ul className={styles.links}>
          {categories.map((cat, idx) => (
            <li key={idx}>
              <Link href={`/categories/${encodeURIComponent(cat.name)}`}>
                {cat.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              className={`${styles.moreTrigger} ${isMegaOpen ? styles.active : ''}`}
              onClick={toggleMega}
            >
              MORE <FaChevronDown className={styles.arrow} />
            </button>
            <div className={`${styles.megaMenu} ${isMegaOpen ? styles.open : ''}`}>
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/categories/${encodeURIComponent(cat.name)}`}
                  className={styles.categoryItem}
                  onClick={() => setIsMegaOpen(false)}
                >
                  <span className={styles.catIcon}>{cat.icon}</span>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={`${styles.catSub} ${cat.highlight ? styles.highlight : ''}`}>
                    {cat.sub}
                  </span>
                </Link>
              ))}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}