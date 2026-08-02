import styles from './Header.module.css';
import { FaStore, FaEnvelope, FaWhatsapp, FaUserCircle, FaShoppingCart  } from 'react-icons/fa';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <FaStore className={styles.logoIcon} />
          <h1>Executive Super Store<span>.</span></h1>
        </div>
        <div className={styles.contact}>
          <a href="mailto:excecutivesuperstore@gmail.com">
            <FaEnvelope className={styles.icon} />
            excecutivesuperstore@gmail.com
          </a>
          <a href="https://wa.me/923485711047" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className={styles.icon} />
            +92 348 5711047
          </a>
          <a href="/cart">
            <FaShoppingCart className={styles.icon} />
            Cart
          </a>
        </div>
      </div>
    </header>
  );
}