
# 🚀 Panduan Deployment UMI Store

## Prasyarat
- Akun [Supabase](https://supabase.com)
- Akun [Netlify](https://netlify.com) atau [Vercel](https://vercel.com)
- Node.js 18+ (untuk development lokal)

## 📋 Setup Supabase

### 1. Buat Project Supabase Baru
1. Masuk ke [Supabase Dashboard](https://app.supabase.com)
2. Klik "New Project"
3. Pilih organization dan beri nama project
4. Pilih region (Singapore untuk Indonesia)
5. Buat password database yang kuat
6. Tunggu project selesai dibuat

### 2. Konfigurasi Database (Tahap Bertahap)

**⚠️ PENTING: Jalankan setiap tahap secara terpisah di SQL Editor Supabase**

#### 🔸 Tahap 1: Schema Dasar
Jalankan query berikut di SQL Editor:

```sql
-- Buat enum untuk role
CREATE TYPE app_role AS ENUM ('customer', 'admin');

-- Buat tabel profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT
);

-- Buat tabel user_roles
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Buat tabel categories
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Buat tabel products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pcs',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Buat tabel orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  shipping_address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Buat tabel order_items
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

**Verifikasi Tahap 1:**
```sql
-- Cek apakah semua tabel berhasil dibuat
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'user_roles', 'categories', 'products', 'orders', 'order_items');
```

#### 🔸 Tahap 2: Functions dan Sequences
Jalankan setelah Tahap 1 berhasil:

```sql
-- Buat sequence untuk nomor pesanan
CREATE SEQUENCE order_sequence START 1;

-- Buat function untuk generate nomor pesanan
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN 'UMI-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 4, '0');
END;
$function$

-- Buat function untuk set nomor pesanan
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$function$

-- Buat function untuk cek role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$function$

-- Buat function untuk handle user baru
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$function$
```

**Verifikasi Tahap 2:**
```sql
-- Cek apakah functions berhasil dibuat
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('generate_order_number', 'set_order_number', 'has_role', 'handle_new_user');
```

#### 🔸 Tahap 3: Triggers dan Constraints
Jalankan setelah Tahap 2 berhasil:

```sql
-- Buat trigger untuk user baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Buat trigger untuk nomor pesanan
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Foreign key constraints
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;
```

**Verifikasi Tahap 3:**
```sql
-- Cek apakah triggers berhasil dibuat
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

#### 🔸 Tahap 4: Storage dan RLS
Jalankan setelah Tahap 3 berhasil:

```sql
-- Buat storage bucket untuk gambar produk
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Enable RLS pada semua tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
```

**Verifikasi Tahap 4:**
```sql
-- Cek apakah storage bucket berhasil dibuat
SELECT id, name, public FROM storage.buckets WHERE id = 'product-images';

-- Cek RLS status
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

#### 🔸 Tahap 5: RLS Policies - Products dan Categories
Jalankan setelah Tahap 4 berhasil:

```sql
-- RLS Policies untuk products
CREATE POLICY "Anyone can view active products" ON public.products
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all products" ON public.products
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies untuk categories
CREATE POLICY "Anyone can view active categories" ON public.categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all categories" ON public.categories
FOR ALL USING (has_role(auth.uid(), 'admin'));
```

#### 🔸 Tahap 6: RLS Policies - Orders dan Order Items
Jalankan setelah Tahap 5 berhasil:

```sql
-- RLS Policies untuk orders
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all orders" ON public.orders
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies untuk order_items
CREATE POLICY "Users can view their order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create order items for their orders" ON public.order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all order items" ON public.order_items
FOR ALL USING (has_role(auth.uid(), 'admin'));
```

#### 🔸 Tahap 7: RLS Policies - Profiles dan Storage
Jalankan setelah Tahap 6 berhasil:

```sql
-- RLS Policies untuk profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND 
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND 
  has_role(auth.uid(), 'admin')
);
```

**Verifikasi Final:**
```sql
-- Cek semua policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' OR schemaname = 'storage';

-- Test function has_role
SELECT public.has_role('00000000-0000-0000-0000-000000000000'::uuid, 'admin'::app_role);
```

### 3. Buat User Admin Pertama
Setelah semua tahap database selesai:

1. Daftar akun baru melalui aplikasi
2. Masuk ke SQL Editor dan jalankan:
```sql
-- Ganti 'email@admin.com' dengan email admin yang sudah didaftarkan
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'email@admin.com'
);
```

### 4. Konfigurasi Authentication
1. Masuk ke Authentication > Settings
2. Disable "Enable email confirmations" untuk testing
3. Set Site URL ke domain production Anda
4. Set Redirect URLs ke domain production Anda

## 🚀 Deployment ke Netlify

### 1. Build Project
```bash
npm install
npm run build
```

### 2. Deploy ke Netlify
1. Masuk ke [Netlify](https://netlify.com)
2. Drag & drop folder `dist` ke deploy area
3. Atau connect dengan GitHub repository

### 3. Environment Variables
Di Netlify Dashboard > Site Settings > Environment Variables, tambahkan:
- `VITE_SUPABASE_URL`: URL project Supabase Anda
- `VITE_SUPABASE_ANON_KEY`: Anon key dari Supabase

### 4. Build Settings
- Build command: `npm run build`
- Publish directory: `dist`

## 🚀 Deployment ke Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
vercel --prod
```

### 3. Environment Variables
Di Vercel Dashboard > Project > Settings > Environment Variables, tambahkan:
- `VITE_SUPABASE_URL`: URL project Supabase Anda
- `VITE_SUPABASE_ANON_KEY`: Anon key dari Supabase

## 📱 Testing Production

### Test Flow Customer:
1. Daftar akun baru
2. Browse produk
3. Tambah ke keranjang
4. Checkout pesanan
5. Lihat history pesanan

### Test Flow Admin:
1. Login dengan akun admin
2. Tambah kategori baru
3. Tambah produk dengan gambar
4. Kelola pesanan customer
5. Update status pesanan

## 🛠️ Maintenance

### Backup Database
```bash
# Install Supabase CLI
npm install -g supabase
supabase login
supabase db dump --project-ref YOUR_PROJECT_REF
```

### Monitor Usage
- Cek dashboard Supabase untuk usage metrics
- Monitor storage usage untuk gambar produk
- Review authentication logs

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Pastikan environment variables sudah benar
- Cek apakah anon key masih valid di Supabase dashboard

### Error: "Row Level Security"
- Pastikan user sudah login
- Cek apakah RLS policies sudah benar
- Jalankan tahap deployment secara berurutan

### Error: Upload gambar gagal
- Cek apakah storage bucket sudah dibuat (Tahap 4)
- Pastikan user memiliki role admin
- Verifikasi storage policies (Tahap 7)

### Error: Functions tidak ditemukan
- Pastikan Tahap 2 sudah dijalankan dengan benar
- Verifikasi dengan query verifikasi yang disediakan

### Tips Debugging:
1. **Jika ada error di tahap manapun**: Berhenti dan perbaiki sebelum lanjut
2. **Gunakan query verifikasi**: Setiap tahap memiliki query untuk memastikan berhasil
3. **Cek logs**: Supabase Dashboard > Logs untuk detail error
4. **Rollback jika perlu**: Drop table/function yang bermasalah dan ulangi tahap tersebut

## 📞 Support
Untuk bantuan lebih lanjut, cek dokumentasi:
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
