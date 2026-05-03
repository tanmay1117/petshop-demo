'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import './Checkout.css';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, user, showToast } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="checkout-page container">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <div className="empty-state-title">Your cart is empty</div>
          <p>Add some products before checking out.</p>
          <button className="btn btn-primary" onClick={() => router.push('/shop')} style={{ marginTop: '1rem' }}>
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
        }),
      });

      const order = await res.json();

      if (order.dev_mode) {
        // Dev mode — simulate successful payment
        showToast('success', '🎉 Payment simulated (dev mode). Order placed!');
        clearCart();
        router.push('/orders');
        return;
      }

      // Load Razorpay checkout
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const razorpay = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Petshop Demo',
          description: 'Pet Supplies Order',
          order_id: order.id,
          handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
            // Verify payment
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            if (result.verified) {
              showToast('success', '🎉 Payment successful! Order placed.');
              clearCart();
              router.push('/orders');
            } else {
              showToast('error', 'Payment verification failed.');
            }
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: '#ff5e3a' },
        });
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch {
      showToast('error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container">
      <h1 className="section-title" style={{ marginBottom: 'var(--space-2xl)' }}>Checkout</h1>

      <div className="checkout-grid">
        <div className="checkout-form-section">
          <div className="checkout-card">
            <h2>Shipping Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+91 98765 43210" />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required placeholder="Street address, building..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Order Notes (optional)</label>
              <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Special instructions..." />
            </div>
          </div>
        </div>

        <div className="checkout-summary-section">
          <div className="checkout-card">
            <h2>Order Summary</h2>
            <div className="checkout-items">
              {cart.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-img">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span>🛍️</span>}
                  </div>
                  <div className="checkout-item-details">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-qty">× {item.cartQuantity}</span>
                  </div>
                  <span className="checkout-item-price">₹{(item.price * item.cartQuantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-success' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="checkout-total-row">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="checkout-total-row checkout-total-final">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg checkout-pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : `💳 Pay ₹${total.toLocaleString('en-IN')}`}
            </button>

            <div className="checkout-secure">
              <span>🔒 Secured by Razorpay</span>
              <span>💳 Visa, Mastercard, UPI, Wallets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
