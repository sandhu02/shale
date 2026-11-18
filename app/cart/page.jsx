'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartItem from '@/components/cart/CartItem';
import styles from './page.module.css';
import { FaShoppingCart, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <main className="container" style={{ minHeight: '65vh', paddingBottom: '48px' }}>
        {items.length === 0 ? (
          <div className={styles.emptyWrap}>
            <div className={styles.emptyCard}>
              <div className={styles.emptyIcon}>
                <FaShoppingCart />
              </div>
              <h2>Your shopping cart is empty</h2>
              <p>Looks like you haven&apos;t added any items to your cart yet.</p>
              <Link href="/" className={styles.continueShoppingBtn}>
                <FaArrowLeft /> Explore Our Products
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.cartSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                Shopping Cart <span>({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
              </h1>
              <button
                type="button"
                onClick={handleClearCart}
                className={styles.clearBtn}
              >
                Clear All
              </button>
            </div>

            <div className={styles.grid}>
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.size || ''}-${item.color || ''}`}
                    item={item}
                    onUpdate={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
                <div className={styles.backRow}>
                  <Link href="/" className={styles.backLink}>
                    <FaArrowLeft /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className={styles.summaryCol}>
                <div className={styles.summaryCard}>
                  <h3 className={styles.summaryTitle}>Order Summary</h3>

                  <div className={styles.summaryRow}>
                    <span>Items Total ({totalItems})</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Shipping</span>
                    <span className={styles.shippingNotice}>Free Nationwide</span>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.totalRow}>
                    <span>Total Amount</span>
                    <span className={styles.totalAmount}>Rs. {totalPrice.toLocaleString()}</span>
                  </div>

                  <Link href="/checkout" className={styles.checkoutBtn}>
                    Proceed to Checkout
                  </Link>

                  <div className={styles.securityNotice}>
                    <FaShieldAlt className={styles.shieldIcon} />
                    <span>Safe &amp; Secure Checkout · Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
