'use client';

import React, { useState } from 'react';
import {
  Database,
  Settings2,
  Table,
  Search,
  Plus,
  MoreVertical,
  RefreshCcw,
  ExternalLink,
  Filter,
  ArrowRight,
  Zap,
  Loader2,
  ShoppingCart,
  Check,
  AlertCircle
} from 'lucide-react';
import { useStore, Product } from '@/app/lib/store';
import { AppLayout } from '@/app/components/ui/AppLayout';

type Tab = 'items' | 'connection' | 'mapping';

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState<Tab>('items');
  const [isHydrated, setIsHydrated] = useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  return (
    <AppLayout>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 py-12 border-b border-forest-contrast/10">
          <div className="max-w-xl">
            <h1 className="text-7xl font-display tracking-tighter text-deep-jungle mb-4">Data Hub</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-forest-contrast/40 leading-relaxed">
              Universal Interface for Multi-Protocol Repository Synchronization.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-secondary">
              <RefreshCcw className="w-4 h-4 mr-2 opacity-40" /> Force Sync
            </button>
            <button className="btn-primary shadow-lg shadow-agentic-lime/20">
              <Plus className="w-4 h-4 mr-2" /> Add Entity
            </button>
          </div>
        </div>

        {/* Navigation Protocol */}
        <div className="flex items-center gap-12 border-b border-forest-contrast/5">
          {[
            { id: 'items', label: 'Inventory Vault', icon: Table },
            { id: 'connection', label: 'Interface Protocol', icon: Database },
            { id: 'mapping', label: 'Field Orchestration', icon: Settings2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 py-6 transition-all text-[9px] font-bold uppercase tracking-[0.3em] relative ${activeTab === tab.id
                ? 'text-deep-jungle'
                : 'text-forest-contrast/20 hover:text-deep-jungle/60'
                }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-agentic-lime' : ''}`} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-agentic-lime shadow-[0_0_8px_rgba(234,255,148,0.8)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Hub Content Area */}
        <div className="min-h-[60vh]">
          {activeTab === 'items' && <ItemsTab />}
          {activeTab === 'connection' && <ConnectionTab />}
          {activeTab === 'mapping' && <MappingTab />}
        </div>
      </div>
    </AppLayout>
  );
}

function ItemsTab() {
  const { getActiveStore, updateInventory, syncToBackend } = useStore();
  const store = getActiveStore();
  const items = store.inventory || [];
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleSimulateOrder = async (product: Product) => {
    if (product.stock <= 0) return;
    setIsSyncing(product.id);
    const newStock = product.stock - 1;
    const updatedItems = items.map(p => p.id === product.id ? { ...p, stock: newStock } : p);
    updateInventory(updatedItems);
    if (store.apiConfig?.writeEnabled) await syncToBackend(product.id, newStock);
    setTimeout(() => setIsSyncing(null), 1000);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-8">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-contrast/30" />
          <input
            type="text"
            placeholder="FILTER REPOSITORY..."
            className="halofy-input !pl-10 uppercase tracking-widest text-[10px]"
          />
        </div>
        <button className="p-4 border border-forest-contrast/10 hover:border-agentic-lime text-deep-jungle transition-all">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="relative border border-forest-contrast/10 overflow-hidden bg-white/50 backdrop-blur-sm">
        <div className="absolute inset-0 dither-mesh opacity-[0.03] pointer-events-none"></div>
        <table className="w-full text-left relative z-10">
          <thead>
            <tr className="bg-forest-contrast text-[9px] font-bold text-cyber-cream uppercase tracking-[0.3em]">
              <th className="px-10 py-6">Identity Node</th>
              <th className="px-10 py-6">Classification</th>
              <th className="px-10 py-6 text-right">Valuation</th>
              <th className="px-10 py-6 text-right">Unit State</th>
              <th className="px-10 py-6">Protocol Status</th>
              <th className="px-10 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-contrast/5">
            {items.length > 0 ? (
              items.map((item: Product, i: number) => (
                <tr key={i} className="group hover:bg-agentic-lime/[0.03] transition-colors">
                  <td className="px-10 py-8">
                    <p className="font-bold text-deep-jungle">{item.name}</p>
                    <p className="text-[8px] text-forest-contrast/40 font-mono mt-1 uppercase tracking-[0.2em]">{item.id}</p>
                  </td>
                  <td className="px-10 py-8 text-[9px] font-bold uppercase tracking-widest text-forest-contrast/40">{item.category}</td>
                  <td className="px-10 py-8 text-right font-mono font-bold text-deep-jungle">
                    {item.currency === 'USD' ? '$' : '₹'}{item.price}
                  </td>
                  <td className="px-10 py-8 text-right font-mono text-deep-jungle font-bold">{item.stock}</td>
                  <td className="px-10 py-8">
                    <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-sm ${item.stock > 10 ? 'bg-agentic-lime text-deep-jungle' :
                      item.stock > 0 ? 'bg-forest-contrast/10 text-forest-contrast/60' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                      {item.stock > 10 ? 'Synchronized' : item.stock > 0 ? 'Depleting' : 'Disconnected'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button
                      onClick={() => handleSimulateOrder(item)}
                      disabled={item.stock <= 0 || isSyncing === item.id}
                      className={`text-[9px] font-bold uppercase tracking-[0.3em] px-5 py-2.5 transition-all border ${isSyncing === item.id
                        ? 'bg-agentic-lime border-agentic-lime text-deep-jungle'
                        : 'bg-transparent border-forest-contrast/20 text-forest-contrast/60 hover:border-deep-jungle hover:text-deep-jungle'
                        } disabled:opacity-10`}
                    >
                      {isSyncing === item.id ? 'Processing...' : 'Simulate Loop'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-10 py-32 text-center text-forest-contrast/20 text-[10px] uppercase font-bold tracking-[0.4em]">
                  No active entities in protocol vault.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConnectionTab() {
  const { getActiveStore } = useStore();
  const store = getActiveStore();
  const isApi = store.source === 'Custom API' && store.apiConfig;
  const isSheets = store.source === 'Google Sheets';

  return (
    <div className="max-w-xl space-y-8">
      <div className="bg-white border border-forest-contrast/10 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 dither-mesh opacity-[0.02] pointer-events-none"></div>
        <div className="px-12 py-12 relative z-10">
          <div className="flex items-center gap-8 mb-16">
            <div className="w-16 h-16 bg-deep-jungle text-agentic-lime flex items-center justify-center shrink-0">
              {isApi ? <Zap className="w-8 h-8" /> : <Database className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="text-3xl font-display uppercase tracking-tighter text-deep-jungle">{isApi ? 'API Protocol' : isSheets ? 'Cloud Link' : 'Local Archive'}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-forest-contrast/40 mt-1">
                Active Repository Interface
              </p>
            </div>
            <div className="ml-auto">
              <span className="w-3 h-3 bg-agentic-lime rounded-full shadow-[0_0_12px_rgba(234,255,148,1)]"></span>
            </div>
          </div>

          <div className="space-y-10">
            <div className="pb-10 border-b border-forest-contrast/5">
              <p className="text-[9px] font-bold text-forest-contrast/30 uppercase tracking-[0.4em] mb-4">Node Identity</p>
              <p className="text-sm font-mono text-deep-jungle truncate bg-forest-contrast/5 p-4 border-l-2 border-agentic-lime">
                {isApi ? store.apiConfig!.url : isSheets ? 'REDACTED_G_CLOUD_UCP' : 'COMMERCEHUB_INTERNAL_FS'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div>
                <p className="text-[9px] font-bold text-forest-contrast/30 uppercase tracking-[0.4em] mb-4">Heartbeat</p>
                <p className="text-sm font-bold text-deep-jungle">
                  {isApi && store.apiConfig!.lastSync ? new Date(store.apiConfig!.lastSync).toLocaleTimeString() : 'NOMINAL'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-forest-contrast/30 uppercase tracking-[0.4em] mb-4">Frequency</p>
                <p className="text-sm font-bold text-deep-jungle uppercase tracking-widest text-agentic-lime">
                  {isApi ? `${store.apiConfig!.interval / 1000}S Pulse` : 'Permanent'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-10">
              <button className="flex-1 btn-primary">Configuration</button>
              <button className="flex-1 btn-secondary !border-red-500/20 !text-red-500 hover:!bg-red-500 hover:!text-white">Cut Protocol</button>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full p-8 border border-forest-contrast/10 flex items-center justify-between group hover:bg-agentic-lime transition-all">
        <div className="flex items-center gap-6">
          <RefreshCcw className="w-6 h-6 text-forest-contrast/40 group-hover:text-deep-jungle" />
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-deep-jungle">Switch Source</p>
            <p className="text-xs font-semibold text-forest-contrast/60 mt-1">Re-link your commerce repository</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-deep-jungle" />
      </button>
    </div>
  );
}

function MappingTab() {
  const { getActiveStore } = useStore();
  const store = getActiveStore();
  const mappings = store.apiConfig?.mappings || {};

  return (
    <div className="max-w-2xl space-y-12">
      <div className="bg-white border border-forest-contrast/10 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 dither-mesh opacity-[0.02] pointer-events-none"></div>
        <div className="px-12 py-10 bg-deep-jungle text-cyber-cream flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-display uppercase tracking-tight">Orchestration</h3>
            <p className="text-[9px] font-bold text-agentic-lime mt-1 uppercase tracking-[0.4em]">Protocol Node Alignment</p>
          </div>
          <Zap className="w-8 h-8 text-agentic-lime opacity-30" />
        </div>
        <table className="w-full text-left relative z-10">
          <tbody className="divide-y divide-forest-contrast/5">
            {Object.entries(mappings).map(([mcp, mine], i) => (
              <tr key={i} className="hover:bg-agentic-lime/[0.02] transition-colors">
                <td className="px-12 py-10">
                  <p className="text-[8px] font-bold text-forest-contrast/30 uppercase tracking-[0.5em] mb-4">Original Key</p>
                  <p className="font-bold text-deep-jungle uppercase tracking-[0.1em]">{mine}</p>
                </td>
                <td className="px-4 py-10">
                  <ArrowRight className="w-4 h-4 text-agentic-lime" />
                </td>
                <td className="px-12 py-10">
                  <p className="text-[8px] font-bold text-forest-contrast/30 uppercase tracking-[0.5em] mb-4">CommerceHub Protocol</p>
                  <code className="bg-agentic-lime text-deep-jungle px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {mcp}
                  </code>
                </td>
              </tr>
            ))}
            {Object.keys(mappings).length === 0 && (
              <tr>
                <td colSpan={3} className="px-12 py-32 text-center text-forest-contrast/20 text-[10px] uppercase font-bold tracking-[0.5em] italic">
                  No established protocol linkages.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-12 py-10 bg-forest-contrast/5 border-t border-forest-contrast/10 flex justify-end">
          <button className="btn-primary">Initialize Linkage</button>
        </div>
      </div>
    </div>
  );
}
