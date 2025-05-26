
import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  userName?: string;
}

const Header = ({ cartItemsCount, onCartClick, onLoginClick, isLoggedIn, userName }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <span className="text-white font-bold text-xl">UMI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">UMI Store</h1>
              <p className="text-xs text-gray-600">Toko Kelontong Terpercaya</p>
            </div>
          </div>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bg-emerald-500 hover:bg-emerald-600"
              >
                <Search size={16} />
              </Button>
            </div>
          </form>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* User account */}
            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="hidden md:flex items-center space-x-2"
            >
              <User size={20} />
              <span>{isLoggedIn ? userName : 'Masuk'}</span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1 bg-emerald-500 hover:bg-emerald-600"
            >
              <Search size={16} />
            </Button>
          </div>
        </form>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t pt-4 pb-4">
            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="w-full justify-start"
            >
              <User size={20} className="mr-2" />
              {isLoggedIn ? userName : 'Masuk'}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
