import Link from 'next/link';
import styles from './page.module.css';
import { cookies } from 'next/headers';
import { FaBoxOpen, FaTags, FaShoppingBag, FaPlus, FaArrowRight } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

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
      <div className={styles.header}>
        <div>
          <h1>Dashboard Overview</h1>
          <p className={styles.subtext}>Welcome back to Executive Super Store management</p>
        </div>
        <Link href="/" target="_blank" rel="noopener noreferrer" className={styles.viewStoreBtn}>
          View Live Store ↗
        </Link>
      </div>

      {/* Stats Cards */}
      <div className={styles.stats}>
        <Link href="/admin/items" className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#eff6ff', color: '#2563eb' }}>
            <FaBoxOpen />
          </div>
          <div>
            <span className={styles.statNumber}>{stats.itemCount}</span>
            <span className={styles.statLabel}>Total Products</span>
          </div>
        </Link>

        <Link href="/admin/categories" className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#fdf2f8', color: '#db2777' }}>
            <FaTags />
          </div>
          <div>
            <span className={styles.statNumber}>{stats.categoryCount}</span>
            <span className={styles.statLabel}>Categories</span>
          </div>
        </Link>

        <Link href="/admin/orders" className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#ecfdf5', color: '#059669' }}>
            <FaShoppingBag />
          </div>
          <div>
            <span className={styles.statNumber}>{stats.orderCount}</span>
            <span className={styles.statLabel}>Customer Orders</span>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <Link href="/admin/items/new" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <FaPlus />
            </div>
            <div className={styles.actionContent}>
              <strong>Add New Item</strong>
              <span>Create a new product listing</span>
            </div>
            <FaArrowRight className={styles.actionArrow} />
          </Link>

          <Link href="/admin/categories/new" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <FaPlus />
            </div>
            <div className={styles.actionContent}>
              <strong>Add New Category</strong>
              <span>Organize catalog groupings</span>
            </div>
            <FaArrowRight className={styles.actionArrow} />
          </Link>

          <Link href="/admin/items" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <FaBoxOpen />
            </div>
            <div className={styles.actionContent}>
              <strong>Manage Inventory</strong>
              <span>Update prices, stock &amp; details</span>
            </div>
            <FaArrowRight className={styles.actionArrow} />
          </Link>

          <Link href="/admin/orders" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <FaShoppingBag />
            </div>
            <div className={styles.actionContent}>
              <strong>Process Orders</strong>
              <span>View &amp; update order statuses</span>
            </div>
            <FaArrowRight className={styles.actionArrow} />
          </Link>
        </div>
      </div>
    </div>
  );
}
