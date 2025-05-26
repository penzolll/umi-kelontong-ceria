
# 🏪 UMI Store - Sistem Manajemen Toko Kelontong Modern

Aplikasi web lengkap untuk mengelola toko kelontong dengan fitur e-commerce modern, dashboard admin, dan sistem manajemen inventory yang terintegrasi.

## ✨ Fitur Utama

### 🛍️ Frontend Customer
- **Katalog Produk** dengan pencarian dan filter kategori
- **Keranjang Belanja** dengan perhitungan otomatis
- **Checkout System** dengan berbagai metode pembayaran
- **History Pesanan** dengan tracking status
- **Responsive Design** untuk semua perangkat
- **Interface Bahasa Indonesia** yang user-friendly

### 👨‍💼 Dashboard Admin
- **Manajemen Produk** dengan upload gambar
- **Manajemen Kategori** produk
- **Kelola Pesanan** dengan update status real-time
- **Statistik Penjualan** dan analytics
- **User Management** dengan role-based access
- **Inventory Tracking** dengan alert stock rendah

### 🔐 Sistem Keamanan
- **Authentication** dengan email/password
- **Role-based Access Control** (Admin vs Customer)
- **Row-Level Security** pada database
- **Secure File Upload** untuk gambar produk

## 🛠️ Teknologi

### Frontend
- **React 18** dengan TypeScript
- **Tailwind CSS** untuk styling responsive
- **Shadcn/UI** untuk komponen UI modern
- **React Router** untuk navigasi
- **React Query** untuk state management
- **Lucide React** untuk ikon

### Backend
- **Supabase** sebagai Backend-as-a-Service
- **PostgreSQL** database dengan RLS
- **Real-time subscriptions** untuk update live
- **File Storage** untuk gambar produk
- **Edge Functions** untuk logika server

### Deployment
- **Netlify/Vercel** untuk hosting frontend
- **Supabase Cloud** untuk backend
- **CDN** untuk delivery gambar optimal

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd umi-store
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan kredensial Supabase Anda
```

### 3. Setup Supabase
Ikuti panduan lengkap di [DEPLOYMENT.md](./DEPLOYMENT.md)

### 4. Development
```bash
npm run dev
```

### 5. Build Production
```bash
npm run build
npm run preview
```

## 📁 Struktur Project

```
src/
├── components/           # Komponen reusable
│   ├── admin/           # Komponen khusus admin
│   └── ui/              # UI components (shadcn)
├── hooks/               # Custom React hooks
├── pages/               # Halaman utama aplikasi
├── integrations/        # Integrasi Supabase
└── lib/                 # Utility functions

public/                  # Static assets
docs/                   # Dokumentasi
```

## 🔑 Akun Default

Setelah setup, buat akun admin pertama:
1. Daftar melalui interface aplikasi
2. Update role ke admin via SQL:
```sql
UPDATE user_roles SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@email.com');
```

## 📊 Use Cases Nyata

### Untuk Toko Kelontong
- ✅ **Inventory Management**: Track stok real-time
- ✅ **Point of Sale**: Sistem kasir digital
- ✅ **Customer Orders**: Pesanan online/delivery
- ✅ **Sales Analytics**: Laporan penjualan harian/bulanan
- ✅ **Multi-user**: Kasir dan manager terpisah

### Untuk UMKM
- ✅ **Katalog Online**: Tampilkan produk ke customer
- ✅ **Order Management**: Kelola pesanan dengan mudah
- ✅ **Customer Database**: Data customer terintegrasi
- ✅ **Mobile Friendly**: Akses dari HP kapan saja
- ✅ **Cost Effective**: Tidak perlu server sendiri

## 🔧 Kustomisasi

### Mengubah Branding
1. Edit nama toko di `src/components/Header.tsx`
2. Ganti logo di folder `public/`
3. Sesuaikan warna tema di `tailwind.config.ts`

### Menambah Fitur Pembayaran
1. Integrasikan dengan payment gateway (Midtrans, dll)
2. Tambah edge function untuk webhook
3. Update komponen checkout

### Menambah Kategori Produk
1. Masuk ke admin dashboard
2. Pilih tab "Kategori"
3. Tambah kategori baru

## 📈 Skalabilitas

Aplikasi ini dapat berkembang untuk:
- **Multi-store**: Beberapa toko dalam satu sistem
- **Advanced Analytics**: Dashboard yang lebih detail
- **Mobile App**: React Native app
- **POS Integration**: Integrasi dengan printer kasir
- **Loyalty Program**: Program reward customer
- **Subscription Model**: Model berlangganan

## 🐛 Troubleshooting

### Error Umum
1. **Build Error**: Pastikan semua dependencies terinstall
2. **Auth Error**: Cek konfigurasi Supabase
3. **Upload Error**: Periksa storage bucket permissions
4. **RLS Error**: Verifikasi Row Level Security policies

### Performance
- Gambar produk otomatis ter-optimize via Supabase CDN
- React Query meng-cache data untuk performa optimal
- Lazy loading untuk komponen besar

## 📚 Resources

- [Dokumentasi Deployment](./DEPLOYMENT.md)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - bebas digunakan untuk project komersial dan non-komersial.

## 📞 Support

Untuk pertanyaan dan support:
- Buat issue di GitHub repository
- Email: support@umistore.com
- WhatsApp: +62-xxx-xxx-xxxx

---

**UMI Store** - Memberdayakan UMKM Indonesia dengan teknologi modern 🇮🇩
