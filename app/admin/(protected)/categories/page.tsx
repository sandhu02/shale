import Link from 'next/link';
import styles from './page.module.css';

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: 'no-store',
  });
  const { data } = await res.json();
  return data;
}

export default async function AdminCategories() {
  const categories = await getCategories();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Categories</h1>
        <Link href="/admin/categories/new" className={styles.addBtn}>
          + Add New Category
        </Link>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Sub</th>
              <th>Items</th>
              <th>Icon</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.sub}</td>
                <td>2</td>
                <td>{cat.icon}</td>
                <td>
                  <Link href={`/admin/categories/${cat._id}/edit`} className={styles.editLink}>
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