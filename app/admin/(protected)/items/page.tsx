'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

type Item = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export default function AdminItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch('/api/items');
        if (!res.ok) throw new Error('Failed to load items');

        const { data } = await res.json();
        setItems(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load items');
      } finally {
        setLoading(false);
      }
    }

    void loadItems();
  }, []);

  const handleDelete = async (item: Item) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${item.name}"?`);
    if (!confirmed) return;

    setDeletingId(item._id);

    try {
      const res = await fetch(`/api/items/${item._id}`, { method: 'DELETE' });
      const payload = await res.json();

      if (!res.ok) throw new Error(payload.error || 'Failed to delete item');

      setItems((currentItems) => currentItems.filter((currentItem) => currentItem._id !== item._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Items</h1>
        <Link href="/admin/items/new" className={styles.addBtn}>
          + Add New Item
        </Link>
      </div>

      {error ? <p>{error}</p> : null}

      {loading ? (
        <p>Loading items...</p>
      ) : (
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
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6}>No items found.</td>
                </tr>
              ) : (
                items.map((item) => (
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
                      {' / '}
                      <button
                        type="button"
                        className={styles.deleteLink}
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item._id}
                      >
                        {deletingId === item._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}