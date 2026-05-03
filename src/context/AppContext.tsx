'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stockQuantity: number;
  description?: string | null;
  sku?: string;
  barcode?: string;
  category?: string | null;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  role: 'admin' | 'customer';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

type Theme = 'dark' | 'light';

interface AppContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  cartCount: number;
  hydrated: boolean;
  toasts: Toast[];
  showToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');

  // Load from localStorage after mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('petshop_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedCart = localStorage.getItem('petshop_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedTheme = localStorage.getItem('petshop_theme') as Theme | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    setHydrated(true);
  }, []);

  // Persist user
  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem('petshop_user', JSON.stringify(user));
    else localStorage.removeItem('petshop_user');
  }, [user, hydrated]);

  // Persist cart
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('petshop_cart', JSON.stringify(cart));
  }, [cart, hydrated]);

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('petshop_theme', next);
      return next;
    });
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
    showToast('success', `Welcome back, ${userData.name || userData.email}!`);
  };

  const logout = () => {
    setUser(null);
    showToast('info', 'You have been signed out.');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.cartQuantity >= product.stockQuantity) {
          showToast('error', 'Maximum stock reached for this item.');
          return prev;
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    showToast('success', `${product.name} added to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => item.id === productId ? { ...item, cartQuantity: quantity } : item)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.cartQuantity, 0);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen, cartTotal, cartCount, hydrated,
      toasts, showToast, removeToast, theme, toggleTheme
    }}>
      {children}
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`} onClick={() => removeToast(toast.id)}>
              <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
