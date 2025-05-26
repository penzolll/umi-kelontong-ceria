
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string | null;
    unit: string;
  };
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  total_amount: number;
  shipping_address: string;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              name,
              image_url,
              unit
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const createOrder = async (orderData: {
    items: Array<{ product_id: string; quantity: number; price: number }>;
    payment_method: string;
    shipping_address: string;
    notes?: string;
  }) => {
    if (!user) throw new Error('User must be logged in');

    const total_amount = orderData.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          payment_method: orderData.payment_method,
          total_amount,
          shipping_address: orderData.shipping_address,
          notes: orderData.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Refresh orders
      await fetchOrders();
      
      return { success: true, order };
    } catch (err) {
      throw err;
    }
  };

  return { orders, loading, error, createOrder, refetch: fetchOrders };
};
