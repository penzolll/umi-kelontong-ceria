
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User } from 'lucide-react';

interface RegisterFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const RegisterForm = ({ loading, setLoading }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [registerForm, setRegisterForm] = useState({ 
    email: '', 
    password: '', 
    fullName: '',
    confirmPassword: '' 
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama",
        variant: "destructive",
      });
      return;
    }
    
    if (registerForm.password.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Register form submitted');
    setLoading(true);
    
    try {
      const { error } = await signUp(
        registerForm.email, 
        registerForm.password, 
        registerForm.fullName
      );
      
      if (error) {
        console.error('Register error:', error);
        let errorMessage = 'Registrasi gagal';
        
        if (error.message?.includes('already registered')) {
          errorMessage = 'Email sudah terdaftar';
        } else if (error.message?.includes('Password should be at least')) {
          errorMessage = 'Password minimal 6 karakter';
        } else if (error.message?.includes('Invalid email')) {
          errorMessage = 'Format email tidak valid';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Registrasi gagal",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Registration successful');
        toast({
          title: "Registrasi berhasil!",
          description: "Akun Anda telah dibuat. Selamat datang di UMI Store!",
        });
      }
    } catch (error) {
      console.error('Register exception:', error);
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
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nama Lengkap</Label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-3 text-gray-400" />
          <Input
            id="fullName"
            type="text"
            placeholder="Nama Lengkap"
            className="pl-10"
            value={registerForm.fullName}
            onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registerEmail">Email</Label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
          <Input
            id="registerEmail"
            type="email"
            placeholder="nama@email.com"
            className="pl-10"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registerPassword">Password</Label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
          <Input
            id="registerPassword"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            required
            minLength={6}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            required
            minLength={6}
            disabled={loading}
          />
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600"
        disabled={loading}
      >
        {loading ? 'Memproses...' : 'Daftar'}
      </Button>
    </form>
  );
};
