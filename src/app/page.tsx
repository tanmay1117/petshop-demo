'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import './Home.css';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stockQuantity: number;
  category?: string;
}

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target]);

  return <div ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</div>;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { addToCart } = useAppContext();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 6)))
      .catch(console.error);
  }, []);

  const categories = [
    { name: 'Accessories', emoji: '🎀', count: 50, color: '#ff5e3a' },
    { name: 'Food & Treats', emoji: '🦴', count: 30, color: '#00d2ff' },
    { name: 'Toys', emoji: '🎾', count: 40, color: '#a855f7' },
    { name: 'Grooming', emoji: '✨', count: 25, color: '#10b981' },
    { name: 'Health', emoji: '💊', count: 20, color: '#f59e0b' },
    { name: 'Carriers', emoji: '🎒', count: 15, color: '#ef4444' },
  ];

  const features = [
    { icon: '🚚', title: 'Free Delivery', desc: 'Free shipping on orders above ₹999' },
    { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay, UPI, cards — all secure' },
    { icon: '💯', title: 'Premium Quality', desc: 'Only the best products for your pets' },
    { icon: '📞', title: '24/7 Support', desc: 'WhatsApp, email, phone — always here' },
  ];

  const testimonials = [
    { name: 'Priya S.', text: 'Amazing quality products! My dog loves the toys. Fast delivery too!', rating: 5, avatar: '👩' },
    { name: 'Rahul M.', text: 'Best pet shop online. The astronaut backpack is a hit at the park!', rating: 5, avatar: '👨' },
    { name: 'Ananya K.', text: 'Great customer service and wide variety. Highly recommend!', rating: 5, avatar: '👩‍💼' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid-pattern"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge">🔥 New Arrivals Just Dropped!</div>
            <h1 className="hero-title">
              Premium <span className="gradient-text">Pet Care</span> Products
              <br />for Your{' '}
              <span className="gradient-text-secondary">Best Friends</span>
            </h1>
            <p className="hero-subtitle">
              Discover our curated collection of premium pet supplies, from luxury accessories 
              to everyday essentials. Your pets deserve the best.
            </p>
            <div className="hero-actions">
              <Link href="/shop" className="btn btn-primary btn-lg">
                🛍️ Shop Now
              </Link>
              <Link href="/about" className="btn btn-secondary btn-lg">
                Learn More →
              </Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-item">
                <span className="hero-trust-stars">⭐⭐⭐⭐⭐</span>
                <span>4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-float-card hero-float-1">🐕 Dogs</div>
              <div className="hero-float-card hero-float-2">🐈 Cats</div>
              <div className="hero-float-card hero-float-3">🐦 Birds</div>
              <div className="hero-float-card hero-float-4">🐠 Fish</div>
            </div>
            <div className="hero-circle-decoration"></div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            {features.map((f, i) => (
              <div key={i} className="trust-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="trust-icon">{f.icon}</span>
                <div>
                  <h4 className="trust-title">{f.title}</h4>
                  <p className="trust-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section container">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Find everything your pet needs, organized for easy shopping</p>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={`/shop?category=${cat.name.toLowerCase()}`}
              className="category-card"
              style={{ '--accent': cat.color } as React.CSSProperties}
            >
              <span className="category-emoji">{cat.emoji}</span>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-count">{cat.count}+ products</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">Hand-picked bestsellers that your pets will love</p>
        <div className="featured-grid">
          {featuredProducts.map((product, i) => (
            <div key={product.id} className="product-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="product-card-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <div className="product-card-placeholder">🛍️</div>
                )}
                {product.stockQuantity === 0 && (
                  <span className="product-badge-oos">Out of Stock</span>
                )}
                <div className="product-card-overlay">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={product.stockQuantity === 0}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <Link href="/shop" className="btn btn-secondary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="product-card-info">
                {product.category && <span className="product-card-category">{product.category}</span>}
                <h3 className="product-card-name">{product.name}</h3>
                <div className="product-card-bottom">
                  <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="product-card-stock">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Sold out'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
          <Link href="/shop" className="btn btn-outline btn-lg">View All Products →</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: 5000, suffix: '+', label: 'Happy Customers' },
              { value: 200, suffix: '+', label: 'Products' },
              { value: 50, suffix: '+', label: 'Brands' },
              { value: 10, suffix: '+', label: 'Years Experience' },
            ].map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section container">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">{'⭐'.repeat(t.rating)}</div>
              <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author">
                <span className="testimonial-avatar">{t.avatar}</span>
                <span className="testimonial-name">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <h2>Stay in the Loop 🐾</h2>
              <p>Get exclusive deals, new product launches, and pet care tips delivered to your inbox.</p>
            </div>
            <form className="newsletter-form" onSubmit={e => { e.preventDefault(); alert('Subscribed!'); }}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
