import Link from 'next/link';

import styles from './ProductCard.module.css';
import { FaHandHoldingUsd } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const {
    name,
    category,
    currentPrice,
    originalPrice,
    discount,
    payPlan,
    emoji,
  } = product;

  return (
    <Link href="/product/[slug]" as={`/product/${product.slug}`}>
      <div className={styles.card}>
        <div className={styles.imageWrap}>
          {discount && <span className={styles.discountBadge}>-{discount}%</span>}
          <span className={styles.emoji}>{emoji}</span>
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.category}>{category}</div>
          <div className={styles.pricing}>
            <span className={styles.current}>Rs.{currentPrice}</span>
            {originalPrice && (
              <span className={styles.original}>Rs.{originalPrice}</span>
            )}
            {discount && (
              <span className={styles.discountPct}>-{discount}%</span>
            )}
          </div>
          {payPlan && (
            <span className={styles.payPlan}>
              <FaHandHoldingUsd /> Pay only Rs. {payPlan} now
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}