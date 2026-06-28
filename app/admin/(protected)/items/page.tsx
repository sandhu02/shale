import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

async function getItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`);
  const { data } = await res.json();
  return data;
}

export default async function AdminItems() {
  const items = await getItems();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Items</h1>
        <Link href="/admin/items/new" className={styles.addBtn}>
          + Add New Item
        </Link>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item : any) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>Rs.{item.price.toLocaleString()}</td>
                <td>{item.stock}</td>
                <td>
                  <span className={item.stock ? styles.inStock : styles.outStock}>
                    {item.stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/items/${item._id}/edit`} className={styles.editLink}>
                    Edit
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