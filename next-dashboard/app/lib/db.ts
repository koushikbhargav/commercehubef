import { createClient } from '../utils/supabase/server';
import { createClient as createBrowserClient } from '../utils/supabase/client';

export type MerchantProfile = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'developer' | 'support';
  authMethod: string;
  createdAt: string;
  branding: any;
  org?: any;
  verificationStatus: string;
  isOnboarded: boolean;
};

// Helper to get the correct client (server vs browser)
function getSupabase() {
  if (typeof window === 'undefined') {
    // Server-side
    return createClient();
  } else {
    // Client-side
    return Promise.resolve(createBrowserClient());
  }
}

export async function getMerchants(): Promise<MerchantProfile[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('merchants')
      .select('*');

    if (error) {
      console.error('[DB] Error fetching merchants:', error);
      return [];
    }

    // Map snake_case from DB to camelCase for app
    return data.map((m: any) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      authMethod: m.auth_method,
      createdAt: m.created_at,
      branding: m.branding,
      org: m.org,
      verificationStatus: m.verification_status,
      isOnboarded: m.is_onboarded
    }));
  } catch (error) {
    console.error('[DB] Error reading merchants:', error);
    return [];
  }
}

export async function saveMerchant(profile: MerchantProfile) {
  try {
    const supabase = await getSupabase();

    // Convert to snake_case for DB
    const dbProfile = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      auth_method: profile.authMethod,
      branding: profile.branding,
      org: profile.org,
      verification_status: profile.verificationStatus,
      is_onboarded: profile.isOnboarded,
      // created_at is handled by default or we can pass it if we want to preserve original
    };

    const { error } = await supabase
      .from('merchants')
      .upsert(dbProfile, { onConflict: 'email' });

    if (error) {
      console.error('[DB] Error saving merchant:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[DB] Error saving merchant:', error);
    return false;
  }
}

export async function getMerchantByEmail(email: string): Promise<MerchantProfile | undefined> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return undefined;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    authMethod: data.auth_method,
    createdAt: data.created_at,
    branding: data.branding,
    org: data.org,
    verificationStatus: data.verification_status,
    isOnboarded: data.is_onboarded
  };
}

export async function getMerchantById(id: string): Promise<MerchantProfile | undefined> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    authMethod: data.auth_method,
    createdAt: data.created_at,
    branding: data.branding,
    org: data.org,
    verificationStatus: data.verification_status,
    isOnboarded: data.is_onboarded
  };
}
