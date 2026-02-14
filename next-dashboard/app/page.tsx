"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Database,
  ArrowRight,
  Sparkles,
  UploadCloud,
  ShieldCheck,
  Zap,
  BarChart3,
  MessageSquare,
  UtensilsCrossed,
  Store,
  Scissors,
  Briefcase,
} from "lucide-react";
import { useStore } from "./lib/store";
import { useEffect } from "react";

const UseCase = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-3 p-4 bg-transparent border border-forest-contrast/10 rounded-xl hover:border-forest-contrast transition-all group">
    <div className="p-2 bg-forest-contrast/5 rounded-lg group-hover:bg-forest-contrast group-hover:text-cyber-cream transition-colors">
      <Icon className="w-5 h-5 text-deep-jungle/60 group-hover:text-cyber-cream" />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-deep-jungle/70">{text}</span>
  </div>
);

const PathCard = ({
  title,
  subtitle,
  features,
  cta,
  primary,
  onClick,
}: any) => (
  <div
    className={`flex flex-col p-8 rounded-2xl border transition-all duration-300 hover:shadow-2xl ${primary ? "border-forest-contrast/50 bg-forest-contrast/5" : "border-forest-contrast/10 bg-transparent hover:border-forest-contrast/20"}`}
  >
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${primary ? "bg-forest-contrast text-cyber-cream" : "bg-forest-contrast/5 text-deep-jungle"}`}
      >
        {primary ? (
          <Database className="w-6 h-6" />
        ) : (
          <ShoppingBag className="w-6 h-6" />
        )}
      </div>
      <div>
        <h3 className="text-xl font-display uppercase tracking-tight text-deep-jungle leading-none">
          {title}
        </h3>
        {primary && (
          <span className="text-[8px] font-bold bg-forest-contrast/20 text-deep-jungle px-2 py-0.5 rounded-full uppercase tracking-widest mt-1 inline-block">
            Primary Path
          </span>
        )}
      </div>
    </div>
    <p className="text-forest-contrast text-[11px] font-medium mb-8 leading-relaxed uppercase tracking-tight">{subtitle}</p>

    <div className="space-y-3 mb-10 overflow-hidden">
      {features.map((f: string, i: number) => (
        <div key={i} className="flex items-center gap-2.5 text-deep-jungle/70">
          <div
            className={`w-1 h-1 rounded-full ${primary ? "bg-agentic-lime" : "bg-forest-contrast/20"}`}
          />
          <span className="text-[10px] font-bold uppercase tracking-tight">{f}</span>
        </div>
      ))}
    </div>

    <button
      onClick={onClick}
      className={`mt-auto w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${primary ? "bg-forest-contrast text-cyber-cream hover:bg-forest-contrast/90" : "bg-deep-jungle text-cyber-cream hover:bg-forest-contrast"}`}
    >
      {cta} <ArrowRight className="w-3 h-3" />
    </button>
  </div>
);

export default function LandingPage() {
  const router = useRouter();
  const { merchant } = useStore();


  return (
    <div className="max-w-6xl mx-auto pt-12 pb-24">
      {/* Hero Section */}
      <div className="text-center mb-32 relative py-20 px-6 rounded-[3rem] overflow-hidden">
        <div className="absolute inset-0 dither-mesh opacity-[0.05] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#274029_0%,transparent_60%)] opacity-[0.1] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-contrast/10 border border-forest-contrast/20 text-deep-jungle text-[10px] font-bold mb-8 uppercase tracking-[0.4em]">
            <Sparkles className="w-3 h-3 text-forest-contrast" /> Agentic Commerce OS
          </div>
          <h1 className="text-7xl md:text-9xl font-display text-deep-jungle mb-10 leading-[0.85] tracking-tighter max-w-5xl mx-auto uppercase">
            Turn Any Inventory into an<br/>
            <span className="text-accent-contrast select-none">AI-Accessible API</span>
          </h1>
          <p className="text-forest-contrast text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 uppercase tracking-tight font-medium">
            No e-commerce platform? No problem. Works with spreadsheets,
            databases, or manual entry. Let AI agents find and buy your products.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => router.push("/onboarding")}
              className="px-12 py-5 bg-forest-contrast text-cyber-cream rounded-xl text-[11px] font-bold uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl whitespace-nowrap flex items-center gap-2"
            >
              Start Onboarding <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="mb-32">
        <h2 className="text-3xl font-display text-center mb-20 uppercase tracking-tight">
          The 3-Step Success Path
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            {
              icon: UploadCloud,
              title: "1. Upload Your Data",
              desc: "Connect your Google Sheet, upload a CSV, or just type it in manually.",
            },
            {
              icon: Zap,
              title: "2. Generate Your Server",
              desc: "We scan your inventory and instantly build a high-performance MCP server.",
            },
            {
              icon: MessageSquare,
              title: "3. AI agents find you",
              desc: "AI agents (Claude, ChatGPT) can now browse and purchase from your catalog.",
            },
          ].map((step, i) => (
            <div key={i} className="text-center group">
              <div className="w-20 h-20 bg-forest-contrast/5 rounded-3xl flex items-center justify-center border border-forest-contrast/5 mb-8 mx-auto group-hover:scale-110 group-hover:border-agentic-lime transition-all duration-300">
                <step.icon className="w-8 h-8 text-deep-jungle/40 group-hover:text-deep-jungle transition-colors" />
              </div>
              <h3 className="font-display text-xl mb-4 uppercase tracking-tight">{step.title}</h3>
              <p className="text-forest-contrast text-[11px] font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Paths Section */}
      <div className="mb-32 bg-slate-100/50 p-12 rounded-[2.5rem] border border-slate-200/60">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display mb-4">
            Choose Your Path to Agentic Commerce
          </h2>
          <p className="text-slate-500">
            Tailored experiences for every business type.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PathCard
            primary
            title="I Have Data"
            subtitle="Perfect for restaurants, local shops, and service providers who use spreadsheets or manual records."
            features={[
              "Connect Google Sheets with one click",
              "Upload Excel or CSV files",
              "Airtable integration",
              "Manual item-by-item entry",
            ]}
            cta="Start Onboarding"
            onClick={() => router.push("/onboarding")}
          />
          <PathCard
            title="I Have an Online Store"
            subtitle="Direct connection for established e-commerce brands looking for deeper integration."
            features={[
              "Native Shopify OAuth flow",
              "WooCommerce API integration",
              "Standardized Custom API schema",
              "Real-time inventory syncing",
            ]}
            cta="Start Onboarding"
            onClick={() => router.push("/onboarding")}
          />
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-display">Infinite Use Cases</h2>
          <div className="h-px flex-1 bg-slate-200 mx-8 hidden md:block" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UseCase icon={UtensilsCrossed} text="Restaurants" />
          <UseCase icon={Store} text="Local Retail" />
          <UseCase icon={Scissors} text="Services" />
          <UseCase icon={Briefcase} text="B2B Catalog" />
        </div>
      </div>

      {/* Trust Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: ShieldCheck,
            title: "Institutional Security",
            desc: "Enterprise-grade data protection and encrypted commerce links.",
          },
          {
            icon: Zap,
            title: "Lightning Fast Sync",
            desc: "Real-time updates ensure AI agents always see accurate inventory.",
          },
          {
            icon: BarChart3,
            title: "Advanced Metrics",
            desc: "Track every agent query and transaction with precision analytics.",
          },
        ].map((feat, i) => (
          <div
            key={i}
            className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm"
          >
            <feat.icon className="w-6 h-6 text-forest-contrast mb-4" />
            <h4 className="font-bold text-lg mb-2">{feat.title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
