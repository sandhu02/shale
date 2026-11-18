'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const {
    _id,
    name,
    category,
    price,
    discount = 0,
    images = [],
    stock,
    inStock = true,
  } = product;

  const categoryName =
    typeof category === 'object' && category !== null
      ? category.name || ''
      : category || '';

  const numDiscount = Number(discount) || 0;
  const discountedPrice = numDiscount > 0
    ? Math.floor(price - (price * numDiscount) / 100)
    : price;

  const hasImage = images && images.length > 0 && typeof images[0] === 'string' && images[0].trim() !== '';
  const isAvailable = inStock && (stock === undefined || stock > 0);

  return (
    <Link href={`/product/${_id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          {numDiscount > 0 && (
            <span className={styles.discountBadge}>-{numDiscount}%</span>
          )}

          {!isAvailable && (
            <span className={styles.outOfStockBadge}>Out of Stock</span>
          )}

          {hasImage ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholderWrap}>
              <FaImage className={styles.placeholderIcon} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h4 className={styles.name} title={name}>
            {name}
          </h4>

          {categoryName ? (
            <p className={styles.category}>{categoryName}</p>
          ) : null}

          <div className={styles.pricing}>
            <span className={styles.current}>
              Rs.{discountedPrice.toLocaleString()}
            </span>
            {numDiscount > 0 && (
              <span className={styles.original}>
                Rs.{price.toLocaleString()}
              </span>
            )}
            {numDiscount > 0 && (
              <span className={styles.discountPct}>-{numDiscount}%</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
