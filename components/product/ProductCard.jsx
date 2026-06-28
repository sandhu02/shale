import Link from 'next/link';

import styles from './ProductCard.module.css';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const {
    name,
    category,
    price,
    discount = 0,
    images,
  } = product;

  return (
    <Link href="/product/[id]" as={`/product/${product._id}`}>
      <div className={styles.card}>
        <div className={styles.imageWrap}>
          {Number(discount) !== 0 && <span className={styles.discountBadge}>-{discount}%</span>}

          {images?.length > 0 ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              className={styles.image}
            />
          ) : (
            <span className={styles.emoji}>📷</span>
          )}
          
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.category}>{category}</div>
          <div className={styles.pricing}>
            <span className={styles.current}>Rs.{Math.floor(price - price * (discount / 100))}</span>
            {Number(discount) !== 0 ? (
              <span className={styles.original}>
                Rs.{price}
              </span>
            ) : <span></span>}
            {Number(discount) !== 0 && (
              <span className={styles.discountPct}>-{discount}%</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}