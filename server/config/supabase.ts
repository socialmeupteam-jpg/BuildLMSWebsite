import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

let supabaseAdminClient: SupabaseClient | null = null;
let supabasePublicClient: SupabaseClient | null = null;

/**
 * Returns a privileged Supabase client configured with the service-role key.
 * Used strictly in secure server-side routes and operations.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseAdminClient) {
    const url = config.supabase.url;
    const serviceKey = config.supabase.serviceRoleKey;

    if (!url || !serviceKey) {
      console.warn('[Supabase Admin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Server-side Supabase operations will be unavailable.');
      return null;
    }

    supabaseAdminClient = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdminClient;
}

/**
 * Returns a standard Supabase client with the public anon key.
 * Used for verifying client JWT tokens.
 */
export function getSupabasePublic(): SupabaseClient | null {
  if (!supabasePublicClient) {
    const url = config.supabase.url;
    const anonKey = config.supabase.anonKey;

    if (!url || !anonKey) {
      console.warn('[Supabase Public] Missing SUPABASE_URL or SUPABASE_ANON_KEY.');
      return null;
    }

    supabasePublicClient = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabasePublicClient;
}
