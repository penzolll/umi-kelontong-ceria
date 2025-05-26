
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Truck, Clock, Shield } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Belanja Kebutuhan Rumah Tangga
              <span className="block text-emerald-200">Mudah & Terpercaya</span>
            </h1>
            <p className="text-xl mb-6 text-emerald-100">
              Dapatkan sembako, minuman, obat, kosmetik, dan kebutuhan harian lainnya 
              dengan kualitas terbaik dan harga yang terjangkau.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
            >
              <ShoppingCart size={20} className="mr-2" />
              Mulai Belanja Sekarang
            </Button>
          </div>
          
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=400&fit=crop"
              alt="Fresh groceries"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <Truck size={32} className="mx-auto mb-2 text-emerald-200" />
            <h3 className="font-semibold">Gratis Ongkir</h3>
            <p className="text-sm text-emerald-200">Untuk pembelian minimal</p>
          </div>
          <div className="text-center">
            <Clock size={32} className="mx-auto mb-2 text-emerald-200" />
            <h3 className="font-semibold">Pengiriman Cepat</h3>
            <p className="text-sm text-emerald-200">Same day delivery</p>
          </div>
          <div className="text-center">
            <Shield size={32} className="mx-auto mb-2 text-emerald-200" />
            <h3 className="font-semibold">Produk Berkualitas</h3>
            <p className="text-sm text-emerald-200">Dijamin fresh & original</p>
          </div>
          <div className="text-center">
            <ShoppingCart size={32} className="mx-auto mb-2 text-emerald-200" />
            <h3 className="font-semibold">Mudah Berbelanja</h3>
            <p className="text-sm text-emerald-200">Interface yang user-friendly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
