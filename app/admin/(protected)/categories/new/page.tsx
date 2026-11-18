'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import styles from './page.module.css';

export default function AddCategory() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [sub, setSub] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sub, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create category');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/admin/categories" className={styles.backLink}>
        <FaArrowLeft />
        <span>Back to Categories</span>
      </Link>

      <div className={styles.header}>
        <h1>Add New Category</h1>
        <p className={styles.subtitle}>
          Create a new category to group and organize products in your store.
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">
              Category Name <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Footwear, Men's Clothing, Accessories"
              required
            />
            <span className={styles.hint}>
              The public name displayed in store navigation and filter menus
            </span>
          </div>

          <div className={styles.field}>
            <label htmlFor="sub">
              Sub Category <span className={styles.optional}>(Optional)</span>
            </label>
            <input
              id="sub"
              placeholder="e.g. Running & Jogging, Casual, Formal"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
            />
            <span className={styles.hint}>
              Optional secondary classification for items under this category
            </span>
          </div>

          <div className={styles.field}>
            <label htmlFor="description">
              Description <span className={styles.optional}>(Optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief summary of items in this category..."
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Category...' : 'Create Category'}
            </button>
            <Link href="/admin/categories" className={styles.cancelBtn}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
