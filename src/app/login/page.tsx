'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import './Login.css';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAppContext();
  const router = useRouter();

  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-avatar">👋</div>
          <h1>Welcome back, {user.name || user.email}!</h1>
          <p className="auth-subtitle">
            You are signed in as <span className="badge badge-primary">{user.role}</span>
          </p>
          <div className="auth-actions">
            {user.role === 'admin' && (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => router.push('/erp')}>
                📊 Go to Dashboard
              </button>
            )}
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => router.push('/shop')}>
              🛍️ Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Demo auth - in production use NextAuth
      if (email === 'admin@petshop.com' && password === 'admin123') {
        login({ name: 'Admin', email, role: 'admin' });
        router.push('/erp');
      } else if (email && password) {
        login({ name: name || email.split('@')[0], email, role: 'customer' });
        router.push('/shop');
      } else {
        setError('Please fill in all fields.');
      }
    } catch {
      setError('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🐾</div>
        <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="auth-subtitle">
          {isRegister ? 'Sign up to start shopping' : 'Sign in to your account'}
        </p>

        {/* Google Auth Button (placeholder - needs NextAuth setup) */}
        <button className="google-auth-btn" onClick={() => {
          login({ name: 'Google User', email: 'user@gmail.com', role: 'customer', image: null });
          router.push('/shop');
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? '⏳ Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button className="auth-switch-btn" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <div className="auth-hint">
          <p>💡 <strong>Admin:</strong> admin@petshop.com / admin123</p>
          <p>💡 <strong>Customer:</strong> any email / any password</p>
        </div>
      </div>
    </div>
  );
}
