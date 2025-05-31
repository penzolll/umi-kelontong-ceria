
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authCleanup';

export const useAuthActions = () => {
  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout failed (continuing anyway):', err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in result:', { data: data?.user?.email, error });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      // Let the auth state change handler handle the redirect
      return { error: null };
    } catch (err) {
      console.error('Sign in exception:', err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Attempting sign up for:', email);
    
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout failed (continuing anyway):', err);
      }
      
      const redirectUrl = `${window.location.origin}/`;
      console.log('Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });
      
      console.log('Sign up result:', { data: data?.user?.email, error });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }
      
      // For email confirmation disabled, user should be signed in immediately
      if (data?.user && data?.session) {
        console.log('User signed up and logged in immediately');
        // Let the auth state change handler handle the redirect
        return { error: null };
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign up exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('Attempting sign out');
    
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout failed (continuing anyway):', err);
      }
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even if signout fails
      window.location.href = '/auth';
    }
  };

  const signInWithGoogle = async () => {
    console.log('Attempting Google sign in');
    
    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout failed (continuing anyway):', err);
      }
      
      const redirectUrl = `${window.location.origin}/`;
      console.log('Using Google redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      console.log('Google sign in result:', { error });
      
      return { error };
    } catch (err) {
      console.error('Google sign in exception:', err);
      return { error: err };
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
};
