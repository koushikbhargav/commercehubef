"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Check,
  Package,
  CreditCard,
  Cloud,
  Link,
  Code,
  Share2,
  Download,
  FileJson,
  Search,
  Activity,
} from "lucide-react";
import { useStore } from "@/app/lib/store";
import { generateAndDownloadServer } from "@/app/lib/generator";
import { AppLayout } from "@/app/components/ui/AppLayout";
import { HaloCard } from "@/app/components/ui/HaloCard";
import { HaloButton } from "@/app/components/ui/HaloButton";
import { HaloBadge } from "@/app/components/ui/HaloBadge";
import {
  HaloTable,
  HaloTableHead,
  HaloTableHeader,
  HaloTableBody,
  HaloTableRow,
  HaloTableCell,
} from "@/app/components/ui/HaloTable";

export default function Dashboard() {
  const router = useRouter();
  const { getActiveStore, merchant } = useStore();
  const store = getActiveStore();
  const mcpUrl = `mcp://${store.domain || store.id + ".commercehub.ai"}`;
  const [activeAgent, setActiveAgent] = useState("claude");
  const [isHydrated, setIsHydrated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Handle hydration to prevent store mismatch
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Authentication Guard
  React.useEffect(() => {
    if (isHydrated && !merchant.user) {
      router.push("/demo/onboarding");
    }
  }, [isHydrated, merchant.user, router]);

  if (!isHydrated) {
    return null; // Prevent flash of content or redirect before hydration
  }

  if (!merchant.user) {
    return null;
  }

  const handleDownloadServer = async () => {
    setDownloading(true);
    await generateAndDownloadServer(store);
    setTimeout(() => setDownloading(false), 1000);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const agentConfigs: Record<
    string,
    {
      name: string;
      icon: string;
      fileName: string;
      config: object;
      steps: string[];
    }
  > = {
    claude: {
      name: "Claude Desktop",
      icon: "🟣",
      fileName: "claude_desktop_config.json",
      config: {
        mcpServers: {
          [store.id]: {
            command: "npx",
            args: ["-y", `@commercehub/${store.id}-mcp-server`],
          },
        },
      },
      steps: [
        "Copy the configuration JSON below.",
        "Open Settings → Developer → Edit Config.",
        'Paste it under the "mcpServers" key.',
        "Restart Claude Desktop.",
      ],
    },
    chatgpt: {
      name: "ChatGPT",
      icon: "🟢",
      fileName: "chatgpt_mcp_config.json",
      config: {
        mcpServers: {
          [store.id]: {
            url: mcpUrl,
            transport: "sse",
            apiKey: "sk_live_...",
          },
        },
      },
      steps: [
        "Open ChatGPT → Settings → Connections.",
        'Click "Add MCP Server".',
        "Paste the URL and API key below.",
        "Save and start chatting with your inventory.",
      ],
    },
    gemini: {
      name: "Gemini",
      icon: "🔵",
      fileName: "gemini_mcp_config.json",
      config: {
        mcpServers: {
          [store.id]: {
            url: mcpUrl,
            transport: "sse",
            apiKey: "sk_live_...",
          },
        },
      },
      steps: [
        "Open Google AI Studio → Tools → MCP.",
        'Click "Connect MCP Server".',
        "Paste the server URL and API key.",
        "Your inventory tools will appear in Gemini.",
      ],
    },
    copilot: {
      name: "GitHub Copilot",
      icon: "⚫",
      fileName: ".vscode/mcp.json",
      config: {
        servers: {
          [store.id]: {
            command: "npx",
            args: ["-y", `@commercehub/${store.id}-mcp-server`],
          },
        },
      },
      steps: [
        "Open VS Code → Settings (JSON).",
        "Add the MCP config to your workspace .vscode/mcp.json.",
        "Copilot will auto-discover your store tools.",
        "Use @mcp in Copilot Chat to query inventory.",
      ],
    },
    cursor: {
      name: "Cursor",
      icon: "⬛",
      fileName: ".cursor/mcp.json",
      config: {
        mcpServers: {
          [store.id]: {
            command: "npx",
            args: ["-y", `@commercehub/${store.id}-mcp-server`],
          },
        },
      },
      steps: [
        "Open Cursor → Settings → MCP.",
        'Click "Add new global MCP server".',
        "Paste the JSON config below.",
        "Restart Cursor to see your CommerceHub tools.",
      ],
    },
  };

  const activeConfig = agentConfigs[activeAgent];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-medium text-[var(--foreground)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Welcome back — here&apos;s what&apos;s happening with{" "}
            {store.name}.
          </p>
        </div>

        {/* ── Top Row: 3 Stat Cards ──────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* MCP Server */}
          <HaloCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                MCP Server
              </span>
              <HaloBadge variant="success" dot>
                Connected
              </HaloBadge>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono text-[var(--foreground)] bg-[var(--muted)] px-3 py-2 rounded-[var(--radius)] truncate border border-[var(--border)]">
                {mcpUrl}
              </code>
              <button
                onClick={() => copyToClipboard(mcpUrl, "mcp")}
                className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex-shrink-0"
                title="Copy URL"
              >
                {copiedField === "mcp" ? (
                  <Check className="w-3.5 h-3.5 text-olive" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </HaloCard>

          {/* Agent Queries */}
          <HaloCard className="p-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Agent Queries
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-medium tracking-tight text-[var(--foreground)]">
                {store.stats.visits}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                Today
              </span>
            </div>
          </HaloCard>

          {/* Products Synced */}
          <HaloCard className="p-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Products Synced
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-medium tracking-tight text-[var(--foreground)]">
                {store.stats.products.toLocaleString()}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                Last sync: 2m ago
              </span>
            </div>
          </HaloCard>
        </div>

        {/* ── Middle Row: Activity Chart Placeholder ── */}
        <HaloCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Agent Activity
            </span>
            <HaloBadge variant="info">Coming Soon</HaloBadge>
          </div>
          <div className="h-36 flex items-center justify-center border border-dashed border-[var(--border)] rounded-[var(--radius)]">
            <div className="flex flex-col items-center gap-2 text-[var(--muted-foreground)]">
              <Activity className="w-5 h-5 opacity-40" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]">
                Query volume chart
              </span>
            </div>
          </div>
        </HaloCard>

        {/* ── Bottom: Recent Agent Activity Table ──── */}
        <HaloCard>
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Recent Agent Activity
            </span>
            <HaloButton
              variant="ghost"
              size="sm"
              onClick={() => router.push("/demo/data")}
            >
              View All
            </HaloButton>
          </div>
          <HaloTable>
            <HaloTableHead>
              <tr>
                <HaloTableHeader>Agent</HaloTableHeader>
                <HaloTableHeader>Query</HaloTableHeader>
                <HaloTableHeader>Time</HaloTableHeader>
                <HaloTableHeader>Status</HaloTableHeader>
              </tr>
            </HaloTableHead>
            <HaloTableBody>
              {store.recentActivity.map((activity, i) => (
                <HaloTableRow key={i}>
                  <HaloTableCell>
                    <span className="font-medium text-[var(--foreground)]">
                      {activity.agent}
                    </span>
                  </HaloTableCell>
                  <HaloTableCell>
                    <span className="text-[var(--muted-foreground)]">
                      {activity.action}
                    </span>
                  </HaloTableCell>
                  <HaloTableCell>
                    <span className="font-mono text-xs text-[var(--muted-foreground)]">
                      {activity.time}
                    </span>
                  </HaloTableCell>
                  <HaloTableCell>
                    <HaloBadge variant="success" dot>
                      Completed
                    </HaloBadge>
                  </HaloTableCell>
                </HaloTableRow>
              ))}
              {store.recentActivity.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      No activity yet
                    </span>
                  </td>
                </tr>
              )}
            </HaloTableBody>
          </HaloTable>
        </HaloCard>

        {/* ── Endpoints ─────────────────────────────── */}
        <div>
          <h2 className="text-lg font-medium text-[var(--foreground)] tracking-tight mb-1">
            Endpoints
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Connection strings for AI agents and integrations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EndpointCard
              label="MCP Server URL"
              value={mcpUrl}
              copied={copiedField === "ep-mcp"}
              onCopy={() => copyToClipboard(mcpUrl, "ep-mcp")}
            />
            <EndpointCard
              label="Checkout Link"
              value={`https://pay.commercehub.ai/${store.id}`}
              copied={copiedField === "ep-pay"}
              onCopy={() =>
                copyToClipboard(
                  `https://pay.commercehub.ai/${store.id}`,
                  "ep-pay"
                )
              }
            />
            <EndpointCard
              label="REST API"
              value={`https://api.commercehub.ai/v1/${store.id}/mcp`}
              copied={copiedField === "ep-api"}
              onCopy={() =>
                copyToClipboard(
                  `https://api.commercehub.ai/v1/${store.id}/mcp`,
                  "ep-api"
                )
              }
            />
          </div>
        </div>

        {/* ── Connect Your Agent ─────────────────── */}
        <div>
          <h2 className="text-lg font-medium text-[var(--foreground)] tracking-tight mb-1">
            Connect Your Agent
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Add your store to any AI agent
          </p>

          <HaloCard className="p-5">
            {/* Agent Tab Bar */}
            <div className="flex flex-wrap gap-1 mb-6 border-b border-[var(--border)] pb-4">
              {Object.entries(agentConfigs).map(([key, agent]) => (
                <button
                  key={key}
                  onClick={() => setActiveAgent(key)}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius)]
                    font-mono text-[9px] uppercase tracking-[0.15em] transition-colors
                    ${activeAgent === key
                      ? "bg-[var(--brand)] text-[var(--brand-foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                    }
                  `}
                >
                  <span className="text-sm">{agent.icon}</span>
                  {agent.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Steps */}
              <div>
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                  Connect to {activeConfig.name}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
                  Add your store to {activeConfig.name} so it can browse
                  products, check stock, and help customers.
                </p>

                <ol className="space-y-3 mb-6">
                  {activeConfig.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-[var(--muted-foreground)]"
                    >
                      <span className="font-mono text-[10px] text-[var(--brand)] font-medium w-5 flex-shrink-0 pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="flex flex-wrap gap-3">
                  <HaloButton
                    variant="primary"
                    size="md"
                    onClick={() => {
                      const blob = new Blob(
                        [JSON.stringify(activeConfig.config, null, 2)],
                        { type: "application/json" }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = activeConfig.fileName;
                      a.click();
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Config
                  </HaloButton>

                  <HaloButton
                    variant="outline"
                    size="md"
                    onClick={handleDownloadServer}
                    disabled={downloading}
                  >
                    <Package className="w-3.5 h-3.5" />
                    {downloading ? "Downloaded!" : "Download Server (.zip)"}
                  </HaloButton>
                </div>
              </div>

              {/* Config JSON Preview */}
              <div className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <HaloButton
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(activeConfig.config, null, 2),
                        "json"
                      )
                    }
                  >
                    {copiedField === "json" ? (
                      <>
                        <Check className="w-3 h-3" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy JSON
                      </>
                    )}
                  </HaloButton>
                </div>
                <div className="bg-[var(--muted)] border border-[var(--border)] rounded-[var(--radius)] p-4 font-mono text-xs text-[var(--foreground)] overflow-hidden min-h-[220px]">
                  <div className="flex items-center gap-2 mb-3 text-[var(--muted-foreground)]">
                    <FileJson className="w-3.5 h-3.5" />
                    <span className="text-[10px]">
                      {activeConfig.fileName}
                    </span>
                  </div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed">
                    {JSON.stringify(activeConfig.config, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </HaloCard>
        </div>
      </div>
    </AppLayout>
  );
}

/* ── Endpoint Card ────────────────────────── */

function EndpointCard({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <HaloCard className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          {label}
        </span>
        <button
          onClick={onCopy}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          title="Copy"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-olive" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <code className="block text-xs font-mono text-[var(--foreground)] bg-[var(--muted)] px-3 py-2 rounded-[var(--radius)] truncate border border-[var(--border)]">
        {value}
      </code>
    </HaloCard>
  );
}
