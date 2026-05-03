# 🐾 Petshop Demo

A full-stack Pet Shop E-commerce + ERP platform built with **Next.js 16**, **Prisma**, and **PostgreSQL**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

## ✨ Features

### Public Website
- 🏠 Animated home page with hero, categories, featured products, testimonials
- 🛒 Shop with search, filters, sorting, quick-view modals
- 📝 Blog with article detail pages
- 📞 Contact form with lead capture to database
- 💳 Checkout with Razorpay payment integration
- 🌗 Dark/Light mode toggle

### ERP Dashboard (`/erp`)
- 📊 Business analytics (revenue, inventory value, stock alerts)
- 📦 Full product CRUD with auto-generated SKU/barcodes
- 📋 Order management with status tracking
- 👥 Lead management
- 🏷️ Barcode lookup and print functionality
- 🔐 Role-based access (admin only)

### Integrations
- 💰 Razorpay (test mode with dev simulation)
- 📧 Email (Nodemailer/SMTP)
- 📱 SMS (Twilio)
- 💬 WhatsApp Business API
- 🔔 Discord webhooks

### Technical
- ⚡ Next.js 16 App Router with Turbopack
- 🎨 Custom CSS design system (Glassmorphism, CSS Variables)
- 📱 Fully responsive (mobile → tablet → iPad → desktop)
- 🗃️ Prisma ORM with PostgreSQL
- 🔐 NextAuth.js ready

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/tanmay1117/petshop-demo.git
cd petshop-demo

# Install
npm install

# Setup env
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Seed database
npx tsx prisma/seed.ts

# Run dev server
npm run dev
```

## 🌐 Deployment (Vercel + Neon)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Create a [Neon](https://neon.tech) PostgreSQL database
4. Add `DATABASE_URL` to Vercel environment variables
5. Add build command override: `npx prisma generate && next build`
6. Deploy!

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/              # REST API endpoints
│   ├── shop/             # Shop page
│   ├── erp/              # ERP Dashboard
│   ├── blog/             # Blog + [id] detail
│   ├── checkout/         # Checkout + payment
│   ├── contact/          # Contact form
│   ├── login/            # Auth page
│   └── orders/           # Customer orders
├── components/           # Navbar, Footer, CartDrawer, WhatsApp
├── context/              # AppContext (cart, user, theme)
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   └── integrations/     # Email, SMS, WhatsApp, Discord
└── prisma/
    ├── schema.prisma     # Database schema
    └── seed.ts           # Database seeder
```

## 🔑 Environment Variables

See [`.env.example`](.env.example) for the full list.

## 📜 License

MIT
