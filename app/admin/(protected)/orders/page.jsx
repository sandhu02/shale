import Link from 'next/link';
import styles from './page.module.css';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getOrders() {
  try {
    const cookieStore = await cookies();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
      cache: 'no-store',
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    if (!res.ok) return [];
    const { data } = await res.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export default async function AdminOrders() {
  const orders = await getOrders();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Orders</h1>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customer?.name || 'Customer'}</td>
                  <td>Rs.{order.total?.toLocaleString() || 0}</td>
                  <td>
                    <span className={styles[order.status] || styles.pending}>
                      {(order.status || 'pending').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={styles[order.paymentStatus] || styles.pending}>
                      {(order.paymentStatus || 'pending').toUpperCase()}
                    </span>
                  </td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <Link href={`/admin/orders/${order._id}`} className={styles.viewBtn}>
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
