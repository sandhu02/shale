'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './AddToCart.module.css';

export default function AddToCart({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  console.log("product" , product)

  const { _id, name, price, images, inStock } = product;

  const handleAdd = () => {
    if (!inStock) {
      setMessage('Sorry, this item is out of stock.');
      return;
    }

    // Add item to cart
    addItem({
      id: _id,
      name,
      price,
      image: images?.[0] || '/placeholder.jpg', // Use first image as thumbnail
      quantity,
    });

    setMessage(`Added ${quantity} × "${name}" to cart!`);
    setQuantity(1); // Reset quantity
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