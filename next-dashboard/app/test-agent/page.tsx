'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  Terminal,
  ShoppingBag,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useStore } from '@/app/lib/store';

export default function TestAgent() {
  const router = useRouter();
  const { getActiveStore } = useStore();
  const store = getActiveStore();

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    // Dynamic response based on active store
    const response = generateMockResponse(query, store);

    // Stream the text response
    let currentText = '';
    const fullText = response.text;

    // Add initial empty message
    setMessages(prev => [...prev, { ...response, text: '' }]);
    setLoading(false);

    // Stream characters
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = currentText;
          return newMsgs;
        });
        i++;
        scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, 20); // Typing speed
  };

  const prefill = (text: string) => {
    setQuery(text);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-forest-contrast/10 pb-8">
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-[9px] font-bold uppercase tracking-[0.3em] text-forest-contrast/40 hover:text-deep-jungle transition-all group mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
            PROTOCOL OVERVIEW
          </button>
          <h1 className="text-6xl font-display uppercase tracking-tighter text-deep-jungle mb-2">Agent Console</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-forest-contrast/30">Autonomous Interoperability Simulation</p>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <div className="flex items-center gap-2 bg-agentic-lime/10 px-3 py-1.5 rounded-full border border-agentic-lime/20">
            <span className="w-1.5 h-1.5 bg-agentic-lime rounded-full animate-pulse shadow-[0_0_8px_rgba(234,255,148,0.8)]"></span>
            <span className="text-[8px] font-bold text-deep-jungle uppercase tracking-[0.2em]">NODE_CONNECTED: V1.4.02</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-forest-contrast/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 dither-mesh opacity-[0.02] pointer-events-none"></div>

        {/* Chat Header */}
        <div className="px-10 py-6 border-b border-forest-contrast/10 flex items-center justify-between bg-deep-jungle text-cyber-cream relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-agentic-lime rounded-full flex items-center justify-center text-deep-jungle">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em]">COMMERCEHUB_ORCHESTRATOR</h3>
              <p className="text-[8px] text-agentic-lime font-bold uppercase tracking-[0.4em]">Simulation Active</p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-agentic-lime">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-transparent relative z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 bg-deep-jungle rounded-3xl flex items-center justify-center mb-8 rotate-12 group hover:rotate-0 transition-all duration-500">
                <Sparkles className="w-10 h-10 text-agentic-lime" />
              </div>
              <h3 className="text-2xl font-display uppercase tracking-tight text-deep-jungle mb-8">Initiate Protocol Simulation</h3>
              <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                {getExampleQueries(store.id).map((q, i) => (
                  <ExampleBtn key={i} text={q} onClick={() => prefill(q)} />
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[90%] md:max-w-[70%] border ${msg.role === 'user'
                  ? 'bg-deep-jungle text-cyber-cream border-deep-jungle rounded-[1.5rem] rounded-tr-none'
                  : 'bg-white border-forest-contrast/10 shadow-lg rounded-[1.5rem] rounded-tl-none'
                } p-6`}>
                {msg.role === 'agent' && (
                  <div className="flex items-center gap-2 mb-4 text-[9px] font-bold text-agentic-lime uppercase tracking-[0.4em]">
                    <Zap className="w-3 h-3" /> AGENT_RESULT
                  </div>
                )}
                <p className={`text-[13px] leading-relaxed font-medium ${msg.role === 'user' ? 'text-cyber-cream/90' : 'text-deep-jungle'}`}>
                  {msg.text}
                </p>

                {msg.items && (
                  <div className="mt-6 space-y-3">
                    {msg.items.map((item: any, j: number) => (
                      <div key={j} className="flex gap-4 p-4 bg-forest-contrast/5 rounded-xl border border-forest-contrast/5 group hover:border-agentic-lime transition-all">
                        <div className="w-14 h-14 bg-white rounded-lg shrink-0 flex items-center justify-center border border-forest-contrast/5">
                          <ShoppingBag className="w-6 h-6 text-forest-contrast/20" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-deep-jungle">{item.name}</p>
                          <p className="text-[13px] font-mono font-bold text-agentic-lime mt-1">{item.currency} {item.price}</p>
                          <p className="text-[9px] font-bold text-forest-contrast/30 uppercase tracking-widest mt-1">AVAILABLE UNIT: {item.stock}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {msg.tools && (
                  <div className="mt-6 pt-4 border-t border-forest-contrast/5 space-y-3">
                    <div className="flex items-center gap-2 text-[8px] font-bold text-forest-contrast/40 uppercase tracking-[0.3em]">
                      <Terminal className="w-3 h-3" /> Protocol Interoperability Used
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.tools.map((tool: string, k: number) => (
                        <code key={k} className="text-[9px] font-mono bg-forest-contrast/[0.03] px-2 py-1 border border-forest-contrast/5 text-forest-contrast/60 lowercase">
                          {tool}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-forest-contrast/10 rounded-2xl px-6 py-4 shadow-sm flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-agentic-lime rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-agentic-lime rounded-full animate-pulse delay-75"></div>
                <div className="w-1.5 h-1.5 bg-agentic-lime rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-forest-contrast/5 border-t border-forest-contrast/10 relative z-10">
          <form onSubmit={handleSend} className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="INITIATE PROTOCOL CONVERSATION..."
              className="flex-1 px-8 py-5 bg-white border border-forest-contrast/10 rounded-2xl focus:outline-none focus:border-agentic-lime focus:shadow-[0_0_20px_rgba(234,255,148,0.1)] transition-all outline-none font-bold uppercase tracking-widest text-[10px]"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-10 bg-deep-jungle text-agentic-lime rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 transition-all font-bold uppercase tracking-[0.2em] text-[10px]"
            >
              SIMULATE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ExampleBtn({ text, onClick }: { text: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 bg-white border border-forest-contrast/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-forest-contrast/60 hover:border-agentic-lime hover:text-deep-jungle hover:shadow-xl transition-all"
    >
      {text}
    </button>
  );
}

// Helpers
function getExampleQueries(storeId: string) {
  if (storeId === 'tech') return ["Find gaming keyboards", "Show me high-end monitors", "Check stock for headset", "Create cart with monitor"];
  if (storeId === 'green') return ["Find indoor plants", "Show me pots under $50", "How much is fertilizer?", "Check Monstera stock"];
  return ["Find red dresses under $100", "Show me best selling items", "Check inventory for product #p1", "Complete a test purchase"];
}

function generateMockResponse(query: string, store: any) {
  // Simple keyword matching for demo
  const q = query.toLowerCase();
  let items = [];
  let text = "";

  if (q.includes('find') || q.includes('show') || q.includes('search')) {
    items = store.inventory.slice(0, 2);
    text = `I found ${store.inventory.length} items matching your request. Here are the top results:`;
  } else if (q.includes('stock') || q.includes('inventory')) {
    items = [store.inventory[0]];
    text = `Checking real-time inventory... ${items[0].name} has ${items[0].stock} units available.`;
  } else {
    text = "I can help you find products, check inventory, or place orders. What would you like to do?";
  }

  return {
    role: 'agent',
    text,
    items: items.length > 0 ? items : undefined,
    tools: [
      `search_products(query="${query}")`,
      `get_product_details(merchant_id="${store.id}")`
    ]
  };
}