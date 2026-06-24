'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import { FaChevronDown } from 'react-icons/fa';

const categories = [
  { icon: '👟', name: 'Sneakers', sub: 'Running & Lifestyle' },
  { icon: '👞', name: 'Formal', sub: 'Oxford & Derby' },
  { icon: '🥾', name: 'Boots', sub: 'Ankle & High-top' },
  { icon: '🩴', name: 'Sandals', sub: 'Casual & Comfort' },
  { icon: '👡', name: 'Heels', sub: 'Pumps & Block' },
  { icon: '🎒', name: 'Bags', sub: 'Backpacks & Totes' },
  { icon: '🧦', name: 'Accessories', sub: 'Socks & Belts' },
  { icon: '⭐', name: 'Bata Club', sub: 'Exclusive', highlight: true },
];

export default function Navbar() {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMega = () => setIsMegaOpen((prev) => !prev);

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
          <li><a href="#">SNEAKER FEST</a></li>
          <li><a href="#">MEN</a></li>
          <li><a href="#">WOMEN</a></li>
          <li><a href="#">KIDS</a></li>
          <li><a href="#">BAGS</a></li>
          <li><a href="#">ACCESSORIES</a></li>
          <li><a href="#" className={styles.sale}>SUPER SALE</a></li>
          <li><a href="#">BATA CLUB</a></li>
          <li><a href="#">TRACK ORDER</a></li>
          <li>
            <button
              className={`${styles.moreTrigger} ${isMegaOpen ? styles.active : ''}`}
              onClick={toggleMega}
            >
              MORE <FaChevronDown className={styles.arrow} />
            </button>
            <div className={`${styles.megaMenu} ${isMegaOpen ? styles.open : ''}`}>
              {categories.map((cat, idx) => (
                <div key={idx} className={styles.categoryItem}>
                  <span className={styles.catIcon}>{cat.icon}</span>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={`${styles.catSub} ${cat.highlight ? styles.highlight : ''}`}>
                    {cat.sub}
                  </span>
                </div>
              ))}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}