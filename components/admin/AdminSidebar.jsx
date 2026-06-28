import Link from 'next/link';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span>👟</span> Bata Admin
      </div>
      <nav>
        <Link href="/admin/home">Home</Link>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/items">Items</Link>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/admin/logout">Logout</Link>
      </nav>
    </aside>
  );
}