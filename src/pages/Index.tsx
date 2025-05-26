
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import HeroSection from '@/components/HeroSection';
import ProductSearch from '@/components/ProductSearch';
import CheckoutModal from '@/components/CheckoutModal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { products, loading } = useProducts();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Filter products based on selected category and search query
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  // Get cart item quantity for a product
  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Add product to cart
  const handleAddToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCartItems(prev => prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        toast({
          title: "Berhasil!",
          description: `${product.name} ditambahkan ke keranjang`,
        });
      } else {
        toast({
          title: "Stok tidak cukup",
          description: "Maaf, stok produk sudah habis",
          variant: "destructive",
        });
      }
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '/placeholder.svg',
        quantity: 1,
        unit: product.unit,
      };
      setCartItems(prev => [...prev, newItem]);
      toast({
        title: "Berhasil!",
        description: `${product.name} ditambahkan ke keranjang`,
      });
    }
  };

  // Update quantity in cart
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
      toast({
        title: "Produk dihapus",
        description: "Produk telah dihapus dari keranjang",
      });
    } else {
      const product = products.find(p => p.id === productId);
      if (product && newQuantity <= product.stock) {
        setCartItems(prev => prev.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        toast({
          title: "Stok tidak cukup",
          description: "Jumlah melebihi stok yang tersedia",
          variant: "destructive",
        });
      }
    }
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Produk dihapus",
      description: "Produk telah dihapus dari keranjang",
    });
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      toast({
        title: "Login diperlukan",
        description: "Silakan login terlebih dahulu untuk melanjutkan checkout",
      });
      return;
    }
    
    setIsCheckoutModalOpen(true);
  };

  // Handle successful order
  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari akun",
    });
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getCategoryName = (categoryId: string) => {
    const categories = {
      'all': 'Semua Produk',
      'sembako': 'Sembako',
      'minuman': 'Minuman',
      'rokok': 'Rokok',
      'obat': 'Obat & Kesehatan',
      'kosmetik': 'Kosmetik',
      'sabun': 'Sabun & Deterjen',
      'snack': 'Snack'
    };
    return categories[categoryId as keyof typeof categories] || 'Semua Produk';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={totalCartItems}
        onCartClick={() => {}}
        onLoginClick={() => navigate('/auth')}
        isLoggedIn={!!user}
        userName={user?.email?.split('@')[0]}
        onLogout={handleLogout}
      />
      
      <CategoryNav
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Products Section */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getCategoryName(selectedCategory)}
                </h2>
                <span className="text-gray-600">
                  {filteredProducts.length} produk ditemukan
                </span>
              </div>
              
              <ProductSearch 
                onSearch={setSearchQuery}
                placeholder="Cari produk..."
              />
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: Number(product.price),
                      originalPrice: product.original_price ? Number(product.original_price) : undefined,
                      image: product.image_url || '/placeholder.svg',
                      category: product.category,
                      stock: product.stock,
                      description: product.description || '',
                      unit: product.unit,
                    }}
                    cartQuantity={getCartQuantity(product.id)}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan</p>
                <p className="text-gray-400">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            )}
          </div>
          
          {/* Cart Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-80">
            <div className="sticky top-32">
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Cart Sheet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg">
              <span className="text-sm font-medium">
                Keranjang ({totalCartItems})
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-md">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Orders Link */}
      {user && (
        <div className="fixed bottom-4 left-4 z-50">
          <Link to="/orders">
            <Button variant="outline" className="bg-white shadow-lg">
              Riwayat Pesanan
            </Button>
          </Link>
        </div>
      )}
      
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={cartItems}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default Index;
