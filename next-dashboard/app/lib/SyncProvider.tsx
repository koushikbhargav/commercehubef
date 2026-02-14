"use client";

import { useEffect, useRef } from 'react';
import { useStore, Product } from './store';
import { authClient } from "./auth-client";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const { merchant, login, logout, getActiveStore, updateInventory, refreshProfile } = useStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync session with store
  useEffect(() => {
    if (isPending) return;

    if (session?.session?.user?.email && !merchant.user) {
      console.log(`[SyncProvider] Syncing NextAuth session: ${session.session.user.email}`);
      login({
        id: (session.session.user as any).id,
        name: session.session.user.name || "Merchant",
        email: session.session.user.email,
        image: session.session.user.image,
        role: "owner",
        authMethod: "google"
      });
      // Optionally trigger backend registration/fetch
      refreshProfile();
    } else if (merchant.user && !session?.session && merchant.user.authMethod === 'google') {
      console.log(`[SyncProvider] session gone, clearing store`);
      logout();
    }
  }, [session, merchant.user, login, logout, refreshProfile, isPending]);

  useEffect(() => {
    const store = getActiveStore();
    const config = store.apiConfig;

    if (config?.enabled && config.url && config.mappings) {
      console.log(`[SyncProvider] Starting sync for ${store.name} at ${config.url}`);
      
      const performSync = async () => {
        try {
          console.log(`[SyncProvider] Polling API: ${config.url}`);
          const response = await fetch(config.url, { headers: config.headers });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const rawData = await response.json();
          const items = Array.isArray(rawData) ? rawData : (rawData.items || rawData.products || rawData.data || []);
          
          if (Array.isArray(items)) {
            const products: Product[] = items.map((row: any, i: number) => ({
              id: row[config.mappings!['sku']] || row['sku'] || row['ID'] || `item-${i}`,
              name: row[config.mappings!['name']] || 'Unnamed Item',
              price: parseFloat(row[config.mappings!['price']]?.toString().replace(/[^0-9.]/g, '') || '0'),
              currency: 'USD',
              category: row[config.mappings!['category']] || 'General',
              stock: parseInt(row[config.mappings!['stock']]?.toString().replace(/[^0-9]/g, '') || '100'),
              description: row[config.mappings!['description']] || ''
            }));
            
            updateInventory(products);
            console.log(`[SyncProvider] Successfully synced ${products.length} items`);
          }
        } catch (err) {
          console.error('[SyncProvider] Sync failed:', err);
        }
      };

      // Initial sync
      performSync();

      // Setup interval
      intervalRef.current = setInterval(performSync, config.interval || 30000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getActiveStore, updateInventory]);

  // Handle profile persistence/refresh on mount
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return <>{children}</>;
}
