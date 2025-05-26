
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { MapPin, CreditCard, Truck } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

const CheckoutModal = ({ isOpen, onClose, items, onSuccess }: CheckoutModalProps) => {
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
    payment_method: 'cod',
    notes: '',
  });

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (!formData.shipping_address.trim()) {
      toast({
        title: "Alamat pengiriman diperlukan",
        description: "Mohon isi alamat pengiriman",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      await createOrder({
        items: orderItems,
        payment_method: formData.payment_method,
        shipping_address: formData.shipping_address,
        notes: formData.notes || undefined,
      });

      toast({
        title: "Pesanan berhasil dibuat!",
        description: "Terima kasih telah berbelanja di UMI Store",
      });

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        shipping_address: '',
        payment_method: 'cod',
        notes: '',
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Gagal membuat pesanan",
        description: "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Login Diperlukan</DialogTitle>
            <DialogDescription>
              Anda harus login terlebih dahulu untuk melanjutkan checkout
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Batal
            </Button>
            <Button onClick={() => window.location.href = '/auth'} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Checkout Pesanan
          </DialogTitle>
          <DialogDescription>
            Lengkapi informasi untuk menyelesaikan pesanan Anda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-emerald-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MapPin size={16} />
              Alamat Pengiriman
            </Label>
            <Textarea
              placeholder="Masukkan alamat lengkap untuk pengiriman..."
              value={formData.shipping_address}
              onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
              required
              rows={3}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CreditCard size={16} />
              Metode Pembayaran
            </Label>
            <RadioGroup
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Truck size={16} />
                    <div>
                      <p className="font-medium">Bayar di Tempat (COD)</p>
                      <p className="text-sm text-gray-600">Bayar saat barang diterima</p>
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} />
                    <div>
                      <p className="font-medium">Transfer Bank</p>
                      <p className="text-sm text-gray-600">Transfer ke rekening toko</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan untuk pesanan..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              disabled={loading}
            >
              {loading ? 'Memproses...' : `Pesan Sekarang (${formatPrice(totalAmount)})`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
