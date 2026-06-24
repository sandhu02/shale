'use client';

import { useState } from 'react';
import styles from './AddToCart.module.css';

export default function AddToCart({ productId, inStock }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    if (!inStock) {
      setMessage('Sorry, this item is out of stock.');
      return;
    }
    // In a real app, dispatch to cart context/state
    setMessage(`Added ${quantity} item(s) to cart!`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className={styles.cartSection}>
      <div className={styles.quantity}>
        <button
          className={styles.qtyBtn}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={quantity <= 1}
        >
          −
        </button>
        <span className={styles.qtyValue}>{quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => setQuantity((q) => q + 1)}
        >
          +
        </button>
      </div>

      <button
        className={styles.addBtn}
        onClick={handleAdd}
        disabled={!inStock}
      >
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}