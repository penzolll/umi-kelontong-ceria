
import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import HeroSection from '@/components/HeroSection';
import LoginModal from '@/components/LoginModal';
import { products } from '@/data/products';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
}

interface User {
  email: string;
  name: string;
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

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
        image: product.image,
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
      setIsLoginModalOpen(true);
      toast({
        title: "Login diperlukan",
        description: "Silakan login terlebih dahulu untuk melanjutkan checkout",
      });
      return;
    }
    
    toast({
      title: "Checkout berhasil!",
      description: "Pesanan Anda sedang diproses",
    });
    setCartItems([]);
  };

  // Handle login
  const handleLogin = (email: string, password: string) => {
    // Simulate login
    setUser({ email, name: email.split('@')[0] });
    setIsLoginModalOpen(false);
    toast({
      title: "Login berhasil!",
      description: `Selamat datang, ${email.split('@')[0]}!`,
    });
  };

  // Handle register
  const handleRegister = (email: string, password: string, name: string) => {
    // Simulate registration
    setUser({ email, name });
    setIsLoginModalOpen(false);
    toast({
      title: "Registrasi berhasil!",
      description: `Selamat datang, ${name}!`,
    });
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={totalCartItems}
        onCartClick={() => {}}
        onLoginClick={() => setIsLoginModalOpen(true)}
        isLoggedIn={!!user}
        userName={user?.name}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? 'Semua Produk' : 
                 selectedCategory === 'sembako' ? 'Sembako' :
                 selectedCategory === 'minuman' ? 'Minuman' :
                 selectedCategory === 'rokok' ? 'Rokok' :
                 selectedCategory === 'obat' ? 'Obat & Kesehatan' :
                 selectedCategory === 'kosmetik' ? 'Kosmetik' :
                 selectedCategory === 'sabun' ? 'Sabun & Deterjen' :
                 'Snack'}
              </h2>
              <span className="text-gray-600">
                {filteredProducts.length} produk ditemukan
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={getCartQuantity(product.id)}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </div>
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
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default Index;
