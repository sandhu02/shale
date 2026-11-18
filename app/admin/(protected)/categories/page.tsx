'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface CategoryItem {
  _id: string;
  name: string;
  sub?: string;
  description?: string;
  itemCount?: number;
}

interface RawItem {
  _id: string;
  category?: { name?: string } | string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to load categories');
        const { data } = await res.json();

        const itemsRes = await fetch('/api/items');
        const itemsData: RawItem[] = itemsRes.ok ? (await itemsRes.json()).data || [] : [];

        const counts: Record<string, number> = {};
        itemsData.forEach((item) => {
          const catName = typeof item.category === 'object' && item.category !== null ? item.category.name : item.category;
          if (catName) {
            counts[catName] = (counts[catName] || 0) + 1;
          }
        });

        const listWithCounts: CategoryItem[] = (data || []).map((cat: CategoryItem) => ({
          ...cat,
          itemCount: counts[cat.name] || 0,
        }));

        if (isMounted) {
          setCategories(listWithCounts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load categories');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (cat: CategoryItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete category "${cat.name}"? Products in this category may be affected.`
    );
    if (!confirmed) return;

    setDeletingId(cat._id);
    try {
      const res = await fetch(`/api/categories/${cat._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      setCategories((prev) => prev.filter((item) => item._id !== cat._id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting category');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.sub && c.sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Categories</h1>
          <p className={styles.subtext}>Manage store categories and product groupings</p>
        </div>
        <Link href="/admin/categories/new" className={styles.addBtn}>
          + Add New Category
        </Link>
      </div>

      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Filter categories…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading categories…</p>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Sub Categories</th>
                  <th>Products Count</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyCell}>
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        <span className={styles.catName}>{cat.name}</span>
                        {cat.description && (
                          <span className={styles.catDesc}>{cat.description}</span>
                        )}
                      </td>
                      <td>
                        <span className={styles.catSub}>{cat.sub || '—'}</span>
                      </td>
                      <td>
                        <span className={styles.badge}>{cat.itemCount || 0} items</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className={styles.actionGroup}>
                          <Link
                            href={`/categories/${encodeURIComponent(cat.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewLink}
                            title="View category page in store"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/categories/${cat._id}/edit`}
                            className={styles.editLink}
                            title="Edit category"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className={styles.deleteLink}
                            onClick={() => handleDelete(cat)}
                            disabled={deletingId === cat._id}
                            title="Delete category"
                          >
                            {deletingId === cat._id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.tableFooter}>
            <span>Showing {filtered.length} of {categories.length} categories</span>
          </div>
        </div>
      )}
    </div>
  );
}
