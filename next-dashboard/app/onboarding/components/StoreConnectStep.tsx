"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Globe, 
  Code2, 
  FileSpreadsheet, 
  Upload, 
  Keyboard,
  Zap,
  ChevronRight,
  Database,
  Link2
} from "lucide-react";

interface StoreConnectStepProps {
  onBack: () => void;
  onComplete: () => void;
}

export const StoreConnectStep: React.FC<StoreConnectStepProps> = ({ onBack, onComplete }) => {
  const router = useRouter();

  const platformSources = [
    {
      id: "shopify",
      name: "Shopify",
      icon: ShoppingBag,
      desc: "Connect your store via OAuth. One-click sync for products and orders.",
      type: "PLATFORM",
      path: "/connect/shopify"
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      icon: Globe,
      desc: "Connect your WordPress site via REST API keys. Flexible and deep integration.",
      type: "PLATFORM",
      path: "/connect/woocommerce"
    },
    {
      id: "sheets",
      name: "Cloud Link",
      icon: FileSpreadsheet,
      desc: "Secure connection to external Google Cloud sheet repositories.",
      type: "DATA",
      path: "/import?source=sheets",
      recommend: true
    },
    {
      id: "csv",
      name: "Local Archive",
      icon: Upload,
      desc: "Initialize vault from standardized local CSV/XLSM datasets.",
      type: "DATA",
      path: "/import?source=csv"
    },
    {
      id: "manual",
      name: "Direct Input",
      icon: Keyboard,
      desc: "Manual entity registration for granular repository control.",
      type: "DATA",
      path: "/import?source=manual"
    },
    {
      id: "custom",
      name: "Custom API",
      icon: Code2,
      desc: "Connect any custom backend using our standardized schema.",
      type: "API",
      path: "/import?source=api"
    }
  ];

  const handleSelect = (path: string) => {
    onComplete(); // Mark onboarding as done in state
    router.push(path);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-display uppercase tracking-tight text-deep-jungle mb-3">
          Establish Commerce Linkage
        </h2>
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-forest-contrast/40 max-w-xl mx-auto leading-relaxed">
          Select your primary repository to initialize the Agentic Banking Protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        {platformSources.map((src) => (
          <button
            key={src.id}
            onClick={() => handleSelect(src.path)}
            className="flex items-start p-6 bg-white border border-forest-contrast/10 hover:border-agentic-lime hover:shadow-[0_0_30px_rgba(234,255,148,0.15)] transition-all text-left group relative overflow-hidden"
          >
            <div className="absolute inset-0 dither-mesh opacity-[0.01] pointer-events-none"></div>
            {src.recommend && (
              <div className="absolute top-0 right-0 bg-agentic-lime text-cyber-cream text-[8px] font-bold px-3 py-1 uppercase tracking-widest">
                Recommended
              </div>
            )}
            
            <div className="w-12 h-12 bg-deep-jungle text-cyber-cream flex items-center justify-center shrink-0 mr-6 group-hover:scale-105 transition-transform duration-500">
              <src.icon className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-bold text-agentic-lime tracking-[0.2em] uppercase">
                  {src.type}
                </span>
              </div>
              <h3 className="text-lg font-display uppercase tracking-tight text-deep-jungle mb-2 flex items-center gap-2">
                {src.name}
              </h3>
              <p className="text-[10px] text-forest-contrast/60 leading-relaxed font-medium mb-4">
                {src.desc}
              </p>
              <div className="text-agentic-lime font-bold text-[8px] uppercase tracking-[0.2em] flex items-center gap-1 group-hover:gap-2 transition-all">
                Establish Connection <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-forest-contrast/5 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-[10px] font-bold text-forest-contrast/40 uppercase tracking-[0.3em] hover:text-deep-jungle transition-all"
        >
          ← Previous Protocol
        </button>
        <div className="flex items-center gap-2 text-[9px] font-bold text-deep-jungle/30 uppercase tracking-[0.2em]">
          <Database className="w-3 h-3" /> System Ready for Integration
        </div>
      </div>
    </div>
  );
};
