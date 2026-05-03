import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import { AppProvider } from '../context/AppContext'
import CartDrawer from '../components/CartDrawer'

export const metadata: Metadata = {
  title: {
    default: 'Petshop Demo — Premium Pet Supplies & Accessories',
    template: '%s | Petshop Demo'
  },
  description: 'Your one-stop destination for premium pet supplies, accessories, and everything your beloved companions need. Shop dog, cat, bird & fish products.',
  keywords: ['pet shop', 'pet supplies', 'dog accessories', 'cat toys', 'pet food', 'pet care', 'online pet store'],
  authors: [{ name: 'Petshop Demo' }],
  openGraph: {
    title: 'Petshop Demo — Premium Pet Supplies',
    description: 'Premium pet supplies for dogs, cats, birds & fish. Fast delivery, best prices.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Petshop Demo',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0b14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppProvider>
          <Navbar />
          <CartDrawer />
          <main style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </AppProvider>
      </body>
    </html>
  )
}
