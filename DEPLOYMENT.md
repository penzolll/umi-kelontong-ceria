
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

### 2. Konfigurasi Database
Jalankan SQL berikut di SQL Editor Supabase:

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

-- Buat trigger untuk user baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Buat trigger untuk nomor pesanan
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Buat storage bucket untuk gambar produk
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

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

-- Foreign key constraints
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;
```

### 3. Buat User Admin Pertama
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

### Error: Upload gambar gagal
- Cek apakah storage bucket sudah dibuat
- Pastikan user memiliki role admin

## 📞 Support
Untuk bantuan lebih lanjut, cek dokumentasi:
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
