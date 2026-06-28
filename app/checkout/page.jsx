'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';
import Link from 'next/link';


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

    // If cart is empty, redirect to cart
    if (items.length === 0 && !success) {
        router.push('/cart');
        return null;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!form.name || !form.email || !form.phone || !form.address) {
            setError('All fields are required.');
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
                throw new Error(data.error || 'Order failed');
            }

            setSuccess(true);
            clearCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={`container ${styles.success}`}>
                <div className={styles.successCard}>
                    <span className={styles.icon}>✅</span>
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you, {form.name}. Your order has been received.</p>
                    <p>We'll send you a confirmation email shortly.</p>
                    <Link href="/" className={styles.continueBtn}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`container ${styles.checkout}`}>
            <h1>Checkout</h1>
            <div className={styles.grid}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="name">Full Name *</label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="email">Email Address *</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="phone">Contact Number *</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+92 300 1234567"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="address">Delivery Address *</label>
                        <textarea
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows={3}
                            placeholder="123 Street, City, Country"
                            required
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>

                <div className={styles.summary}>
                    <div className={styles.summaryCard}>
                        <h3>Order Summary</h3>
                        <div className={styles.itemsPreview}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.previewItem}>
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>Rs.{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.total}>
                            <span>Total</span>
                            <span>Rs.{totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}