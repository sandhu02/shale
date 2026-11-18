'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { FaCheckCircle, FaLock, FaTruck, FaShieldAlt } from 'react-icons/fa';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If cart is empty, redirect safely inside useEffect
  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push('/cart');
    }
  }, [items.length, success, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.name || !form.email || !form.phone || !form.address) {
      setError('All fields marked with * are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          items,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Order placement failed. Please try again.');
      }

      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <>
        <Header />
        <Navbar />
        <main className="container" style={{ minHeight: '60vh', padding: '60px 0', textAlign: 'center' }}>
          <p>Redirecting to cart…</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <main className="container" style={{ minHeight: '70vh', paddingBottom: '48px' }}>
        {success ? (
          <div className={styles.successWrap}>
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <FaCheckCircle />
              </div>
              <h2>Order Placed Successfully!</h2>
              <p className={styles.thankYouText}>
                Thank you, <strong>{form.name}</strong>. Your order has been received and is being processed.
              </p>
              <div className={styles.orderNoticeBox}>
                <p>We will contact you via WhatsApp/Phone at <strong>{form.phone}</strong> to confirm delivery.</p>
                <p className={styles.paymentMethodNotice}>Payment Method: <strong>Cash on Delivery</strong></p>
              </div>
              <Link href="/" className={styles.continueShoppingBtn}>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.checkoutSection}>
            <div className={styles.pageHeader}>
              <h1>Checkout &amp; Shipping</h1>
              <p className={styles.subtext}>Complete your details below to confirm your order</p>
            </div>

            <div className={styles.grid}>
              {/* Form Col */}
              <div className={styles.formCol}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <FaTruck className={styles.sectionIcon} />
                    <h2>Delivery Details</h2>
                  </div>

                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                      <label htmlFor="name">Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Muhammad Ali"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label htmlFor="email">Email Address *</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="e.g. ali@example.com"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className={styles.field}>
                        <label htmlFor="phone">Contact Number / WhatsApp *</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="e.g. +92 300 1234567"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="address">Complete Delivery Address *</label>
                      <textarea
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="House / Apartment number, Street, Area, City"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.paymentSection}>
                      <label className={styles.paymentLabel}>Payment Method</label>
                      <div className={styles.paymentOption}>
                        <input
                          type="radio"
                          id="cod"
                          name="payment"
                          defaultChecked
                          readOnly
                        />
                        <label htmlFor="cod" className={styles.radioLabel}>
                          <strong>Cash on Delivery (COD)</strong>
                          <span>Pay with cash when your parcel is delivered to your doorstep</span>
                        </label>
                      </div>
                    </div>

                    {error && <div className={styles.errorBox}>{error}</div>}

                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={loading}
                    >
                      <FaLock />
                      <span>{loading ? 'Processing Order…' : `Place Order (Rs. ${totalPrice.toLocaleString()})`}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Order Summary Col */}
              <div className={styles.summaryCol}>
                <div className={styles.card}>
                  <h3 className={styles.summaryTitle}>Your Order Summary</h3>
                  <div className={styles.itemsPreview}>
                    {items.map((item) => {
                      const itemPrice = item.discountedPrice || item.price;
                      return (
                        <div key={`${item.id}-${item.size || ''}-${item.color || ''}`} className={styles.previewItem}>
                          <div className={styles.previewInfo}>
                            <span className={styles.previewName}>{item.name}</span>
                            <span className={styles.previewMeta}>
                              Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ''}
                            </span>
                          </div>
                          <span className={styles.previewPrice}>
                            Rs. {(itemPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles.summaryCalc}>
                    <div className={styles.calcRow}>
                      <span>Subtotal</span>
                      <span>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className={styles.calcRow}>
                      <span>Delivery Fee</span>
                      <span className={styles.freeShipping}>FREE</span>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.totalRow}>
                      <span>Total</span>
                      <span>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className={styles.trustBadge}>
                    <FaShieldAlt className={styles.trustIcon} />
                    <span>Guaranteed safe delivery &amp; standard quality check</span>
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
