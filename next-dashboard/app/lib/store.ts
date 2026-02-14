import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  stock: number;
  variants?: string[];
  image?: string;
};

export type ApiConfig = {
  url: string;
  headers?: Record<string, string>;
  interval: number; // in milliseconds
  enabled: boolean;
  lastSync?: string;
  mappings?: Record<string, string>;
  writeEnabled?: boolean;
  writeMethod?: 'POST' | 'PUT' | 'PATCH';
  writeUrl?: string;
};

export type StoreData = {
  id: string;
  name: string;
  domain: string;
  source: string;
  platform: 'shopify' | 'woocommerce' | 'custom';
  industry: string;
  color: string; // Tailwind color name like 'blue', 'green', 'purple'
  stats: {
    products: number;
    visits: number;
    revenue: string;
  };
  inventory: Product[];
  recentActivity: {
    agent: string;
    action: string;
    time: string;
    icon: 'search' | 'cart' | 'view' | 'box';
  }[];
  apiConfig?: ApiConfig;
  credentials?: Record<string, string>; // Stores API keys/tokens
};

export type MerchantUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: 'owner' | 'admin' | 'developer' | 'support';
  authMethod: 'email' | 'google' | 'phone';
};

export type Organization = {
  name: string;
  industry: string;
  taxId?: string;
  contactEmail: string;
  address?: string;
};

export type Branding = {
  logo?: string;
  primaryColor?: string;
  brandVoice: string;
  brandGuidelines?: string; // Store file name or base64 status
};

export type MerchantStateData = {
  user: MerchantUser | null;
  org: Organization | null;
  branding: Branding | null;
  verificationStatus: 'pending' | 'verified' | 'unverified';
  isOnboarded: boolean;
};

export const MOCK_STORES: Record<string, StoreData> = {
  'sarah': {
    id: 'sarah',
    name: "Sarah's Boutique",
    domain: "boutique-sarah.myshopify.com",
    source: 'Shopify',
    platform: 'shopify',
    industry: 'Fashion',
    color: 'emerald',
    stats: { products: 1247, visits: 23, revenue: "$1,840" },
    inventory: [
      { id: 'p1', name: 'Floral Maxi Dress', price: 89.99, currency: 'USD', category: 'Dresses', stock: 15, variants: ['S', 'M', 'L'] },
      { id: 'p2', name: 'Cotton Sundress', price: 54.99, currency: 'USD', category: 'Dresses', stock: 42, variants: ['XS', 'S', 'M', 'L', 'XL'] },
      { id: 'p3', name: 'Denim Jacket', price: 129.50, currency: 'USD', category: 'Outerwear', stock: 8, variants: ['M', 'L'] },
      { id: 'p4', name: 'Leather Sandals', price: 45.00, currency: 'USD', category: 'Shoes', stock: 20, variants: ['36', '37', '38', '39'] },
    ],
    recentActivity: [
      { agent: 'Perplexity', action: 'searched "summer dresses"', time: '2m ago', icon: 'search' },
      { agent: 'Claude', action: 'purchased Floral Maxi Dress', time: '8m ago', icon: 'cart' },
      { agent: 'ChatGPT', action: 'checked inventory for #p3', time: '15m ago', icon: 'box' },
    ],
    credentials: {}
  },
  'tech': {
    id: 'tech',
    name: 'Tech Gadgets Pro',
    domain: 'tech-gadgets.pro',
    source: 'Custom API',
    platform: 'custom',
    industry: 'Electronics',
    color: 'blue',
    stats: { products: 8560, visits: 142, revenue: "$12,450" },
    inventory: [
      { id: 't1', name: 'Quantum Headset X1', price: 299.99, currency: 'USD', category: 'Audio', stock: 120, variants: ['Black', 'Silver'] },
      { id: 't2', name: 'DevDeck Mechanical Keyboard', price: 159.00, currency: 'USD', category: 'Peripherals', stock: 5, variants: ['Red Switch', 'Blue Switch'] },
      { id: 't3', name: '4K Ultra Monitor', price: 499.00, currency: 'USD', category: 'Monitors', stock: 12 },
    ],
    recentActivity: [
      { agent: 'Devin', action: 'queried API specs', time: '1m ago', icon: 'view' },
      { agent: 'GPT-4o', action: 'compared monitor prices', time: '5m ago', icon: 'search' },
      { agent: 'Gemini', action: 'purchased DevDeck Keyboard', time: '12m ago', icon: 'cart' },
    ],
    credentials: {}
  },
  'green': {
    id: 'green',
    name: 'Green Thumb Nursery',
    domain: 'green-thumb.store',
    source: 'WooCommerce',
    platform: 'woocommerce',
    industry: 'Home & Garden',
    color: 'green',
    stats: { products: 340, visits: 89, revenue: "$4,200" },
    inventory: [
      { id: 'g1', name: 'Monstera Deliciosa', price: 45.00, currency: 'USD', category: 'Plants', stock: 8 },
      { id: 'g2', name: 'Ceramic Pot Set', price: 32.50, currency: 'USD', category: 'Pots', stock: 150 },
      { id: 'g3', name: 'Organic Fertilizer', price: 12.00, currency: 'USD', category: 'Care', stock: 500 },
    ],
    recentActivity: [
      { agent: 'Claude', action: 'asked about plant care', time: '10m ago', icon: 'search' },
      { agent: 'Pi', action: 'checked Monstera stock', time: '22m ago', icon: 'box' },
    ],
    credentials: {}
  }
};

type StoreState = {
  activeStoreId: string;
  stores: Record<string, StoreData>;
  merchant: MerchantStateData;
  setActiveStore: (id: string) => void;
  getActiveStore: () => StoreData;
  setInventory: (items: Product[], source?: string) => void;
  setApiConfig: (config: ApiConfig) => void;
  setCredentials: (credentials: Record<string, string>) => void;
  updateInventory: (items: Product[]) => void;
  syncToBackend: (productId: string, newStock: number) => Promise<boolean>;
  
  // Login Modal State
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  
  // Merchant Actions
  login: (user: MerchantUser) => void;
  updateOrg: (org: Organization) => void;
  verifyBusiness: (documentType: string) => Promise<void>;
  updateBranding: (branding: Branding) => void;
  completeOnboarding: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      activeStoreId: 'sarah', // Default
      stores: MOCK_STORES,   // Initialize with mock data
      merchant: {
        user: null,
        org: null,
        branding: {
          primaryColor: 'forest-contrast',
          brandVoice: 'Professional, Efficient, Secure',
          brandGuidelines: ''
        },
        verificationStatus: 'unverified',
        isOnboarded: false,
      },
      isLoginModalOpen: false,
      setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
      setActiveStore: (id) => set({ activeStoreId: id }),
      getActiveStore: () => {
        const { activeStoreId, stores } = get();
        return stores[activeStoreId] || stores['sarah'];
      },
      refreshProfile: async () => {
        const { merchant } = get();
        if (!merchant.user?.email) return;

        try {
          const response = await fetch(`/api/merchant/profile?email=${encodeURIComponent(merchant.user.email)}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              set((state) => ({
                merchant: {
                  ...state.merchant,
                  ...result.data,
                  user: {
                    ...state.merchant.user,
                    ...result.data
                  }
                }
              }));
              console.log('[Store] Profile refreshed from backend');
            }
          }
        } catch (error) {
          console.error('[Store] Failed to refresh profile:', error);
        }
      },
      setInventory: (items, source = 'CSV Upload') => {
        const { activeStoreId, stores } = get();
        if (stores[activeStoreId]) {
          const updatedStore = {
            ...stores[activeStoreId],
            inventory: items,
            source: source,
            stats: {
              ...stores[activeStoreId].stats,
              products: items.length
            }
          };
          set({
            stores: {
              ...stores,
              [activeStoreId]: updatedStore
            }
          });
        }
      },
      setApiConfig: (config) => {
        const { activeStoreId, stores } = get();
        if (stores[activeStoreId]) {
          const updatedStore = {
            ...stores[activeStoreId],
            apiConfig: config,
            source: config.enabled ? 'Custom API' : stores[activeStoreId].source
          };
          set({
            stores: {
              ...stores,
              [activeStoreId]: updatedStore
            }
          });
        }
      },
      setCredentials: (credentials) => {
        const { activeStoreId, stores } = get();
        if (stores[activeStoreId]) {
          const updatedStore = {
            ...stores[activeStoreId],
            credentials: { ...stores[activeStoreId].credentials, ...credentials }
          };
          set({
            stores: {
              ...stores,
              [activeStoreId]: updatedStore
            }
          });
        }
      },
      updateInventory: (items) => {
        const { activeStoreId, stores } = get();
        if (stores[activeStoreId]) {
          const updatedStore = {
            ...stores[activeStoreId],
            inventory: items,
            apiConfig: stores[activeStoreId].apiConfig ? {
              ...stores[activeStoreId].apiConfig!,
              lastSync: new Date().toISOString()
            } : undefined,
            stats: {
              ...stores[activeStoreId].stats,
              products: items.length
            }
          };
          set({
            stores: {
              ...stores,
              [activeStoreId]: updatedStore
            }
          });
        }
      },
      syncToBackend: async (productId, newStock) => {
        const { activeStoreId, stores } = get();
        const store = stores[activeStoreId];
        if (!store || !store.apiConfig?.writeEnabled) return false;

        const config = store.apiConfig;
        const targetUrl = config.writeUrl || config.url;
        const method = config.writeMethod || 'POST';

        try {
          // Find the product to get its original data (for fields we don't change)
          const product = store.inventory.find(p => p.id === productId);
          if (!product) return false;

          // Map the Halo internal fields (sku, stock) to the external API field names
          const idKey = config.mappings?.['sku'] || 'id';
          const stockKey = config.mappings?.['stock'] || 'stock';

          // Perform the update
          const response = await fetch(targetUrl, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              ...config.headers
            },
            body: JSON.stringify({
              [idKey]: productId,
              [stockKey]: newStock,
              action: 'update_stock'
            })
          });

          if (!response.ok) throw new Error(`Write failed: ${response.status}`);

          console.log(`[Store] Successfully synced update for ${productId} to ${targetUrl}`);
          return true;
        } catch (err) {
          console.error('[Store] Failed to sync to backend:', err);
          return false;
        }
      },
      
      // Merchant Actions Implementation
      login: (user) => set((state) => ({
        merchant: { ...state.merchant, user }
      })),
      updateOrg: (org) => set((state) => ({
        merchant: { ...state.merchant, org }
      })),
      verifyBusiness: async (documentType) => {
        // Mock verification delay
        set((state) => ({ merchant: { ...state.merchant, verificationStatus: 'pending' } }));
        await new Promise(resolve => setTimeout(resolve, 2000));
        set((state) => ({ merchant: { ...state.merchant, verificationStatus: 'verified' } }));
      },
      updateBranding: (branding) => set((state) => ({
        merchant: { ...state.merchant, branding }
      })),
      completeOnboarding: () => set((state) => ({
        merchant: { ...state.merchant, isOnboarded: true }
      })),
      logout: () => set({
        merchant: {
          user: null,
          org: null,
          branding: {
            primaryColor: 'forest-contrast',
            brandVoice: 'Professional, Efficient, Secure',
            brandGuidelines: ''
          },
          verificationStatus: 'unverified',
          isOnboarded: false
        }
      }),
    }),
    {
      name: 'halo-store-storage',
    }
  )
);
