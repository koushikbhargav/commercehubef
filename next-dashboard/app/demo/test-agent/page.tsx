"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Bot,
  Sparkles,
  Terminal,
  ShoppingBag,
  Zap,
  RefreshCw,
  Settings,
} from "lucide-react";
import { useStore } from "@/app/lib/store";
import { AppLayout } from "@/app/components/ui/AppLayout";
import { HaloCard } from "@/app/components/ui/HaloCard";
import { HaloButton } from "@/app/components/ui/HaloButton";
import { HaloBadge } from "@/app/components/ui/HaloBadge";
import { HaloInput } from "@/app/components/ui/HaloInput";
import { CornerMarkers } from "@/app/components/ui/CornerMarkers";

export default function TestAgent() {
  const router = useRouter();
  const { getActiveStore } = useStore();
  const store = getActiveStore();

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);


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

    const userMsg = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    // Dynamic response based on active store
    const response = generateMockResponse(query, store);

    // Stream the text response
    let currentText = "";
    const fullText = response.text;

    // Add initial empty message
    setMessages((prev) => [...prev, { ...response, text: "" }]);
    setLoading(false);

    // Stream characters
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = currentText;
          return newMsgs;
        });
        i++;
        scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const prefill = (text: string) => {
    setQuery(text);
  };

  if (!isHydrated) return null;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-[var(--border)] flex-shrink-0">
          <div>
            <button
              onClick={() => router.push("/demo/dashboard")}
              className="flex items-center font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-3 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
              Dashboard
            </button>
            <h1 className="text-2xl font-medium text-[var(--foreground)] tracking-tight">
              Agent Console
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Test how AI agents interact with your store
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <HaloBadge variant="success" dot>
              Connected • v1.4.02
            </HaloBadge>
          </div>
        </div>

        {/* Chat Container */}
        <HaloCard corners className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Chat Header Bar */}
          <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--brand)] text-[var(--brand-foreground)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-olive rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-[var(--brand)]" />
              </div>
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em]">
                  COMMERCEHUB Agent • Online
                </h3>
                <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em] opacity-70">
                  <span className="w-1.5 h-1.5 bg-olive rounded-full" />
                  Ready
                </span>
              </div>
            </div>
            <button className="p-1.5 hover:bg-white/10 rounded-[var(--radius)] transition-colors opacity-60 hover:opacity-100">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[var(--card)]">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 bg-[var(--muted)] rounded-[var(--radius)] flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-[var(--muted-foreground)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                  Try asking your agent...
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-6">
                  See how your CommerceHub server responds to customer queries
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  {getExampleQueries(store.id).map((q, i) => (
                    <HaloButton
                      key={i}
                      variant="ghost"
                      size="sm"
                      onClick={() => prefill(q)}
                    >
                      {q}
                    </HaloButton>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-[var(--radius)] p-4 ${msg.role === "user"
                    ? "bg-[var(--brand)] text-[var(--brand-foreground)]"
                    : "bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
                    }`}
                >
                  {msg.role === "agent" && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap className="w-3 h-3 text-olive" />
                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-olive">
                        Agent Response
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>

                  {msg.items && (
                    <div className="mt-4 space-y-2">
                      {msg.items.map((item: any, j: number) => (
                        <div
                          key={j}
                          className="flex gap-3 p-3 bg-[var(--background)] rounded-[var(--radius)] border border-[var(--border)]"
                        >
                          <div className="w-10 h-10 bg-[var(--muted)] rounded-[var(--radius)] flex-shrink-0 flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-[var(--muted-foreground)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              {item.name}
                            </p>
                            <p className="text-sm font-mono text-olive mt-0.5">
                              {item.currency} {item.price}
                            </p>
                            <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[var(--muted-foreground)] mt-1">
                              {item.stock} in stock
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.tools && (
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Terminal className="w-3 h-3 text-[var(--muted-foreground)]" />
                        <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
                          Tools Used
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.tools.map((tool: string, k: number) => (
                          <code
                            key={k}
                            className="text-[9px] font-mono bg-[var(--background)] px-2 py-1 border border-[var(--border)] rounded-[var(--radius)] text-[var(--muted-foreground)]"
                          >
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
                <div className="bg-[var(--muted)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-olive rounded-full animate-pulse" />
                  <span
                    className="w-1.5 h-1.5 bg-olive rounded-full animate-pulse"
                    style={{ animationDelay: "75ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-olive rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]">
            <form onSubmit={handleSend} className="flex gap-3">
              <HaloInput
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your agent anything..."
                className="flex-1"
              />
              <HaloButton
                type="submit"
                variant="cta"
                size="md"
                disabled={!query.trim() || loading}
                arrow={false}
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </HaloButton>
            </form>
          </div>
        </HaloCard>
      </div>
    </AppLayout>
  );
}

/* ── Helpers ─────────────────────────────────── */

function getExampleQueries(storeId: string) {
  if (storeId === "tech")
    return [
      "Find gaming keyboards",
      "Show me high-end monitors",
      "Check stock for headset",
      "Create cart with monitor",
    ];
  if (storeId === "green")
    return [
      "Find indoor plants",
      "Show me pots under $50",
      "How much is fertilizer?",
      "Check Monstera stock",
    ];
  return [
    "Find red dresses under $100",
    "Show me best selling items",
    "Check inventory for product #p1",
    "Complete a test purchase",
  ];
}

function generateMockResponse(query: string, store: any) {
  const q = query.toLowerCase();
  let items = [];
  let text = "";

  if (q.includes("find") || q.includes("show") || q.includes("search")) {
    items = store.inventory.slice(0, 2);
    text = `I found ${store.inventory.length} items matching your request. Here are the top results:`;
  } else if (q.includes("stock") || q.includes("inventory")) {
    items = [store.inventory[0]];
    text = `Checking real-time inventory... ${items[0].name} has ${items[0].stock} units available.`;
  } else {
    text =
      "I can help you find products, check inventory, or place orders. What would you like to do?";
  }

  return {
    role: "agent",
    text,
    items: items.length > 0 ? items : undefined,
    tools: [
      `search_products(query="${query}")`,
      `get_product_details(merchant_id="${store.id}")`,
    ],
  };
}