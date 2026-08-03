import Link from 'next/link';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span>Admin</span>
      </div>
      <div className={styles.brand}>
        Executive Super Store
      </div>
      <nav>
        <Link href="/admin/home">Customer Home</Link>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/items">Items</Link>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/logout">Logout</Link>
      </nav>
    </aside>
  );
}