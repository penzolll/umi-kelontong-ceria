
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAdmin } from '@/hooks/useAdmin';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogout?: () => void;
}

const Header = ({ cartItemsCount, onCartClick, onLoginClick, isLoggedIn, userName, onLogout }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleOrdersClick = () => {
    navigate('/orders');
    setIsMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setIsMobileMenuOpen(false);
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

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* User account */}
            {isLoggedIn && userName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center space-x-2">
                    <User size={20} />
                    <span className="capitalize">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleOrdersClick}>
                    Riwayat Pesanan
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={handleAdminClick}>
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={onLoginClick}
                className="hidden md:flex items-center space-x-2"
              >
                <User size={20} />
                <span>Masuk</span>
              </Button>
            )}

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

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t pt-4 pb-4">
            {isLoggedIn && userName ? (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={handleOrdersClick}
                  className="w-full justify-start"
                >
                  <User size={20} className="mr-2" />
                  Riwayat Pesanan
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    onClick={handleAdminClick}
                    className="w-full justify-start"
                  >
                    <User size={20} className="mr-2" />
                    Admin Panel
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="w-full justify-start text-red-600"
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={onLoginClick}
                className="w-full justify-start"
              >
                <User size={20} className="mr-2" />
                Masuk
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
