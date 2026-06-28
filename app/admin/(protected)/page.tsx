import styles from './page.module.css';

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>0</span>
          <span className={styles.statLabel}>Total Items</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>0</span>
          <span className={styles.statLabel}>Total Categories</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>0</span>
          <span className={styles.statLabel}>Orders</span>
        </div>
      </div>
      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <a href="/admin/items/new" className={styles.actionCard}>
            <span>➕</span> Add Item
          </a>
          <a href="/admin/categories/new" className={styles.actionCard}>
            <span>📁</span> Add Category
          </a>
          <a href="/admin/items" className={styles.actionCard}>
            <span>📦</span> Manage Items
          </a>
          <a href="/admin/categories" className={styles.actionCard}>
            <span>🏷️</span> Manage Categories
          </a>
        </div>
      </div>
    </div>
  );
}