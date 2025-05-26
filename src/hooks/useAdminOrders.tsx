
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  user_id: string;
  order_items: OrderItem[];
  profiles: {
    full_name: string | null;
    username: string | null;
  } | null;
}

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profile data separately for each order
      const ordersWithProfiles = await Promise.all(
        ((data as any) || []).map(async (order: any) => {
          const { data: profileData } = await (supabase as any)
            .from('profiles')
            .select('full_name, username')
            .eq('id', order.user_id)
            .single();

          return {
            ...order,
            profiles: profileData || null
          };
        })
      );

      setOrders(ordersWithProfiles as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() } as any)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      await fetchOrders();
      return { success: true, data };
    } catch (err) {
      throw err;
    }
  };

  const getOrderStats = async () => {
    try {
      // Get total orders
      const { count: totalOrders } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
      const { data: revenueData } = await (supabase as any)
        .from('orders')
        .select('total_amount')
        .eq('status', 'delivered');

      const totalRevenue = (revenueData as any)?.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0) || 0;

      // Get pending orders
      const { count: pendingOrders } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get today's orders
      const today = new Date().toISOString().split('T')[0];
      const { count: todayOrders } = await (supabase as any)
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      return {
        totalOrders: totalOrders || 0,
        totalRevenue,
        pendingOrders: pendingOrders || 0,
        todayOrders: todayOrders || 0
      };
    } catch (err) {
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    getOrderStats,
    refetch: fetchOrders
  };
};
