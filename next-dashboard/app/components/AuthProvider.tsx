"use client";

import { createClient } from '@/app/utils/supabase/client';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: any | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  // const supabase = createClient();

  useEffect(() => {
    // Mock Auth for Demo
    setUser({ id: 'mock', email: 'demo@halofy.ai' });
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
