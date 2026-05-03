'use client';
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, cartCount } = useAppContext();

  return (
    <>
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div>
            <h2>Shopping Cart</h2>
            <span className="cart-count">{cartCount} items</span>
          </div>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p className="cart-empty-title">Your cart is empty</p>
              <p className="cart-empty-desc">Add some products to get started!</p>
              <button className="btn btn-primary" onClick={() => setIsCartOpen(false)}>
                <Link href="/shop" style={{ color: 'inherit' }}>Continue Shopping</Link>
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span>🛍️</span>}
                </div>
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                  <div className="cart-qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                    >−</button>
                    <span className="qty-value">{item.cartQuantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                      disabled={item.cartQuantity >= item.stockQuantity}
                    >+</button>
                  </div>
                </div>
                <div className="cart-item-end">
                  <span className="cart-item-total">₹{(item.price * item.cartQuantity).toLocaleString('en-IN')}</span>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)} title="Remove">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className="cart-free-shipping">{cartTotal >= 999 ? 'FREE' : '₹99'}</span>
              </div>
              <div className="cart-summary-row cart-total-row">
                <span>Total</span>
                <span>₹{(cartTotal + (cartTotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}</span>
              </div>
            </div>
            {cartTotal < 999 && (
              <p className="cart-free-note">Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping!</p>
            )}
            <Link
              href="/checkout"
              className="btn btn-primary checkout-btn"
              onClick={() => setIsCartOpen(false)}
            >
              Proceed to Checkout →
            </Link>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={() => setIsCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
