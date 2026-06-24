import styles from './Header.module.css';
import { FaShoePrints, FaEnvelope, FaWhatsapp, FaUserCircle } from 'react-icons/fa';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <FaShoePrints className={styles.logoIcon} />
          <h1>Bata<span>.</span></h1>
        </div>
        <div className={styles.contact}>
          <a href="mailto:customercare.pk@bata.com">
            <FaEnvelope className={styles.icon} />
            customercare.pk@bata.com
          </a>
          <a href="https://wa.me/9232761261" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className={styles.icon} />
            042-32761261
          </a>
          <a href="#">
            <FaUserCircle className={styles.userIcon} />
            Login
          </a>
        </div>
      </div>
    </header>
  );
}