import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Webhook } from 'https://esm.sh/svix@1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; verification: { status: string } }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    created_at: number;
    updated_at: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify webhook signature
    const webhookSecret = Deno.env.get('CLERK_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { 
        status: 500,
        headers: corsHeaders 
      });
    }

    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing svix headers');
      return new Response('Missing svix headers', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const body = await req.text();
    const wh = new Webhook(webhookSecret);
    
    let evt: ClerkWebhookEvent;
    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return new Response('Webhook verification failed', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    console.log(`Processing webhook event: ${evt.type} for user: ${evt.data.id}`);

    // Handle different event types
    switch (evt.type) {
      case 'user.created':
      case 'user.updated': {
        const primaryEmail = evt.data.email_addresses?.find(
          email => email.verification?.status === 'verified'
        )?.email_address || evt.data.email_addresses?.[0]?.email_address;

        if (!primaryEmail) {
          console.error('No email found for user');
          return new Response('No email found for user', { 
            status: 400,
            headers: corsHeaders 
          });
        }

        const profileData = {
          clerk_user_id: evt.data.id,
          email: primaryEmail,
          first_name: evt.data.first_name || null,
          last_name: evt.data.last_name || null,
          avatar_url: evt.data.image_url || null,
        };

        // Upsert profile data
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(profileData, { 
            onConflict: 'clerk_user_id',
            ignoreDuplicates: false 
          });

        if (upsertError) {
          console.error('Failed to upsert profile:', upsertError);
          return new Response('Failed to upsert profile', { 
            status: 500,
            headers: corsHeaders 
          });
        }

        console.log(`Profile ${evt.type === 'user.created' ? 'created' : 'updated'} for user: ${evt.data.id}`);
        break;
      }

      case 'user.deleted': {
        // Delete user profile
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('clerk_user_id', evt.data.id);

        if (deleteError) {
          console.error('Failed to delete profile:', deleteError);
          return new Response('Failed to delete profile', { 
            status: 500,
            headers: corsHeaders 
          });
        }

        console.log(`Profile deleted for user: ${evt.data.id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${evt.type}`);
    }

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});