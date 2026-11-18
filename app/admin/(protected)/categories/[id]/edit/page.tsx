'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import styles from '../../new/page.module.css';

export default function EditCategory() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [sub, setSub] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) throw new Error('Failed to fetch category');
        const response = await res.json();

        const data = response.data;

        setName(data.name || '');
        setSub(data.sub || '');
        setDescription(data.description || '');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sub, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update category');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading category...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/admin/categories" className={styles.backLink}>
        <FaArrowLeft />
        <span>Back to Categories</span>
      </Link>

      <div className={styles.header}>
        <h1>Edit Category</h1>
        <p className={styles.subtitle}>
          Update category details and sub-classifications.
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
              required
            />
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
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Changes'}
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
