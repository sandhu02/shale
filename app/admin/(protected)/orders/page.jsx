import Link from 'next/link';
import styles from './page.module.css';
import { cookies } from 'next/headers';


async function getOrders() {
  const cookieStore = await cookies();
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
    cache: 'no-store',
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  const {data} = await res.json();
  return data || [];
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
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.customer.name}</td>
                <td>Rs.{order.total.toLocaleString()}</td>
                <td>
                  <span className={styles[order.status]}>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={styles[order.paymentStatus]}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link href={`/admin/orders/${order._id}`} className={styles.viewBtn}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}