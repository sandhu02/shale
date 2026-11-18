'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DeleteCategory() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [category, setCategory] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) throw new Error('Category not found');
        const data = await res.json();
        setCategory(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category');
      } finally {
        setLoading(false);
      }
    }
    if (id) void load();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleting(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '600px', margin: '40px auto' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #eee',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
          Delete Category
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: '#c8102e' }}>{error}</p>
        ) : (
          <>
            <p style={{ color: '#555', marginBottom: '24px' }}>
              Are you sure you want to delete category <strong>&quot;{category?.name}&quot;</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  background: '#c8102e',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <Link
                href="/admin/categories"
                style={{
                  background: '#f0f0f0',
                  color: '#333',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Cancel
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
