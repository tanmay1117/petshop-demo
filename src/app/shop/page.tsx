'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import './Shop.css';

// Wrapper to satisfy Suspense requirement for useSearchParams
export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{textAlign:'center',padding:'4rem',color:'var(--text-muted)'}}>Loading shop...</div>}>
      <Shop />
    </Suspense>
  );
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  category?: string | null;
  sku?: string;
}

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart } = useAppContext();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(p =>
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'stock': result.sort((a, b) => b.stockQuantity - a.stockQuantity); break;
      default: break;
    }

    setFiltered(result);
  }, [products, searchQuery, sortBy, selectedCategory, priceRange]);

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean) as string[])];

  return (
    <div className="shop-page">
      {/* Shop Header */}
      <div className="shop-header container">
        <div>
          <h1 className="shop-title">Pet Accessories Shop</h1>
          <p className="shop-subtitle">{filtered.length} products found</p>
        </div>
        <div className="shop-controls">
          <div className="shop-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="shop-search-input"
            />
            <span className="shop-search-icon">🔍</span>
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="shop-sort"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name A-Z</option>
            <option value="stock">Availability</option>
          </select>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >⊞</button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >☰</button>
          </div>
          <button className="btn btn-secondary btn-sm filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            🎛️ Filters
          </button>
        </div>
      </div>

      <div className="container shop-layout">
        {/* Sidebar Filters */}
        <aside className={`shop-sidebar ${showFilters ? 'sidebar-open' : ''}`}>
          <div className="filter-group">
            <h3 className="filter-title">Categories</h3>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-option ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? '🏷️ All Products' : `📂 ${cat}`}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0] || ''}
                onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1] || ''}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              />
            </div>
          </div>

          <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setPriceRange([0, 10000]);
            setSortBy('newest');
          }}>
            Clear All Filters
          </button>
        </aside>

        {/* Product Grid */}
        <div className="shop-products">
          {loading ? (
            <div className={`product-grid ${viewMode}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="product-card-skeleton">
                  <div className="skeleton skeleton-image"></div>
                  <div style={{ padding: '1rem' }}>
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">No products found</div>
              <p>Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className={`product-grid ${viewMode}`}>
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className={`shop-product-card ${viewMode}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="spc-image" onClick={() => setQuickViewProduct(product)}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <div className="spc-placeholder">🛍️</div>
                    )}
                    {product.stockQuantity === 0 && (
                      <span className="spc-oos-badge">Out of Stock</span>
                    )}
                    {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                      <span className="spc-low-badge">Only {product.stockQuantity} left!</span>
                    )}
                    <div className="spc-quick-view">
                      <span>Quick View</span>
                    </div>
                  </div>
                  <div className="spc-info">
                    {product.category && <span className="spc-category">{product.category}</span>}
                    <h3 className="spc-name">{product.name}</h3>
                    <p className="spc-desc">{product.description}</p>
                    <div className="spc-footer">
                      <span className="spc-price">₹{product.price.toLocaleString('en-IN')}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={product.stockQuantity === 0}
                        onClick={() => addToCart(product)}
                      >
                        {product.stockQuantity === 0 ? 'Sold Out' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h2>{quickViewProduct.name}</h2>
              <button onClick={() => setQuickViewProduct(null)} className="close-btn" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-secondary)', height: 300 }}>
                {quickViewProduct.imageUrl ? (
                  <img src={quickViewProduct.imageUrl} alt={quickViewProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem' }}>🛍️</div>
                )}
              </div>
              <div>
                {quickViewProduct.category && (
                  <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{quickViewProduct.category}</span>
                )}
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>{quickViewProduct.description}</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </p>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {quickViewProduct.stockQuantity > 0 ? (
                    <><span className="status-dot status-dot-success"></span>{quickViewProduct.stockQuantity} in stock</>
                  ) : (
                    <><span className="status-dot status-dot-danger"></span>Out of stock</>
                  )}
                </p>
                {quickViewProduct.sku && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    SKU: {quickViewProduct.sku}
                  </p>
                )}
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={quickViewProduct.stockQuantity === 0}
                  onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
                >
                  {quickViewProduct.stockQuantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
