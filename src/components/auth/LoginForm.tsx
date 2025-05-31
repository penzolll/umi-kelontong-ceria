
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoginForm = ({ loading, setLoading }: LoginFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    console.log('Login form submitted');
    setLoading(true);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login gagal';
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Email belum dikonfirmasi';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Login gagal",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Login successful');
        toast({
          title: "Login berhasil!",
          description: "Selamat datang di UMI Store",
        });
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast({
        title: "Terjadi kesalahan",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            className="pl-10"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600"
        disabled={loading}
      >
        {loading ? 'Memproses...' : 'Masuk'}
      </Button>
    </form>
  );
};
