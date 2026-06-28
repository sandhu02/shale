'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import CartItem from '@/components/cart/CartItem';
import styles from './page.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <h2>Your cart is empty</h2>
        <p>Browse our products and add items you love.</p>
        <Link href="/" className={styles.continueBtn}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.cart}`}>
      <h1>Shopping Cart</h1>
      <div className={styles.grid}>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={updateQuantity}
              onRemove={removeItem}
            />
          ))}
          <div className={styles.actions}>
            <button onClick={clearCart} className={styles.clearBtn}>
              Clear Cart
            </button>
          </div>
        </div>
        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Items ({totalItems})</span>
              <span>Rs.{totalPrice.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>Rs.{totalPrice.toLocaleString()}</span>
            </div>
            <Link href="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}