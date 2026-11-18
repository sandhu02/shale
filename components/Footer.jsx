'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { FaStore, FaEnvelope, FaWhatsapp, FaShieldAlt, FaTruck, FaUndo, FaHeadset } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Features Bar */}
      <div className={styles.featuresBar}>
        <div className={`container ${styles.featuresGrid}`}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><FaTruck /></div>
            <div>
              <h4>Fast Delivery</h4>
              <p>Reliable nationwide shipping</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><FaShieldAlt /></div>
            <div>
              <h4>100% Authentic</h4>
              <p>Original & top-quality items</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><FaUndo /></div>
            <div>
              <h4>Easy Exchange</h4>
              <p>Hassle-free 7-day returns</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><FaHeadset /></div>
            <div>
              <h4>24/7 Support</h4>
              <p>Dedicated customer care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className={`container ${styles.main}`}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <FaStore className={styles.brandIcon} />
            <h3>Executive Super Store<span>.</span></h3>
          </div>
          <p className={styles.desc}>
            Your premier destination for high quality shoes, accessories, and daily essentials.
            Offering elegance, comfort, and unmatched value.
          </p>
          <div className={styles.contactDetails}>
            <a href="mailto:excecutivesuperstore@gmail.com" className={styles.contactRow}>
              <FaEnvelope /> excecutivesuperstore@gmail.com
            </a>
            <a href="https://wa.me/923485711047" target="_blank" rel="noopener noreferrer" className={styles.contactRow}>
              <FaWhatsapp /> +92 348 5711047
            </a>
          </div>
        </div>

        <div className={styles.linksCol}>
          <h4>Shop & Explore</h4>
          <ul>
            <li><Link href="/">All Products</Link></li>
            <li><Link href="/cart">Shopping Cart</Link></li>
            <li><Link href="/checkout">Checkout</Link></li>
          </ul>
        </div>

        <div className={styles.linksCol}>
          <h4>Customer Care</h4>
          <ul>
            <li><a href="https://wa.me/923485711047" target="_blank" rel="noopener noreferrer">Order Tracking</a></li>
            <li><a href="https://wa.me/923485711047" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
            <li><a href="https://wa.me/923485711047" target="_blank" rel="noopener noreferrer">Returns & Exchanges</a></li>
          </ul>
        </div>

        <div className={styles.linksCol}>
          <h4>Admin</h4>
          <ul>
            <li><Link href="/admin">Admin Portal</Link></li>
            <li><Link href="/admin/login">Admin Login</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>© {new Date().getFullYear()} Executive Super Store. All rights reserved.</p>
          <div className={styles.paymentMethods}>
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
