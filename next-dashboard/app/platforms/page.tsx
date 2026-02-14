'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Globe, 
  Code2, 
  ArrowLeft, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function PlatformSelect() {
  const router = useRouter();

  const platforms = [
    {
      id: 'shopify',
      name: 'Shopify',
      icon: ShoppingBag,
      color: 'text-forest-contrast',
      bg: 'bg-forest-contrast/5',
      desc: 'Connect your store via OAuth. We support all Shopify plans.',
      features: ['One-click sync', 'Real-time inventory', 'Order tracking']
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      icon: Globe,
      color: 'text-forest-contrast',
      bg: 'bg-forest-contrast/5',
      desc: 'Connect your WordPress site via REST API keys.',
      features: ['Automated setup', 'Deep integration', 'Flexible schemas']
    },
    {
      id: 'custom',
      name: 'Custom API',
      icon: Code2,
      color: 'text-forest-contrast',
      bg: 'bg-forest-contrast/5',
      desc: 'Connect any custom backend using our standardized schema.',
      features: ['Protocol translation', 'Universal mapping', 'Custom tools']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-24 px-4">
      <button 
        onClick={() => router.push('/')}
        className="flex items-center text-sm font-semibold text-slate-500 hover:text-forest-contrast mb-12 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to home
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-display text-slate-900 mb-4">Choose your commerce platform</h1>
        <p className="text-slate-500 max-w-2xl leading-relaxed">
          We'll automatically scan your store and generate a custom MCP server so AI agents can discover and purchase your products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => router.push(`/connect/${platform.id}`)}
            className="flex flex-col items-start p-8 bg-white border border-slate-200 rounded-3xl hover:border-forest-contrast hover:ring-4 hover:ring-forest-contrast/5 transition-all text-left group overflow-hidden relative shadow-sm"
          >
            <div className={`w-14 h-14 ${platform.bg} ${platform.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
              <platform.icon className="w-7 h-7" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{platform.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{platform.desc}</p>
            
            <div className="space-y-2 mb-8 flex-1">
              {platform.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <div className="w-1 h-1 bg-slate-200 rounded-full" />
                  {feat}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-forest-contrast font-bold text-sm">
              Connect Store <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Security Tip */}
      <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-bold text-slate-900 mb-1">Enterprise-grade Security</h4>
          <p className="text-sm text-slate-500">We use OAuth 2.0 and encrypted API keys to ensure your store data remains secure and private.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-forest-contrast bg-forest-contrast/5 px-3 py-1.5 rounded-full uppercase tracking-wider">
          <Zap className="w-3 h-3" /> PCI Compliant
        </div>
      </div>
    </div>
  );
}
