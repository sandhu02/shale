"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import styles from "./page.module.css";

function StatusBadge({ status }) {
    const statusMap = {
        pending: { label: "Pending", className: styles.statusPending },
        processing: { label: "Processing", className: styles.statusProcessing },
        dispatched: { label: "Dispatched", className: styles.statusDispatched },
        shipped: { label: "Shipped", className: styles.statusDispatched },
        delivered: { label: "Delivered", className: styles.statusDelivered },
        complete: { label: "Complete", className: styles.statusComplete },
        canceled: { label: "Canceled", className: styles.statusCanceled },
        cancelled: { label: "Canceled", className: styles.statusCanceled },
    };

    const { label, className } = statusMap[status] || statusMap.pending;

    return <span className={`${styles.statusBadge} ${className}`}>{label}</span>;
}

function PaymentBadge({ status }) {
    const statusMap = {
        pending: { label: "Pending", className: styles.paymentPending },
        paid: { label: "Paid", className: styles.paymentPaid },
        failed: { label: "Failed", className: styles.paymentFailed },
        refunded: { label: "Refunded", className: styles.paymentRefunded },
    };

    const { label, className } = statusMap[status] || statusMap.pending;

    return <span className={`${styles.paymentBadge} ${className}`}>{label}</span>;
}

function StatusUpdater({ orderId, currentStatus, orderNumber, onUpdated }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const statuses = [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "dispatched", label: "Dispatched" },
        { value: "delivered", label: "Delivered" },
        { value: "complete", label: "Complete" },
        { value: "canceled", label: "Canceled" },
    ];

    const canUpdate = (from, to) => {
        const order = ["pending", "processing", "dispatched", "delivered", "complete"];
        const fromIndex = order.indexOf(from);
        const toIndex = order.indexOf(to);

        if (to === "canceled") return true;
        if (toIndex < fromIndex) return false;
        if (from === "complete") return false;

        return true;
    };

    const handleUpdate = async () => {
        if (selectedStatus === currentStatus) return;
        if (!canUpdate(currentStatus, selectedStatus)) {
            setError(`Cannot change from "${currentStatus}" to "${selectedStatus}"`);
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: selectedStatus }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update status");
            }

            startTransition(() => router.refresh());
            onUpdated?.();
        } catch (err) {
            setError(err.message);
            setSelectedStatus(currentStatus);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={styles.statusUpdater}>
            <div className={styles.statusUpdaterHeader}>
                <h3>Update Order Status</h3>
                <span className={styles.orderNumberRef}>#{orderNumber}</span>
            </div>
            <div className={styles.statusUpdaterBody}>
                <div className={styles.statusSelector}>
                    {statuses.map((s) => (
                        <button
                            key={s.value}
                            className={`${styles.statusOption} ${selectedStatus === s.value ? styles.selected : ""} ${s.value === "canceled" ? styles.cancelOption : ""}`}
                            onClick={() => setSelectedStatus(s.value)}
                            disabled={isUpdating || isPending}
                            title={!canUpdate(currentStatus, s.value) ? `Cannot change from ${currentStatus} to ${s.value}` : ""}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <div className={styles.statusUpdaterActions}>
                    <button
                        className={styles.updateBtn}
                        onClick={handleUpdate}
                        disabled={isUpdating || isPending || selectedStatus === currentStatus || !canUpdate(currentStatus, selectedStatus)}
                    >
                        {isUpdating ? "Updating..." : "Update Status"}
                    </button>
                    {selectedStatus !== currentStatus && (
                        <button
                            className={styles.resetBtn}
                            onClick={() => {
                                setSelectedStatus(currentStatus);
                                setError(null);
                            }}
                            disabled={isUpdating || isPending}
                        >
                            Reset
                        </button>
                    )}
                </div>

                <div className={styles.currentStatusDisplay}>
                    <span className={styles.currentLabel}>Current:</span>
                    <StatusBadge status={currentStatus} />
                    {selectedStatus !== currentStatus && (
                        <>
                            <span className={styles.arrow}>→</span>
                            <StatusBadge status={selectedStatus} />
                            <span className={styles.pendingBadge}>pending update</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function OrderDetailClient() {
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const orderId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const loadOrder = useCallback(async () => {
        if (!orderId) {
            setOrder(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
            const payload = await res.json();

            if (!res.ok) {
                throw new Error(payload.error || "Failed to load order");
            }

            setOrder(payload.data || null);
        } catch (err) {
            console.error("Order load failed:", err);
            setError(err.message || "Failed to load order");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Loading order...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Unable to load order</h2>
                    <p>{error}</p>
                    <Link href="/admin/orders" className={styles.backLink}>
                        ← Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Order not found</h2>
                    <Link href="/admin/orders" className={styles.backLink}>
                        ← Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const {
        _id,
        orderNumber,
        customer,
        items,
        total,
        subtotal,
        status,
        paymentStatus,
        createdAt,
        updatedAt,
    } = order;

    const itemCount = items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/admin/orders" className={styles.backBtn}>← Back to Orders</Link>
                    <h1 className={styles.pageTitle}>Order <span className={styles.orderNum}>#{orderNumber}</span></h1>
                </div>
                <div className={styles.headerRight}>
                    <span className={styles.orderDate}>{formatDate(createdAt)}</span>
                    <StatusBadge status={status} />
                </div>
            </div>

            <StatusUpdater orderId={_id} currentStatus={status} orderNumber={orderNumber} onUpdated={loadOrder} />

            <div className={styles.grid}>
                <div className={styles.leftColumn}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Customer</h3>
                        <div className={styles.customerInfo}>
                            <div className={styles.customerName}>{customer?.name || "Guest"}</div>
                            <div className={styles.customerEmail}>{customer?.email || "No email provided"}</div>
                            {customer?.phone && <div className={styles.customerPhone}>{customer.phone}</div>}
                            {customer?.address && <div className={styles.customerAddress}>{customer.address}</div>}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Payment</h3>
                        <div className={styles.paymentInfo}>
                            <div className={styles.paymentRow}>
                                <span className={styles.paymentLabel}>Status</span>
                                <PaymentBadge status={paymentStatus} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Order Items <span className={styles.itemCount}>({itemCount})</span></h3>
                        <div className={styles.itemsList}>
                            {items?.map((item, index) => (
                                <div key={item._id || index} className={styles.orderItem}>
                                    <div className={styles.itemImageWrap}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className={styles.itemImage} />
                                        ) : (
                                            <div className={styles.itemImagePlaceholder}><FaShoppingBag /></div>
                                        )}
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemName}>{item.name}</div>
                                        <div className={styles.itemMeta}>
                                            <span className={styles.itemQty}>Qty: {item.quantity || 1}</span>
                                        </div>
                                    </div>
                                    <div className={styles.itemPrice}>
                                        <div className={styles.itemUnitPrice}>Rs.{item.price?.toLocaleString() || 0}</div>
                                        <div className={styles.itemTotalPrice}>Rs.{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Order Summary</h3>
                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>Rs.{subtotal?.toLocaleString() || 0}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Total</span>
                                <span>Rs.{total?.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Order Timeline</h3>
                        <div className={styles.timeline}>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineDot} />
                                <div className={styles.timelineContent}>
                                    <div className={styles.timelineTitle}>Order Created</div>
                                    <div className={styles.timelineDate}>{formatDate(createdAt)}</div>
                                </div>
                            </div>
                            {updatedAt && updatedAt !== createdAt && (
                                <div className={styles.timelineItem}>
                                    <div className={styles.timelineDot} />
                                    <div className={styles.timelineContent}>
                                        <div className={styles.timelineTitle}>Last Updated</div>
                                        <div className={styles.timelineDate}>{formatDate(updatedAt)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
