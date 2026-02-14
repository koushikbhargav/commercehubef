"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Copy,
  Settings,
  Zap,
  Search,
  Package,
  CreditCard,
  Cloud,
  Database,
  ArrowRight,
  Sparkles,
  MousePointer2,
  Terminal,
  Globe,
  Link,
  Code,
  ShieldCheck,
  Share2,
  Download,
  BookOpen,
  FileJson
} from "lucide-react";
import { useStore } from "@/app/lib/store";
import { generateAndDownloadServer } from "@/app/lib/generator";

export default function Dashboard() {
  const router = useRouter();
  const { getActiveStore, merchant } = useStore();
  const store = getActiveStore();
  const mcpUrl = `mcp://${store.domain || store.id + '.commercehub.ai'}`;
  const [activeAgent, setActiveAgent] = useState('claude');
  const [downloading, setDownloading] = useState(false);

  // Authentication Guard
  React.useEffect(() => {
    if (!merchant.user) {
      router.push('/onboarding');
    }
  }, [merchant.user, router]);

  if (!merchant.user) {
    return null; // Or a loading spinner
  }

  const handleDownloadServer = async () => {
    setDownloading(true);
    await generateAndDownloadServer(store);
    setTimeout(() => setDownloading(false), 1000);
  };

  const agentConfigs: Record<string, { name: string; icon: string; fileName: string; config: object; steps: string[] }> = {
    claude: {
      name: 'Claude Desktop',
      icon: '🟣',
      fileName: 'claude_desktop_config.json',
      config: {
        mcpServers: {
          [store.id]: {
            command: 'npx',
            args: ['-y', `@commercehub/${store.id}-mcp-server`]
          }
        }
      },
      steps: [
        'Copy the configuration JSON below.',
        'Open Settings → Developer → Edit Config.',
        'Paste it under the "mcpServers" key.',
        'Restart Claude Desktop.'
      ]
    },
    chatgpt: {
      name: 'ChatGPT',
      icon: '🟢',
      fileName: 'chatgpt_mcp_config.json',
      config: {
        mcpServers: {
          [store.id]: {
            url: mcpUrl,
            transport: 'sse',
            apiKey: 'sk_live_...'
          }
        }
      },
      steps: [
        'Open ChatGPT → Settings → Connections.',
        'Click "Add MCP Server".',
        'Paste the URL and API key below.',
        'Save and start chatting with your inventory.'
      ]
    },
    gemini: {
      name: 'Gemini',
      icon: '🔵',
      fileName: 'gemini_mcp_config.json',
      config: {
        mcpServers: {
          [store.id]: {
            url: mcpUrl,
            transport: 'sse',
            apiKey: 'sk_live_...'
          }
        }
      },
      steps: [
        'Open Google AI Studio → Tools → MCP.',
        'Click "Connect MCP Server".',
        'Paste the server URL and API key.',
        'Your inventory tools will appear in Gemini.'
      ]
    },
    copilot: {
      name: 'GitHub Copilot',
      icon: '⚫',
      fileName: '.vscode/mcp.json',
      config: {
        servers: {
          [store.id]: {
            command: 'npx',
            args: ['-y', `@commercehub/${store.id}-mcp-server`]
          }
        }
      },
      steps: [
        'Open VS Code → Settings (JSON).',
        'Add the MCP config to your workspace .vscode/mcp.json.',
        'Copilot will auto-discover your store tools.',
        'Use @mcp in Copilot Chat to query inventory.'
      ]
    },
    cursor: {
      name: 'Cursor',
      icon: '⬛',
      fileName: '.cursor/mcp.json',
      config: {
        mcpServers: {
          [store.id]: {
            command: 'npx',
            args: ['-y', `@commercehub/${store.id}-mcp-server`]
          }
        }
      },
      steps: [
        'Open Cursor → Settings → MCP.',
        'Click "Add new global MCP server".',
        'Paste the JSON config below.',
        'Restart Cursor to see your CommerceHub tools.'
      ]
    }
  };

  const activeConfig = agentConfigs[activeAgent];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero / Header Section */}
      <section className="relative pt-24 min-h-[70vh] flex flex-col justify-center overflow-hidden">
        {/* Arch Pattern */}
        <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 dither-mesh opacity-[0.07]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#EAFF94_0%,transparent_60%)] opacity-[0.15]"></div>
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_110%,black_20%,transparent_70%)] bg-deep-jungle/5 dither-mesh"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <span className="bg-agentic-lime text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] rounded-full border border-forest-contrast/10">
              Secure Node
            </span>
            <span className="text-[10px] font-bold text-forest-contrast/40 uppercase tracking-[0.4em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-agentic-lime rounded-full shadow-[0_0_8px_rgba(234,255,148,0.8)] animate-pulse"></span>{" "}
              {store.domain}
            </span>
          </div>

          <h1 className="text-[10rem] md:text-[14rem] font-display tracking-tighter leading-[0.75] text-deep-jungle mb-12 uppercase">
            {store.name.split("'")[0]}
            <span className="text-forest-contrast/20">'</span>s<br />
            <span className="text-accent-contrast">Boutique</span>
          </h1>

          <p className="text-xl font-medium text-forest-contrast/60 leading-relaxed max-w-2xl mb-16 uppercase tracking-tight">
            Orchestrating autonomous agents and universal commerce
            interoperability for your merchant repository.
          </p>

          <div className="flex items-center gap-6 mb-24">
            <button
              onClick={() => router.push("/test-agent")}
              className="px-12 py-5 bg-deep-jungle text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
            >
              Launch Agent Console
            </button>
            <button
              onClick={() => router.push("/data")}
              className="px-12 py-5 bg-white border border-forest-contrast/10 text-deep-jungle rounded-xl text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-forest-contrast/5 transition-all"
            >
              Protocol Hub
            </button>
          </div>
        </div>

        {/* Deployment Metadata Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-sage-light/30 backdrop-blur-md border-t border-brand-green/10 py-4 px-8 flex justify-center gap-12 overflow-hidden">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green/60">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            Node ID: <span className="text-brand-green">{store.id}-commercehub-mainnet</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green/60">
            <Globe className="w-4 h-4 text-brand-green" />
            Registry: <span className="text-brand-green">CommerceHub Universal Central</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green/60">
            <Terminal className="w-4 h-4 text-brand-green" />
            Protocol: <span className="text-brand-green">MCP 1.0 / UCP 2.4</span>
          </div>
        </div>
      </section>

      {/* Primary Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <StatCard
          label="Repository Items"
          value={store.stats.products.toLocaleString()}
          subtext="Protocol Synchronized"
          icon={Package}
        />
        <StatCard
          label="Agent Queries"
          value={store.stats.visits.toString()}
          subtext="Market Active"
          icon={Activity}
          trend="up"
        />
        <StatCard
          label="Estimated Revenue"
          value={store.stats.revenue}
          subtext="Settled in UCP"
          icon={CreditCard}
          trend="up"
        />
      </section>

      {/* Contrast Interaction Section */}
      <section className="bg-sage-light rounded-[2rem] p-4 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 dither-mesh opacity-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10">
          {/* Recent Activity (Midnight Style) */}
          <div className="lg:col-span-2 bg-white/20 border border-brand-green/10 rounded-[1.8rem] backdrop-blur-3xl overflow-hidden flex flex-col">
            <div className="px-10 py-8 border-b border-brand-green/10 flex items-center justify-between">
              <h3 className="font-display text-2xl text-brand-green uppercase tracking-tight">
                Recent Orchestration
              </h3>
              <button className="text-[9px] font-bold text-brand-green hover:underline flex items-center gap-2 uppercase tracking-[0.2em] transition-all">
                Full Protocol Logs <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-brand-green/5 flex-1">
              {store.recentActivity.map((activity, i) => (
                <ActivityRow
                  key={i}
                  time={activity.time}
                  agent={activity.agent}
                  action={activity.action}
                  icon={getIconForType(activity.icon)}
                  isDark={false}
                />
              ))}
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-4">
            {/* Connection Status Panel */}
            <div className="bg-agentic-lime rounded-[1.8rem] p-10 text-white flex flex-col justify-between min-h-[300px]">
              <div>
                <Cloud className="w-10 h-10 mb-8 text-white/30" />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-2 opacity-60">
                  Source Node
                </p>
                <h4 className="text-3xl font-display leading-none uppercase mb-8">
                  {store.source}
                </h4>
                <div className="space-y-4 border-t border-white/10 pt-8 text-[12px] font-bold uppercase tracking-widest">
                  <div className="flex justify-between items-center">
                    <span className="opacity-40">Status</span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full"></span>{" "}
                      Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-40">Frequency</span>
                    <span>15m Realtime</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push("/data")}
                className="mt-8 bg-white text-deep-jungle py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-[1.02] transition-transform"
              >
                Configure Protocol
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white/10 border border-brand-green/10 rounded-[1.8rem] p-10 text-brand-green backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 opacity-40">
                Quick Actions
              </p>
              <div className="space-y-3">
                <QuickAction
                  label="Test Transaction"
                  icon={Zap}
                  isDark={false}
                />
                <QuickAction
                  label="View Mapping"
                  icon={Database}
                  isDark={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Infrastructure (Merchant Technical Section) */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display uppercase text-deep-jungle mb-2 tracking-tight">Deployment Infrastructure</h2>
            <p className="text-[10px] font-bold text-forest-contrast/40 uppercase tracking-[0.4em]">Developer Endpoints & Node Connectivity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DeploymentCard
            label="MCP Protocol URL"
            value={mcpUrl}
            icon={Link}
            description="Universal connection string for AI agents and LLMs to interface with your inventory."
          />
          <DeploymentCard
            label="Universal Checkout Flow"
            value={`https://pay.commercehub.ai/${store.id}`}
            icon={CreditCard}
            description="Agentic payment execution link. Settlement happens automatically via UCP protocol."
          />
          <DeploymentCard
            label="Inventory Agent API"
            value={`https://api.commercehub.ai/v1/${store.id}/mcp`}
            icon={Code}
            description="Secure REST endpoint for manual system integrations and headless orchestration."
          />
        </div>
      </section>

      {/* Share Server Connectivity — Multi-LLM Agent Support */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display uppercase text-deep-jungle mb-2 tracking-tight">Share Server Connectivity</h2>
            <p className="text-[10px] font-bold text-forest-contrast/40 uppercase tracking-[0.4em]">Connect Your Store to AI Agents</p>
          </div>
        </div>

        <div className="bg-white border border-forest-contrast/5 rounded-[2.5rem] p-10 shadow-sm border-l-4 border-l-brand-green">
          {/* Agent Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-sage-light/30 rounded-2xl border border-brand-green/5">
            {Object.entries(agentConfigs).map(([key, agent]) => (
              <button
                key={key}
                onClick={() => setActiveAgent(key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeAgent === key
                  ? 'bg-deep-jungle text-white shadow-lg'
                  : 'text-forest-contrast/50 hover:text-deep-jungle hover:bg-white/60'
                  }`}
              >
                <span className="text-sm">{agent.icon}</span>
                {agent.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-deep-jungle">Connect to {activeConfig.name}</h3>
              </div>
              <p className="text-sm text-forest-contrast/70 mb-8 leading-relaxed">
                Add your merchant store to {activeConfig.name} to allow it to browse your inventory, check stock, and assist customers directly.
              </p>

              <ol className="space-y-4 mb-8">
                {activeConfig.steps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-[11px] font-bold text-deep-jungle/60 uppercase tracking-widest">
                    <span className="text-brand-green">0{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>

              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(activeConfig.config, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = activeConfig.fileName;
                  a.click();
                }}
                className="flex items-center gap-3 bg-deep-jungle text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Config File
              </button>

              <button
                onClick={handleDownloadServer}
                disabled={downloading}
                className="flex items-center gap-3 bg-white border-2 border-deep-jungle text-deep-jungle px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-sage-light/30 transition-colors disabled:opacity-50"
              >
                <Package className="w-4 h-4" />
                {downloading ? 'Downloaded!' : 'Download Server Code (.zip)'}
              </button>
            </div>

            <div className="relative group">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(activeConfig.config, null, 2))}
                  className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-brand-green text-[9px] font-bold uppercase tracking-wider shadow-sm hover:bg-white transition-colors border border-brand-green/10"
                >
                  Copy JSON
                </button>
              </div>
              <div className="bg-sage-light/30 rounded-3xl p-6 font-mono text-[11px] text-deep-jungle/80 overflow-hidden border border-brand-green/5 h-full min-h-[300px]">
                <div className="flex items-center gap-2 mb-4 text-forest-contrast/30">
                  <FileJson className="w-4 h-4" />
                  <span>{activeConfig.fileName}</span>
                </div>
                <pre className="overflow-x-auto">
                  {JSON.stringify(activeConfig.config, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DeploymentCard({ label, value, icon: Icon, description }: any) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    // Simple visual feedback could be added here
  };

  return (
    <div className="bg-white border border-forest-contrast/5 rounded-[2rem] p-8 hover:border-brand-green/20 transition-all shadow-sm group">
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 bg-sage-light rounded-2xl flex items-center justify-center text-brand-green shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <button
          onClick={copyToClipboard}
          className="text-[9px] font-extrabold uppercase tracking-[.2em] text-brand-green hover:bg-sage-light px-3 py-1.5 rounded-lg transition-colors border border-brand-green/5"
        >
          Copy Link
        </button>
      </div>
      <p className="text-[10px] font-bold text-forest-contrast/40 uppercase tracking-[0.4em] mb-4">{label}</p>
      <div className="font-mono text-xs bg-sage-light/30 p-4 rounded-xl text-deep-jungle/80 break-all mb-6 border border-brand-green/5">
        {value}
      </div>
      <p className="text-[11px] font-medium text-forest-contrast/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function getIconForType(type: string) {
  switch (type) {
    case "search":
      return Search;
    case "cart":
      return CreditCard;
    case "box":
      return Package;
    default:
      return Activity;
  }
}

function StatCard({ label, value, subtext, trend }: any) {
  return (
    <div className="group border-l border-forest-contrast/10 pl-8 transition-all hover:border-agentic-lime">
      <p className="text-[10px] font-bold text-forest-contrast/40 uppercase tracking-[0.4em] mb-6">
        {label}
      </p>
      <div className="flex items-baseline gap-4">
        <h3 className="text-7xl font-display tracking-tighter text-deep-jungle leading-none">
          {value}
        </h3>
        {trend && (
          <span className="text-agentic-lime font-mono text-sm">↑</span>
        )}
      </div>
      <p className="text-[11px] font-bold text-forest-contrast/70 mt-4 uppercase tracking-widest flex items-center gap-2">
        {subtext}
      </p>
    </div>
  );
}

function ActivityRow({ time, agent, action, icon: Icon, isDark }: any) {
  return (
    <div
      className={`px-10 py-8 flex items-center gap-10 hover:bg-white/5 transition-colors`}
    >
      <div
        className={`text-[9px] font-bold ${isDark ? "text-white/30" : "text-forest-contrast/30"} w-16 uppercase tracking-[0.3em] shrink-0`}
      >
        {time}
      </div>
      <div
        className={`w-12 h-12 ${isDark ? "bg-white/10" : "bg-black"} text-white flex items-center justify-center shrink-0 rounded-full border border-white/5`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${isDark ? "text-white/80" : "text-deep-jungle"} leading-relaxed font-medium`}
        >
          <span className="text-agentic-lime font-bold">{agent} Agent</span>{" "}
          {action}
        </p>
      </div>
    </div>
  );
}

function QuickAction({ label, icon: Icon, isDark }: any) {
  return (
    <button
      className={`w-full flex items-center justify-between p-5 ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-black"} text-white rounded-2xl transition-all group border border-white/5`}
    >
      <div className="flex items-center gap-4">
        <Icon className="w-4 h-4 text-agentic-lime" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
          {label}
        </span>
      </div>
      <ArrowRight className="w-3 h-3 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </button>
  );
}
