'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { FaImage } from 'react-icons/fa';
import styles from './page.module.css';

type Item = {
  _id: string;
  name: string;
  category: { _id?: string; name?: string } | string;
  price: number;
  stock: number;
  inStock?: boolean;
  images?: string[];
  discount?: number;
};

export default function AdminItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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

  const getCategoryName = (cat: Item['category']) => {
    if (typeof cat === 'object' && cat !== null) {
      return cat.name || 'Unassigned';
    }
    return cat || 'Unassigned';
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      const name = getCategoryName(item.category);
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryName(item.category).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === 'ALL' || getCategoryName(item.category) === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Items Inventory</h1>
          <p className={styles.subtext}>Manage, view, edit and track store products</p>
        </div>
        <Link href="/admin/items/new" className={styles.addBtn}>
          + Add New Item
        </Link>
      </div>

      {error ? <div className={styles.errorMessage}>{error}</div> : null}

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search items by name or category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={styles.clearSearch}
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="ALL">All Categories ({items.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading items…</p>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      <div className={styles.emptyState}>
                        <p>No items found matching your filters.</p>
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCategory('ALL');
                            }}
                            className={styles.resetBtn}
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const categoryName = getCategoryName(item.category);
                    const isAvailable = Boolean(item.stock && item.stock > 0);
                    return (
                      <tr key={item._id}>
                        <td className={styles.imgCell}>
                          <div className={styles.itemThumb}>
                            {item.images && item.images.length > 0 ? (
                              <img src={item.images[0]} alt={item.name} />
                            ) : (
                              <FaImage className={styles.thumbPlaceholderIcon} />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={styles.nameBlock}>
                            <Link href={`/admin/items/${item._id}`} className={styles.itemName}>
                              {item.name}
                            </Link>
                            {item.discount && item.discount > 0 ? (
                              <span className={styles.discountBadge}>-{item.discount}%</span>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <span className={styles.categoryTag}>{categoryName}</span>
                        </td>
                        <td>
                          <div className={styles.priceCol}>
                            <span className={styles.priceMain}>
                              Rs.{item.price.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.stockQty}>{item.stock ?? 0}</span>
                        </td>
                        <td>
                          <span className={isAvailable ? styles.inStock : styles.outStock}>
                            {isAvailable ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className={styles.actionGroup}>
                            <Link
                              href={`/admin/items/${item._id}`}
                              className={styles.viewLink}
                              title="View item details"
                            >
                              View
                            </Link>
                            <Link
                              href={`/admin/items/${item._id}/edit`}
                              className={styles.editLink}
                              title="Edit item"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              className={styles.deleteLink}
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item._id}
                              title="Delete item"
                            >
                              {deletingId === item._id ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.tableFooter}>
            <span>Showing {filteredItems.length} of {items.length} items</span>
          </div>
        </div>
      )}
    </div>
  );
}
