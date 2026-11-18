'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './CartItem.module.css';
import { FaTrashAlt } from 'react-icons/fa';

export default function CartItem({ item, onUpdate, onRemove }) {
  const { id, name, discountedPrice, quantity, image, size, color } = item;

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      onUpdate(id, val);
    }
  };

  const hasImage = image && typeof image === 'string' && image.trim() !== '' && image !== '/placeholder.jpg';

  return (
    <div className={styles.item}>
      <div className={styles.imageWrap}>
        {hasImage ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="90px"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <span>👟</span>
          </div>
        )}
      </div>

      <div className={styles.details}>
        <Link href={`/product/${id}`} className={styles.name}>
          {name}
        </Link>
        <p className={styles.price}>Rs. {discountedPrice ? discountedPrice.toLocaleString() : 0}</p>

        {/* Selected options if any */}
        {(size || color) && (
          <div className={styles.options}>
            {size && (
              <span className={styles.sizeBadge}>
                Size: <strong>{size}</strong>
              </span>
            )}
            {color && (
              <span className={styles.colorBadge} title={`Color: ${color}`}>
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: color ? color.toLowerCase() : 'transparent' }}
                />
                {color}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.quantity}>
          <button
            type="button"
            onClick={() => onUpdate(id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className={styles.qtyBtn}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            aria-label="Item quantity"
            className={styles.qtyInput}
          />
          <button
            type="button"
            onClick={() => onUpdate(id, quantity + 1)}
            aria-label="Increase quantity"
            className={styles.qtyBtn}
          >
            +
          </button>
        </div>

        <div className={styles.subtotal}>
          Rs. {((discountedPrice || 0) * quantity).toLocaleString()}
        </div>

        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => onRemove(id)}
          title="Remove from cart"
          aria-label={`Remove ${name} from cart`}
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
}
