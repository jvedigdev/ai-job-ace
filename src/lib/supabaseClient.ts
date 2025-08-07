import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export async function getAuthenticatedSupabaseClient() {
  const { user } = useUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const token = await (user as any).getToken({ template: 'supabase' });
    
    if (token) {
      // Set the auth token for this request
      supabase.realtime.setAuth(token);
      return supabase;
    } else {
      throw new Error('Failed to get Supabase token');
    }
  } catch (error) {
    console.error('Error getting authenticated Supabase client:', error);
    throw error;
  }
}

export function createSupabaseMiddleware() {
  return async (user: any) => {
    if (user) {
      try {
        const token = await user.getToken({ template: 'supabase' });
        if (token) {
          supabase.realtime.setAuth(token);
        }
      } catch (error) {
        console.error('Error setting Supabase auth:', error);
      }
    }
  };
}