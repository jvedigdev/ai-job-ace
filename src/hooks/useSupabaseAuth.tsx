import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseUser {
  id: string;
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export function useSupabaseAuth() {
  const { user: clerkUser, isLoaded } = useUser();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const setupSupabaseAuth = async () => {
      if (clerkUser) {
        try {
          // Get JWT token from Clerk
          const token = await (clerkUser as any).getToken({ template: 'supabase' });
          
          if (token) {
            // Set the JWT token for Supabase requests
            supabase.realtime.setAuth(token);
            
            // Fetch or create user profile
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('clerk_user_id', clerkUser.id)
              .maybeSingle();

            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
            } else if (profile) {
              setSupabaseUser(profile);
            } else {
              // Profile doesn't exist, it will be created by webhook
              console.log('Profile not found, webhook should create it');
            }
          }
        } catch (error) {
          console.error('Error setting up Supabase auth:', error);
        }
      } else {
        setSupabaseUser(null);
      }
      
      setLoading(false);
    };

    setupSupabaseAuth();
  }, [clerkUser, isLoaded]);

  return { 
    supabaseUser, 
    loading: loading || !isLoaded,
    isAuthenticated: !!clerkUser && !!supabaseUser
  };
}