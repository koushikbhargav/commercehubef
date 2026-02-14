'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, ArrowRight, Terminal, Download, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStore } from '@/app/lib/store';
import { generateAndDownloadServer } from '@/app/lib/generator';

export default function DeploymentSuccess() {
  const router = useRouter();
  const { getActiveStore } = useStore();
  // Handle hydration to ensure we have the correct store data
  const [isHydrated, setIsHydrated] = useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const store = getActiveStore();
  const [downloading, setDownloading] = useState(false);
  const [activeAgent, setActiveAgent] = useState('claude');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#ffffff', '#555555']
    });
  }, []);

  if (!isHydrated) return null;

  const handleDownload = async () => {
    setDownloading(true);
    await generateAndDownloadServer(store);
    setTimeout(() => setDownloading(false), 1000);
  };

  const mcpUrl = `mcp://${store.domain?.split('.')[0] || store.id}.commercehub.ai`;

  const agentConfigs: Record<string, { name: string; icon: string; config: object }> = {
    claude: {
      name: 'Claude Desktop',
      icon: '🟣',
      config: {
        mcpServers: {
          [store.id]: {
            command: 'npx',
            args: ['-y', `@commercehub/${store.id}-mcp-server`]
          }
        }
      }
    },
    chatgpt: {
      name: 'ChatGPT',
      icon: '🟢',
      config: {
        mcpServers: {
          [store.id]: {
            url: mcpUrl,
            transport: 'sse',
            apiKey: 'sk_live_...'
          }
        }
      }
    },
    gemini: {
      name: 'Gemini',
      icon: '🔵',
      config: {
        mcpServers: {
          [store.id]: {
            url: mcpUrl,
            transport: 'sse',
            apiKey: 'sk_live_...'
          }
        }
      }
    },
    copilot: {
      name: 'GitHub Copilot',
      icon: '⚫',
      config: {
        servers: {
          [store.id]: {
            command: 'npx',
            args: ['-y', `@commercehub/${store.id}-mcp-server`]
          }
        }
      }
    },
    cursor: {
      name: 'Cursor',
      icon: '⬛',
      config: {
        mcpServers: {
          [store.id]: {
            command: 'npx',
            args: ['-y', `@commercehub/${store.id}-mcp-server`]
          }
        }
      }
    }
  };

  const activeConfig = agentConfigs[activeAgent];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-display text-slate-900 mb-2">Your MCP Server is Live!</h1>
        <p className="text-slate-500">{store.name} is now accessible to autonomous AI agents.</p>
      </motion.div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-left shadow-sm mb-8">
        {/* Server URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-500 mb-2">Server URL</label>
          <div className="flex gap-2">
            <code className="flex-1 block px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-mono text-slate-600">
              {mcpUrl}
            </code>
            <button
              onClick={() => handleCopy(mcpUrl)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Multi-LLM Agent Tabs */}
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-3">Agent Configuration</label>

          <div className="flex flex-wrap gap-1.5 mb-4 p-1 bg-slate-50 rounded-xl border border-slate-100">
            {Object.entries(agentConfigs).map(([key, agent]) => (
              <button
                key={key}
                onClick={() => setActiveAgent(key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeAgent === key
                  ? 'bg-black text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-white/80'
                  }`}
              >
                <span>{agent.icon}</span>
                {agent.name}
              </button>
            ))}
          </div>

          <div className="bg-black rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{JSON.stringify(activeConfig.config, null, 2)}</pre>
          </div>
          <button
            onClick={() => handleCopy(JSON.stringify(activeConfig.config, null, 2))}
            className="mt-2 text-sm text-blue-600 font-medium flex items-center hover:underline"
          >
            {copied ? (
              <><Check className="w-3 h-3 mr-1 text-green-500" /> Copied!</>
            ) : (
              <><Copy className="w-3 h-3 mr-1" /> Copy to clipboard</>
            )}
          </button>
        </div>

        {/* Self-Host Download */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-2">Self-Host Your Server</h3>
          <p className="text-sm text-slate-500 mb-4">
            Prefer to run this on your own infrastructure? Download the generated Node.js server code.
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
          >
            {downloading ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Server Code (.zip)
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/test-agent')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Terminal className="w-4 h-4" />
          Test with Demo Agent
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
        >
          View Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}