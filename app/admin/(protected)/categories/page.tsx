import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: 'no-store',
  });
  const { data } = await res.json();

  return data;
}

async function getItemsCount(categoryName: string) {
  try {
    // Use the existing API endpoint for this category
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/items/category/${encodeURIComponent(categoryName)}`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      console.error(`Failed to fetch items for category: ${categoryName}`);
      return 0;
    }
    
    const { data } = await res.json();
    
    // Return the count of items in this category
    return data?.length || 0;
  } catch (error) {
    console.error(`Error fetching items for category ${categoryName}:`, error);
    return 0;
  }
}

export default async function AdminCategories() {
  const categories = await getCategories();

  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat: any) => {
      const itemCount = await getItemsCount(cat.name);
      return {
        ...cat,
        itemCount
      };
    })
  );

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoriesWithCounts.map((cat: any) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.sub}</td>
                <td>{cat.itemCount}</td>
                <td>
                  <Link href={`/admin/categories/${cat._id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                  <> / </>
                  <Link href={`/admin/categories/${cat._id}/delete`} className={styles.editLink}>
                    Delete
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