'use client';

import Link from 'next/link';
import styles from './ProductGrid.module.css';
import ProductCard from './product/ProductCard';

export default function ProductGrid({
  products = [],
  header = 'Products',
  subHeader,
  showViewAll = false,
  viewAllHref = '/',
  onClearFilter,
}) {
  const count = products.length;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <span>{header}</span>
            <span className={styles.countBadge}>({count})</span>
          </h3>
          {subHeader ? <p className={styles.subHeader}>{subHeader}</p> : null}
        </div>

        {showViewAll && (
          <Link href={viewAllHref} className={styles.viewAll}>
            View All →
          </Link>
        )}
      </div>

      {count === 0 ? (
        <div className={styles.emptyWrap}>
          <span className={styles.emptyEmoji}>🔍</span>
          <h4>No products found</h4>
          <p>We couldn&apos;t find any products matching your criteria.</p>
          {onClearFilter ? (
            <button
              type="button"
              onClick={onClearFilter}
              className={styles.resetBtn}
            >
              Clear Filters
            </button>
          ) : (
            <Link href="/" className={styles.resetBtn}>
              Browse All Products
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
