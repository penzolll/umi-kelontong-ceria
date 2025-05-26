
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const ProductCard = ({ product, cartQuantity, onAddToCart, onUpdateQuantity }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            -{discount}%
          </Badge>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge variant="outline" className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
            Stok terbatas
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Habis
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
        
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-emerald-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {product.stock === 0 ? (
          <Button disabled className="w-full">
            Stok Habis
          </Button>
        ) : cartQuantity === 0 ? (
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            <ShoppingCart size={16} className="mr-2" />
            Tambah ke Keranjang
          </Button>
        ) : (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(product.id, cartQuantity - 1)}
            >
              <Minus size={16} />
            </Button>
            <span className="font-semibold px-4">{cartQuantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}
              disabled={cartQuantity >= product.stock}
            >
              <Plus size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
