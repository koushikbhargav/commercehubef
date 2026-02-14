"use client";

import { createClient } from '../utils/supabase/client';
import { useState, useEffect } from 'react';

// Adapter to match Better-Auth client interface using Supabase
export const authClient = {
    useSession: () => {
        const [session, setSession] = useState<any>(null);
        const [loading, setLoading] = useState(true);
        const supabase = createClient();

        useEffect(() => {
            // Get initial session
            supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session);
                setLoading(false);
            });

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                setLoading(false);
            });

            return () => {
                subscription.unsubscribe();
            };
        }, []);

        // Transform Supabase session to match the expected shape of better-auth
        // Structure: { data: { session: { user: { ... } } }, isPending, error }
        const data = session ? {
            session: {
                id: session.access_token, // use token as session id
                userId: session.user.id,
                expiresAt: new Date(session.expires_at! * 1000).toISOString(),
                user: {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    image: session.user.user_metadata?.avatar_url || null
                }
            }
        } : null;

        return {
            data,
            isPending: loading,
            error: null,
            refetch: async () => {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
            }
        };
    },
    signIn: {
        social: async ({ provider, callbackURL }: { provider: 'google' | 'apple', callbackURL?: string }) => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: callbackURL || `${window.location.origin}/auth/callback`
                }
            });
            return { data, error };
        }
    },
    signOut: async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (!error) {
           window.location.href = '/'; 
        }
        return { error };
    }
};

export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
