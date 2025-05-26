
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  description: string;
  unit: string;
}

export const products: Product[] = [
  // Sembako
  {
    id: '1',
    name: 'Beras Premium 5kg',
    price: 75000,
    originalPrice: 85000,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop',
    category: 'sembako',
    stock: 25,
    description: 'Beras premium berkualitas tinggi, pulen dan wangi',
    unit: '5kg'
  },
  {
    id: '2',
    name: 'Minyak Goreng Tropical 1L',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop',
    category: 'sembako',
    stock: 30,
    description: 'Minyak goreng berkualitas untuk memasak sehari-hari',
    unit: '1 Liter'
  },
  {
    id: '3',
    name: 'Gula Pasir 1kg',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop',
    category: 'sembako',
    stock: 20,
    description: 'Gula pasir putih bersih untuk kebutuhan dapur',
    unit: '1kg'
  },
  {
    id: '4',
    name: 'Tepung Terigu Segitiga Biru 1kg',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop',
    category: 'sembako',
    stock: 15,
    description: 'Tepung terigu protein sedang untuk aneka kue dan masakan',
    unit: '1kg'
  },
  
  // Minuman
  {
    id: '5',
    name: 'Air Mineral Aqua 1500ml',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop',
    category: 'minuman',
    stock: 50,
    description: 'Air mineral berkualitas untuk kebutuhan sehari-hari',
    unit: '1.5 Liter'
  },
  {
    id: '6',
    name: 'Teh Botol Sosro 450ml',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop',
    category: 'minuman',
    stock: 40,
    description: 'Teh manis segar dalam kemasan botol',
    unit: '450ml'
  },
  {
    id: '7',
    name: 'Kopi Kapal Api Mix 10 sachet',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop',
    category: 'minuman',
    stock: 25,
    description: 'Kopi instant dengan rasa yang nikmat',
    unit: '10 sachet'
  },
  
  // Rokok
  {
    id: '8',
    name: 'Gudang Garam Merah',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=300&fit=crop',
    category: 'rokok',
    stock: 30,
    description: 'Rokok kretek premium dengan cita rasa khas Indonesia',
    unit: '1 bungkus'
  },
  {
    id: '9',
    name: 'Marlboro Merah',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=300&fit=crop',
    category: 'rokok',
    stock: 25,
    description: 'Rokok filter internasional berkualitas',
    unit: '1 bungkus'
  },
  
  // Obat & Kesehatan
  {
    id: '10',
    name: 'Paracetamol 500mg',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'obat',
    stock: 20,
    description: 'Obat penurun panas dan pereda nyeri',
    unit: '1 strip (10 tablet)'
  },
  {
    id: '11',
    name: 'Betadine 30ml',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'obat',
    stock: 15,
    description: 'Antiseptik untuk luka dan iritasi kulit',
    unit: '30ml'
  },
  {
    id: '12',
    name: 'Tolak Angin 15ml',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'obat',
    stock: 30,
    description: 'Jamu tradisional untuk masuk angin',
    unit: '15ml'
  },
  
  // Kosmetik
  {
    id: '13',
    name: 'Wardah Lightening Day Cream',
    price: 35000,
    originalPrice: 40000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'kosmetik',
    stock: 12,
    description: 'Krim wajah pencerah untuk pemakaian siang hari',
    unit: '30g'
  },
  {
    id: '14',
    name: 'Pond\'s Facial Wash 100g',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'kosmetik',
    stock: 18,
    description: 'Sabun cuci muka untuk membersihkan wajah',
    unit: '100g'
  },
  
  // Sabun & Deterjen
  {
    id: '15',
    name: 'Sabun Lifebuoy 85g',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'sabun',
    stock: 50,
    description: 'Sabun mandi antibakteri untuk perlindungan keluarga',
    unit: '85g'
  },
  {
    id: '16',
    name: 'Rinso Deterjen Bubuk 770g',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'sabun',
    stock: 20,
    description: 'Deterjen bubuk untuk mencuci pakaian bersih',
    unit: '770g'
  },
  
  // Snack
  {
    id: '17',
    name: 'Chitato Rasa Sapi Panggang',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'snack',
    stock: 35,
    description: 'Keripik kentang rasa sapi panggang yang gurih',
    unit: '68g'
  },
  {
    id: '18',
    name: 'Oreo Original 137g',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'snack',
    stock: 25,
    description: 'Biskuit sandwich coklat yang lezat',
    unit: '137g'
  }
];
