
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const categories = [
  { id: 'all', name: 'Semua Produk', emoji: '🛒' },
  { id: 'sembako', name: 'Sembako', emoji: '🌾' },
  { id: 'minuman', name: 'Minuman', emoji: '🥤' },
  { id: 'rokok', name: 'Rokok', emoji: '🚬' },
  { id: 'obat', name: 'Obat & Kesehatan', emoji: '💊' },
  { id: 'kosmetik', name: 'Kosmetik', emoji: '💄' },
  { id: 'sabun', name: 'Sabun & Deterjen', emoji: '🧼' },
  { id: 'snack', name: 'Snack', emoji: '🍿' },
];

interface CategoryNavProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryNav = ({ selectedCategory, onCategorySelect }: CategoryNavProps) => {
  return (
    <div className="bg-white border-b sticky top-[88px] z-40">
      <div className="container mx-auto px-4 py-3">
        <ScrollArea className="w-full">
          <div className="flex space-x-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => onCategorySelect(category.id)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "hover:bg-emerald-50"
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryNav;
