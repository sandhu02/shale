import styles from './page.module.css';
import { cookies } from 'next/headers';


// Alternative: Fetch all data in parallel for better performance
async function getAllStats() {
  const cookieStore = await cookies();
  
  try {
    const [itemsRes, categoriesRes, ordersRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, { 
        cache: 'no-store',
        headers: {
          Cookie: cookieStore.toString(),
        },
      }),
    ]);

    const items = itemsRes.ok ? (await itemsRes.json()).data || [] : [];
    const categories = categoriesRes.ok ? (await categoriesRes.json()).data || [] : [];
    const orders = ordersRes.ok ? (await ordersRes.json()).data || [] : [];


    return {
      itemCount: items.length,
      categoryCount: categories.length,
      orderCount: orders.length,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      itemCount: 0,
      categoryCount: 0,
      orderCount: 0,
    };
  }
}
export default async function AdminDashboard() {
  
  const stats = await getAllStats();

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.itemCount}</span>
          <span className={styles.statLabel}>Total Items</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.categoryCount}</span>
          <span className={styles.statLabel}>Total Categories</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.orderCount}</span>
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