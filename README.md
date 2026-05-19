# BengkelKu — Platform Manajemen Bengkel Kendaraan

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> Platform bengkel kendaraan yang menghubungkan pelanggan dengan bengkel terpercaya — sekaligus sistem manajemen internal untuk operator bengkel.

**[🚀 Live Demo](https://bengkelku.vercel.app)** · **[📖 Dokumentasi](#cara-menjalankan-lokal)** · **[🐛 Report Bug](https://github.com/username/bengkelku/issues)**

---

## Screenshot

| Landing Page                 | Dashboard Operator               | Halaman Bengkel              |
| ---------------------------- | -------------------------------- | ---------------------------- |
| ![Landing](docs/landing.png) | ![Dashboard](docs/dashboard.png) | ![Bengkel](docs/bengkel.png) |

| Profil Bengkel             | Customer Portal                | Order Form               |
| -------------------------- | ------------------------------ | ------------------------ |
| ![Profil](docs/profil.png) | ![Customer](docs/customer.png) | ![Order](docs/order.png) |

---

## Tentang Project

BengkelKu adalah platform SaaS multi-tenant yang dirancang untuk dua sisi pengguna sekaligus **operator bengkel** yang ingin mengelola servis, invoice, dan pembayaran secara digital, dan **pelanggan** yang ingin menemukan bengkel terpercaya serta memesan servis secara online.

### Problem yang diselesaikan

Bengkel independen kebanyakan masih pakai cara lama: catatan di buku, nota kertas, WhatsApp bolak-balik. Akibatnya data gampang hilang, riwayat servis berantakan, dan pelanggan tidak tahu status kendaraannya sedang di mana.

BengkelKu menangani itu semua dalam satu tempat — pencatatan pelanggan dan kendaraan, manajemen order servis, invoice digital, sampai portal booking untuk pelanggan.

### Dua sisi platform

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Publik        │     │   Customer      │     │   Operator      │
│                 │     │                 │     │                 │
│ /               │     │ /masuk          │     │ /login          │
│ /bengkel        │     │ /daftar         │     │ /register       │
│ /bengkel/[slug] │     │ /akun           │     │ /dashboard      │
│                 │     │ /akun/orders    │     │ /services       │
│                 │     │                 │     │ /invoices       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Fitur Utama

### Sisi Operator (Dashboard Bengkel)

- **Manajemen Pelanggan** — CRUD pelanggan dengan search realtime
- **Manajemen Kendaraan** — Data kendaraan lengkap, relasi ke pelanggan
- **Service Order** — Buat order servis, tambah item pekerjaan & parts, update status (Pending → In Progress → Done)
- **Invoice Digital** — Generate invoice otomatis dari service order, support pajak & diskon
- **Pencatatan Pembayaran** — Cash, Transfer, QRIS. Auto-update status (Unpaid → Partial → Paid)
- **Kelola Order Masuk** — Terima booking & walk-in dari pelanggan, approve/reject dengan alasan
- **Profil Publik Bengkel** — Publish profil bengkel ke marketplace, atur layanan & jam operasional
- **Dashboard Stats** — Overview total pelanggan, kendaraan, servis, dan invoice

### Sisi Customer (Portal & Marketplace)

- **Cari Bengkel** — Temukan bengkel berdasarkan nama, kota, atau spesialisasi
- **Profil Bengkel** — Lihat detail bengkel, layanan yang tersedia, jam operasional
- **Booking Jadwal** — Pilih tanggal, isi keluhan, tunggu konfirmasi bengkel
- **Pesan Langsung (Walk-in)** — Langsung masuk antrean tanpa perlu konfirmasi
- **Pantau Status Order** — Progress bar realtime dari Menunggu → Dikonfirmasi → Diproses → Selesai
- **Riwayat Servis** — Lihat semua order di semua bengkel dalam satu akun
- **Invoice Digital** — Lihat dan print invoice dari setiap servis

### Fitur Teknis

- **Multi-tenant SaaS** — Satu aplikasi untuk banyak bengkel, data terisolasi per bengkel via `workshopId`
- **Global Customer Auth** — Satu akun customer untuk semua bengkel (seperti GoJek)
- **Server/Client Split** — Pattern konsisten: Server Component untuk data fetching, Client Component untuk interaktivitas
- **Rate Limiting** — Proteksi brute force di endpoint auth
- **Caching** — Public pages di-cache dengan `unstable_cache` + revalidasi otomatis
- **Env Validation** — Validasi environment variables saat startup dengan `@t3-oss/env-nextjs`
- **Print Invoice** — Invoice bisa di-print langsung dari browser

---

## Tech Stack

| Kategori        | Teknologi                          |
| --------------- | ---------------------------------- |
| Framework       | Next.js 15 (App Router)            |
| Language        | TypeScript                         |
| Styling         | Tailwind CSS                       |
| Animation       | Framer Motion                      |
| ORM             | Prisma                             |
| Database        | PostgreSQL via Supabase            |
| Auth (Operator) | NextAuth v5 (JWT Strategy)         |
| Auth (Customer) | JWT Cookie via `jose`              |
| Rate Limiting   | Upstash Redis + @upstash/ratelimit |
| Env Validation  | @t3-oss/env-nextjs                 |
| Unique ID       | nanoid                             |
| Validation      | Zod                                |
| Forms           | React Hook Form                    |
| Deploy          | Vercel                             |

---

## Arsitektur

### Multi-tenant Pattern

Semua tabel memiliki `workshopId` yang digunakan sebagai tenant identifier. Setiap query di dashboard operator selalu difilter dengan `workshopId` yang diambil dari session, tidak ada cara untuk mengakses data bengkel lain.

```typescript
// Contoh — semua query difilter workshopId
export async function getCustomers() {
  const workshopId = await getWorkshopId(); // dari session operator
  return prisma.customer.findMany({
    where: { workshopId }, // ← isolasi data
  });
}
```

### Auth Strategy

```
Operator  → NextAuth v5 (email/password) → JWT session
Customer  → Custom JWT Cookie (jose)     → httpOnly cookie "gc_token"
```

### Route Map

```
/                        → Landing page (publik)
/bengkel                 → List semua bengkel published
/bengkel/[slug]          → Profil detail bengkel
/bengkel/[slug]/order    → Form booking / walk-in

/masuk                   → Login customer
/daftar                  → Register customer
/akun                    → Dashboard customer
/akun/orders             → List semua order
/akun/orders/[id]        → Detail order + progress

/login                   → Login operator
/register                → Register bengkel baru
/dashboard               → Dashboard operator
/customers               → Manajemen pelanggan
/vehicles                → Manajemen kendaraan
/services                → Manajemen servis
/services/[id]           → Detail servis + item pekerjaan
/invoices                → Manajemen invoice
/invoices/create         → Buat invoice baru
/invoices/[id]           → Detail invoice + pembayaran
/bookings                → Kelola order masuk
/settings                → Pengaturan & profil publik bengkel
```

---

## Cara Menjalankan Lokal

### Prerequisites

- Node.js 18+
- npm atau yarn
- Akun [Supabase](https://supabase.com) (database)
- Akun [Upstash](https://upstash.com) (rate limiting) — opsional untuk development

### 1. Clone repository

```bash
git clone https://github.com/username/bengkelku.git
cd bengkelku
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Isi file `.env` dengan nilai yang sesuai (lihat tabel di bawah).

### 4. Setup database

```bash
# Jalankan migration
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Isi dummy data (opsional)
npx prisma db seed
```

### 5. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Buat file `.env` di root project dengan variabel berikut:

| Variable                   | Keterangan                                                 | Contoh                                                                                         |
| -------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | Connection string Supabase (transaction pooler, port 6543) | `postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL`               | Connection string Supabase (direct, port 5432)             | `postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:5432/postgres`                |
| `NEXTAUTH_SECRET`          | Secret untuk NextAuth JWT, minimal 32 karakter             | Generate: `openssl rand -base64 32`                                                            |
| `NEXTAUTH_URL`             | Base URL aplikasi                                          | `http://localhost:3000` (dev) / `https://domain.com` (prod)                                    |
| `UPSTASH_REDIS_REST_URL`   | URL Redis Upstash untuk rate limiting                      | `https://xxx.upstash.io`                                                                       |
| `UPSTASH_REDIS_REST_TOKEN` | Token Redis Upstash                                        | `AXxx...`                                                                                      |

Contoh file `.env.example`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Auth
NEXTAUTH_SECRET="your-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

---

## Akun Demo

Semua akun demo menggunakan password: **`password123`**

### Operator Accounts

| Email                     | Bengkel                      | Kota     | Status       |
| ------------------------- | ---------------------------- | -------- | ------------ |
| `owner@majujaya.com`      | Bengkel Maju Jaya Motor      | Jakarta  | Published ✅ |
| `owner@sejahteraauto.com` | Bengkel Sejahtera Auto       | Bandung  | Published ✅ |
| `owner@primamotor.com`    | Bengkel Prima Motor Surabaya | Surabaya | Published ✅ |
| `owner@karyamandiri.com`  | Bengkel Karya Mandiri        | Semarang | Draft 📝     |

### Customer Accounts

| Email             | Kendaraan                     | Order           |
| ----------------- | ----------------------------- | --------------- |
| `andi@gmail.com`  | 2 kendaraan (Vario 125, NMAX) | Booking pending |
| `siti@gmail.com`  | 1 kendaraan (Avanza)          | —               |
| `rizki@gmail.com` | 1 kendaraan (Beat)            | —               |
| `maya@gmail.com`  | 1 kendaraan (Ertiga)          | Order selesai   |

---

## Struktur Folder

```
bengkelku/
├── prisma/
│   ├── schema.prisma          # Database schema (10 models)
│   ├── seed.ts                # Dummy data seeder
│   └── migrations/            # Migration history
│
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & register OPERATOR
│   │   ├── (customer)/        # /masuk, /daftar, /akun CUSTOMER
│   │   ├── (dashboard)/       # Dashboard OPERATOR
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   ├── vehicles/
│   │   │   ├── services/
│   │   │   ├── invoices/
│   │   │   ├── bookings/
│   │   │   └── settings/
│   │   ├── bengkel/           # Halaman PUBLIK marketplace
│   │   │   └── [slug]/
│   │   │       └── order/     # Form booking & walk-in
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth handler
│   │   │   └── register/      # Register bengkel API
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   │
│   ├── components/
│   │   ├── landing/           # Hero, Features, HowItWorks, dll
│   │   ├── layout/            # Sidebar, Header dashboard
│   │   ├── ui/                # Badge, Modal, EmptyState
│   │   └── public-navbar.tsx  # Navbar halaman publik
│   │
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config (operator)
│   │   ├── global-customer-auth.ts  # JWT auth (customer)
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── rate-limit.ts      # Upstash rate limiter
│   │   ├── session.ts         # Session helpers
│   │   └── utils.ts           # Utility functions
│   │
│   ├── types/
│   │   └── next-auth.d.ts     # NextAuth type extensions
│   │
│   ├── env.ts                 # Env validation (@t3-oss)
│   └── middleware.ts          # Route protection
│
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Database Schema

```
Workshop          ← tenant utama
├── User          ← operator/mekanik per bengkel
├── Customer      ← pelanggan per bengkel
│   └── Vehicle   ← kendaraan milik pelanggan
│       └── Service        ← order servis
│           ├── ServiceItem ← item pekerjaan & parts
│           └── Invoice     ← tagihan
│               └── Payment ← pembayaran
├── WorkshopService ← layanan yang ditawarkan bengkel
└── Order          ← booking/walk-in dari marketplace

GlobalCustomer    ← akun pelanggan global (lintas bengkel)
└── Order         ← order yang dibuat customer
```

---

## Roadmap

### Sudah ada ✅

- [x] Multi-tenant SaaS architecture
- [x] Operator dashboard (CRUD lengkap)
- [x] Service order management
- [x] Invoice & payment tracking
- [x] Customer marketplace (cari bengkel, booking, walk-in)
- [x] Global customer account (1 akun lintas bengkel)
- [x] Rate limiting & env validation
- [x] Public workshop profile dengan SEO metadata
- [x] Print invoice
- [x] Dummy data seeder
- [x] Email verification saat register
- [x] Notifikasi WhatsApp (via Fonnte/WA Gateway)
- [x] Laporan keuangan — rekap pendapatan per bulan

### Direncanakan 🗓️

#### 🥈 Tier 2 — Nilai produk

- [ ] Review & rating bengkel dari pelanggan
- [ ] Export laporan ke PDF/Excel
- [ ] Upload foto kendaraan & hasil servis

#### 🥉 Tier 3 — Nice to have

- [ ] Manajemen stok spare part (inventory)
- [ ] Progressive Web App (PWA)
- [ ] Dark mode

---

## Contributing

Pull request sangat diterima. Untuk perubahan besar, buka issue dulu untuk diskusi.

1. Fork repository
2. Buat branch baru (`git checkout -b feat/nama-fitur`)
3. Commit perubahan (`git commit -m 'feat: tambah fitur X'`)
4. Push ke branch (`git push origin feat/nama-fitur`)
5. Buka Pull Request

---

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Dibuat dengan 😎🤙🎧 oleh <a href="https://github.com/naufalnak">Naufal Andresya</a></p>
  <p>
    <a href="https://saas-workshop-ruby.vercel.app/">Live Demo</a> ·
    <a href="https://github.com/naufalnak/saas-workshop/issues/new?labels=bug">Report Bug</a> ·
    <a href="https://github.com/naufalnak/saas-workshop/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>
