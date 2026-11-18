'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './AddToCart.module.css';
import { FaShoppingCart, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function AddToCart({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    _id,
    name,
    category,
    price,
    discount = 0,
    discountedPrice = price,
    size,
    color,
    images = [],
    inStock = true,
    stock = 0,
  } = product;

  const isAvailable = inStock && (stock === undefined || stock > 0);

  const handleAdd = () => {
    if (!isAvailable) {
      setErrorMsg('Sorry, this item is currently out of stock.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    addItem({
      id: _id,
      name,
      category,
      price,
      discount,
      discountedPrice,
      size,
      color,
      image: images?.[0] || '',
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 3500);
  };

  return (
    <div className={styles.cartSection}>
      <div className={styles.actionRow}>
        <div className={styles.quantity}>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || !isAvailable}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => setQuantity((q) => (stock > 0 ? Math.min(stock, q + 1) : q + 1))}
            disabled={!isAvailable || (stock > 0 && quantity >= stock)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className={`${styles.addBtn} ${!isAvailable ? styles.outOfStockBtn : ''}`}
          onClick={handleAdd}
          disabled={!isAvailable}
        >
          <FaShoppingCart className={styles.btnIcon} />
          <span>{isAvailable ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>

      {added && (
        <div className={styles.successToast}>
          <div className={styles.toastContent}>
            <FaCheckCircle className={styles.successIcon} />
            <span>
              Added {quantity} × &quot;{name}&quot; to your cart!
            </span>
          </div>
          <Link href="/cart" className={styles.viewCartLink}>
            View Cart →
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className={styles.errorToast}>
          <FaExclamationCircle />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
