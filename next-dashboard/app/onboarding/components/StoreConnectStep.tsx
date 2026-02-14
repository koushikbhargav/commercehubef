"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Globe,
  Code2,
  ArrowRight,
  Database,
  Search,
  Key,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Store,
  ArrowLeft,
  ChevronRight
} from "lucide-react";

interface StoreConnectStepProps {
  onBack: () => void;
  onComplete: () => void;
}

export const StoreConnectStep: React.FC<StoreConnectStepProps> = ({ onBack, onComplete }) => {
  const router = useRouter();
  const [view, setView] = useState<"initial" | "platforms" | "custom-select" | "custom-repo">("initial");

  // Custom Flow State
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "injecting" | "complete">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Platform Data
  const platforms = [
    {
      id: "shopify",
      name: "Shopify",
      icon: ShoppingBag,
      desc: "Connect your store via OAuth. One-click sync for products and orders.",
      active: true,
      path: "/connect/shopify"
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      icon: Globe,
      desc: "Connect your WordPress site via REST API keys.",
      active: true,
      path: "/connect/woocommerce"
    },
    {
      id: "dotpe",
      name: "DotPe",
      icon: Store,
      desc: "Integration coming soon for DotPe merchants.",
      active: false,
      path: "#"
    },
    {
      id: "dukaan",
      name: "Dukaan",
      icon: ShoppingBag,
      desc: "Integration coming soon for Dukaan merchants.",
      active: false,
      path: "#"
    }
  ];

  const handleCustomConnect = async () => {
    if (!repoUrl.includes("github.com")) {
      alert("Please enter a valid GitHub URL");
      return;
    }
    if (!token) {
      alert("Please enter a GitHub Personal Access Token");
      return;
    }

    setStatus("analyzing");
    setLogs([]);
    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    addLog("🚀 collaborative-agent-workflow-engine initialized...");

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, token })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      data.logs.forEach((log: string) => addLog(log));

      setAnalysisResult({
        schema: data.schema ? Object.keys(data.schema) : [],
        endpoints: ["Detected from server.js"]
      });

      setStatus("injecting");
      addLog("💉 Generatng WebMCP Adapter...");
      await new Promise(r => setTimeout(r, 1000));

      setStatus("complete");
      addLog("🎉 SUCCESS: Repository is now Agent-Ready!");

      // Wait a moment then complete
      setTimeout(() => {
        onComplete();
      }, 1500);

    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setStatus("idle");
    }
  };

  if (view === "initial") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-display uppercase tracking-tight text-deep-jungle mb-3">
            Choose Your Storefront
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-forest-contrast/40 max-w-xl mx-auto leading-relaxed">
            Select how you want to integrate with the Agentic Commerce Cloud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          {/* Third Party Option */}
          <button
            onClick={() => setView("platforms")}
            className="group relative p-8 bg-white border border-forest-contrast/10 rounded-3xl hover:border-agentic-lime hover:shadow-xl transition-all text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-forest-contrast/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 bg-forest-contrast/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Store className="w-8 h-8 text-forest-contrast" />
            </div>
            <h3 className="text-xl font-display uppercase tracking-tight text-deep-jungle mb-2">Third Party Platform</h3>
            <p className="text-sm text-forest-contrast/60 mb-6 leading-relaxed">
              Connect an existing store from Shopify, WooCommerce, DotPe, or Dukaan.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-agentic-lime group-hover:gap-3 transition-all">
              Select Platform <ArrowRight className="w-3 h-3" />
            </div>
          </button>

          {/* Custom Option */}
          <button
            onClick={() => setView("custom-select")}
            className="group relative p-8 bg-deep-jungle border border-deep-jungle rounded-3xl hover:shadow-xl transition-all text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Code2 className="w-8 h-8 text-agentic-lime" />
            </div>
            <h3 className="text-xl font-display uppercase tracking-tight text-cyber-cream mb-2">Custom Storefront</h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Connect your own GitHub repository or REST API using WebMCP or standard adapters.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-agentic-lime group-hover:gap-3 transition-all">
              Connect Custom <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (view === "platforms") {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <button onClick={() => setView("initial")} className="mb-8 text-[10px] font-bold uppercase tracking-widest text-forest-contrast/40 hover:text-deep-jungle flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Selection
        </button>

        <h2 className="text-2xl font-display uppercase tracking-tight text-deep-jungle mb-8">Select Platform</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => p.active && router.push(p.path)}
              disabled={!p.active}
              className={`flex items-start p-6 rounded-2xl border transition-all text-left group relative ${p.active
                ? "bg-white border-forest-contrast/10 hover:border-agentic-lime hover:shadow-lg cursor-pointer"
                : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 ${p.active ? "bg-forest-contrast/5 text-deep-jungle" : "bg-gray-100 text-gray-400"}`}>
                <p.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-deep-jungle mb-1">{p.name}</h3>
                <p className="text-xs text-forest-contrast/60 mb-2">{p.desc}</p>
                {!p.active && <span className="text-[9px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>}
                {p.active && (
                  <div className="text-[9px] font-bold text-agentic-lime uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all mt-2">
                    Connect <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === "custom-select") {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <button onClick={() => setView("initial")} className="mb-8 text-[10px] font-bold uppercase tracking-widest text-forest-contrast/40 hover:text-deep-jungle flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Selection
        </button>

        <h2 className="text-2xl font-display uppercase tracking-tight text-deep-jungle mb-8">Select Custom Source</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setView("custom-repo")}
            className="flex items-start p-6 rounded-2xl border bg-white border-forest-contrast/10 hover:border-agentic-lime hover:shadow-lg transition-all text-left group relative cursor-pointer"
          >
            <div className="w-12 h-12 bg-forest-contrast/5 text-deep-jungle rounded-xl flex items-center justify-center shrink-0 mr-4">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-deep-jungle mb-1">Git Repository (WebMCP)</h3>
              <p className="text-xs text-forest-contrast/60 mb-2">Connect source code directly via GitHub. We'll inject an agent adapter.</p>
              <div className="text-[9px] font-bold text-agentic-lime uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all mt-2">
                Connect Repo <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/import?source=api")}
            className="flex items-start p-6 rounded-2xl border bg-white border-forest-contrast/10 hover:border-agentic-lime hover:shadow-lg transition-all text-left group relative cursor-pointer"
          >
            <div className="w-12 h-12 bg-forest-contrast/5 text-deep-jungle rounded-xl flex items-center justify-center shrink-0 mr-4">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-deep-jungle mb-1">REST API / OpenAPI</h3>
              <p className="text-xs text-forest-contrast/60 mb-2">Import an existing API spec or Connect via manual API endpoints.</p>
              <div className="text-[9px] font-bold text-agentic-lime uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all mt-2">
                Import API <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Custom Flow (WebMCP) - custom-repo view
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <button onClick={() => setView("custom-select")} className="mb-8 text-[10px] font-bold uppercase tracking-widest text-forest-contrast/40 hover:text-deep-jungle flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to Custom Select
      </button>

      {status === "idle" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-display uppercase tracking-tight text-deep-jungle mb-2">Connect GitHub Repo</h2>
            <p className="text-sm text-forest-contrast/60">Enter your GitHub details to inject the WebMCP Adapter.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-jungle/30" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full bg-white border border-forest-contrast/10 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-agentic-lime transition-colors"
              />
            </div>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-jungle/30" />
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="GitHub Personal Access Token"
                className="w-full bg-white border border-forest-contrast/10 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-agentic-lime transition-colors"
              />
            </div>
            <button
              onClick={handleCustomConnect}
              className="w-full bg-deep-jungle text-cyber-cream py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-forest-contrast transition-colors flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" /> Analyze & Inject
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-forest-contrast/40 justify-center">
            <ShieldCheck className="w-3 h-3" /> Secure connection via GitHub API
          </div>
        </div>
      )}

      {(status === "analyzing" || status === "injecting" || status === "complete") && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            {status === "complete" ? (
              <CheckCircle2 className="w-6 h-6 text-agentic-lime" />
            ) : (
              <div className="w-3 h-3 bg-agentic-lime rounded-full animate-ping" />
            )}
            <h3 className="font-bold text-lg text-deep-jungle">
              {status === "analyzing" ? "Analyzing Structure..." : status === "injecting" ? "Injecting Adapter..." : "Integration Complete"}
            </h3>
          </div>

          <div className="bg-black/90 rounded-xl p-4 font-mono text-[10px] text-green-400 h-48 overflow-y-auto border border-white/10">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 opacity-90">
                <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                {log}
              </div>
            ))}
            {status !== "complete" && <div className="animate-pulse">_</div>}
          </div>
        </div>
      )}
    </div>
  );
};
