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
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isClerkLoaded) {
      setLoading(true);
      return;
    }

    const setupSupabaseAuth = async () => {
      if (clerkUser) {
        try {
          // Get JWT token from Clerk
          const token = await (clerkUser as any).getToken({ template: 'supabase' });
          
          if (token) {
            // Set the JWT token for Supabase requests
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: token, // Supabase expects a refresh token, using access token for simplicity with Clerk
            });

            if (setSessionError) {
              console.error('Error setting Supabase session:', setSessionError);
              setIsAuthenticated(false);
              setSupabaseUser(null);
              setLoading(false);
              return;
            }

            // Fetch or create user profile
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('clerk_user_id', clerkUser.id)
              .maybeSingle();

            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
              console.error('Error fetching profile:', error);
              setIsAuthenticated(false);
              setSupabaseUser(null);
            } else if (profile) {
              setSupabaseUser(profile);
              setIsAuthenticated(true);
            } else {
              // Profile doesn't exist, it will be created by webhook or on first sign-in
              // For now, we can consider them authenticated if Clerk token is valid
              console.log('Supabase profile not found, assuming it will be created by webhook.');
              setIsAuthenticated(true); // Still authenticated via Clerk
              setSupabaseUser(null); // Profile not yet in DB
            }
          } else {
            console.warn('No Clerk token found for Supabase.');
            setIsAuthenticated(false);
            setSupabaseUser(null);
          }
        } catch (error) {
          console.error('Error during Supabase auth setup:', error);
          setIsAuthenticated(false);
          setSupabaseUser(null);
        }
      } else {
        // No Clerk user, so not authenticated
        setIsAuthenticated(false);
        setSupabaseUser(null);
      }
      setLoading(false);
    };

    setupSupabaseAuth();
  }, [clerkUser, isClerkLoaded]);

  return { 
    supabaseUser, 
    loading,
    isAuthenticated
  };
}