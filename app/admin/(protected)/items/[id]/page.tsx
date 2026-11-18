'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

interface ItemDetails {
  _id: string;
  name: string;
  category: { _id?: string; name?: string } | string;
  description?: string;
  price: number;
  discount?: number;
  stock?: number;
  inStock?: boolean;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminItemView() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchItem() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) throw new Error('Item not found');
        const data = await res.json();
        setItem(data.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load item');
      } finally {
        setLoading(false);
      }
    }
    void fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner} />
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <h2>Item Not Found</h2>
          <p>{error || 'The requested item could not be found.'}</p>
          <Link href="/admin/items" className={styles.backBtn}>
            ← Back to Items
          </Link>
        </div>
      </div>
    );
  }

  const categoryName =
    typeof item.category === 'object' && item.category !== null
      ? item.category.name || 'Unassigned'
      : item.category || 'Unassigned';

  const discount = Number(item.discount || 0);
  const discountedPrice = discount > 0 ? Math.floor(item.price - (item.price * discount) / 100) : item.price;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <nav className={styles.breadcrumbs}>
            <Link href="/admin/items">Items</Link> / <span>{item.name}</span>
          </nav>
          <h1>{item.name}</h1>
        </div>
        <div className={styles.headerActions}>
          <a
            href={`/product/${item._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewStoreBtn}
          >
            View in Store ↗
          </a>
          <Link href={`/admin/items/${item._id}/edit`} className={styles.editBtn}>
            Edit Item
          </Link>
          <Link href="/admin/items" className={styles.cancelBtn}>
            Back to List
          </Link>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Images Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Item Gallery</h2>
          <div className={styles.mainImageWrap}>
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[selectedImage] || item.images[0]}
                alt={item.name}
                className={styles.mainImage}
              />
            ) : (
              <div className={styles.noImage}>No image uploaded</div>
            )}
            {discount > 0 && <span className={styles.discountBadge}>-{discount}% OFF</span>}
          </div>

          {item.images && item.images.length > 1 && (
            <div className={styles.thumbs}>
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.thumbBtn} ${idx === selectedImage ? styles.activeThumb : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Product Information</h2>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Category</span>
              <span className={styles.infoValue}>
                <span className={styles.categoryBadge}>{categoryName}</span>
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Availability</span>
              <span className={styles.infoValue}>
                <span className={item.inStock && (item.stock || 0) > 0 ? styles.inStockBadge : styles.outStockBadge}>
                  {item.inStock && (item.stock || 0) > 0 ? `In Stock (${item.stock} available)` : 'Out of Stock'}
                </span>
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Pricing</span>
              <div className={styles.pricingBlock}>
                <span className={styles.currentPrice}>Rs. {discountedPrice.toLocaleString()}</span>
                {discount > 0 && (
                  <span className={styles.originalPrice}>Rs. {item.price.toLocaleString()}</span>
                )}
              </div>
            </div>

            {item.sizes && item.sizes.length > 0 && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Available Sizes</span>
                <div className={styles.sizeTags}>
                  {item.sizes.map((s) => (
                    <span key={s} className={styles.sizeTag}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.colors && item.colors.length > 0 && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Available Colors</span>
                <div className={styles.colorTags}>
                  {item.colors.map((c) => (
                    <span key={c} className={styles.colorPill} title={c}>
                      <span className={styles.colorDot} style={{ backgroundColor: c.toLowerCase() }} />
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.descRow}>
              <span className={styles.infoLabel}>Description</span>
              <p className={styles.descriptionText}>
                {item.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
