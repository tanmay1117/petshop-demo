'use client';
import { useAppContext } from '../../context/AppContext';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAppContext();

  // In production, this would fetch from /api/orders?userId=...
  return (
    <div className="container" style={{ padding: 'var(--space-3xl) var(--space-lg)' }}>
      <h1 className="section-title" style={{ marginBottom: 'var(--space-2xl)' }}>My Orders</h1>

      {!user ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <div className="empty-state-title">Please sign in</div>
          <p style={{ marginBottom: 'var(--space-xl)' }}>You need to be signed in to view your orders.</p>
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-title">No orders yet</div>
          <p style={{ marginBottom: 'var(--space-xl)' }}>You haven&apos;t placed any orders yet. Start shopping to see your orders here!</p>
          <Link href="/shop" className="btn btn-primary">Shop Now →</Link>
        </div>
      )}
    </div>
  );
}
