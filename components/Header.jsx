'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { FaStore, FaEnvelope, FaWhatsapp, FaShoppingCart } from 'react-icons/fa';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Executive Super Store Home">
          <span className={styles.logoBadge}>
            <FaStore className={styles.logoIcon} />
          </span>
          <h1>
            Executive Super Store<span>.</span>
          </h1>
        </Link>

        <div className={styles.contact}>
          <a
            href="mailto:excecutivesuperstore@gmail.com"
            className={styles.contactLink}
            title="Email us"
          >
            <FaEnvelope className={styles.icon} />
            <span className={styles.contactText}>excecutivesuperstore@gmail.com</span>
          </a>

          <a
            href="https://wa.me/923485711047"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
            title="WhatsApp us"
          >
            <FaWhatsapp className={`${styles.icon} ${styles.whatsappIcon}`} />
            <span className={styles.contactText}>+92 348 5711047</span>
          </a>

          <Link href="/cart" className={styles.cartLink} title="Shopping Cart">
            <div className={styles.cartIconWrapper}>
              <FaShoppingCart className={styles.cartIcon} />
              {totalItems > 0 && (
                <span className={styles.cartBadge} aria-label={`${totalItems} items in cart`}>
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </div>
            <span className={styles.cartLabel}>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
