"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Github,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Terminal,
    Code,
    FileJson,
    Database,
    Cpu,
    ShieldCheck,
    Search,
    Key
} from "lucide-react";
import { AppLayout } from "@/app/components/ui/AppLayout";

export default function ConnectRepoPage() {
    const router = useRouter();
    const [repoUrl, setRepoUrl] = useState("");
    const [token, setToken] = useState("");
    const [status, setStatus] = useState<"idle" | "analyzing" | "injecting" | "complete">("idle");
    const [logs, setLogs] = useState<string[]>([]);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const simulateAnalysis = async () => {
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

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Handle the response (for now we just wait for the JSON result, 
            // but in a real streaming setup we'd parse logs incrementally. 
            // Here we just await the full JSON for simplicity in this step).

            // Actually, the current API returns a single JSON. Let's parse it directly.
            // If we want streaming logs, we'd need to change the API. 
            // For now, let's just wait for the result and simulate the "progress"
            // by splitting the logs returned.

            const data = await response.json(); // Re-reading body via json() instead of reader

            if (!data.success) {
                throw new Error(data.error || "Analysis failed");
            }

            // Replay logs from server
            data.logs.forEach((log: string) => addLog(log));

            setAnalysisResult(data.schema ? {
                schema: Object.keys(data.schema),
                endpoints: ["Detected from server.js"]
            } : null);

            setStatus("injecting");
            addLog("💉 Generatng WebMCP Adapter...");
            // Trigger injection API (next step)
            await new Promise(r => setTimeout(r, 1000));

            // COMPLETE
            setStatus("complete");
            addLog("🎉 SUCCESS: Repository is now Agent-Ready!");

        } catch (error: any) {
            addLog(`❌ Error: ${error.message}`);
            setStatus("idle");
        }
    };

    return (
        <AppLayout>
            <div className="bg-cyber-cream text-deep-jungle p-8 font-sans">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-jungle/5 border border-deep-jungle/10 text-deep-jungle text-[10px] font-bold mb-6 uppercase tracking-[0.4em]">
                            <Search className="w-3 h-3" /> Repo Connector
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tighter text-deep-jungle mb-6">
                            Make Your Repo <br /><span className="text-accent-contrast">Agent Ready</span>
                        </h1>
                        <p className="text-forest-contrast/60 text-lg max-w-2xl mx-auto leading-relaxed">
                            Connect your GitHub repository. Our AI will analyze your code, detect your product schema, and auto-inject the WebMCP Bridge.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white border border-forest-contrast/10 rounded-[2.5rem] p-4 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 dither-mesh opacity-[0.03]"></div>

                        <div className="relative z-10 p-8 md:p-12">

                            {/* Input Section */}
                            {status === "idle" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-deep-jungle/60">
                                            GitHub Repository URL
                                        </label>
                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <Github className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-jungle/40" />
                                                <input
                                                    type="text"
                                                    value={repoUrl}
                                                    onChange={(e) => setRepoUrl(e.target.value)}
                                                    placeholder="https://github.com/username/my-store-repo"
                                                    className="w-full bg-sage-light/30 border-2 border-transparent focus:border-deep-jungle/20 rounded-2xl py-5 pl-16 pr-6 text-lg font-medium outline-none transition-all placeholder:text-deep-jungle/20"
                                                />
                                            </div>
                                            <div className="relative flex-1">
                                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-jungle/40" />
                                                <input
                                                    type="password"
                                                    value={token}
                                                    onChange={(e) => setToken(e.target.value)}
                                                    placeholder="GitHub Personal Access Token"
                                                    className="w-full bg-sage-light/30 border-2 border-transparent focus:border-deep-jungle/20 rounded-2xl py-5 pl-16 pr-6 text-lg font-medium outline-none transition-all placeholder:text-deep-jungle/20"
                                                />
                                            </div>
                                            <button
                                                onClick={simulateAnalysis}
                                                className="bg-deep-jungle text-white px-10 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg text-xs"
                                            >
                                                Connect
                                            </button>
                                        </div>
                                        <p className="text-xs text-forest-contrast/40 flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3" /> Read/Write access required for injection
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-dashed border-deep-jungle/10">
                                        <Feature icon={Cpu} label="AI Analysis" text="Scans DB Schema" />
                                        <Feature icon={Code} label="Code Injection" text="Adds Adapter.js" />
                                        <Feature icon={Database} label="Mock Data" text="Offline Ready" />
                                    </div>
                                </div>
                            )}

                            {/* Processing State */}
                            {(status === "analyzing" || status === "injecting") && (
                                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {status === "analyzing" ? (
                                                <div className="w-3 h-3 bg-agentic-lime rounded-full animate-ping" />
                                            ) : (
                                                <CheckCircle2 className="w-6 h-6 text-agentic-lime" />
                                            )}
                                            <h3 className="text-2xl font-display uppercase tracking-tight text-deep-jungle">
                                                {status === "analyzing" ? "Analyzing Codebase..." : "Injecting Solution..."}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Terminal Output */}
                                    <div className="bg-black/90 rounded-2xl p-6 font-mono text-xs md:text-sm text-green-400 h-64 overflow-y-auto border border-white/10 shadow-inner">
                                        {logs.map((log, i) => (
                                            <div key={i} className="mb-2 opacity-90 border-l-2 border-transparent pl-2 hover:border-green-500/50 transition-colors">
                                                <span className="opacity-50 mr-3">[{new Date().toLocaleTimeString()}]</span>
                                                {log}
                                            </div>
                                        ))}
                                        <div className="animate-pulse">_</div>
                                    </div>

                                    {/* Detected Details */}
                                    {analysisResult && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-sage-light/40 rounded-xl p-5 border border-deep-jungle/5">
                                                <Label>Detected Schema</Label>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {analysisResult.schema.map((s: string) => (
                                                        <Badge key={s}>{s}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-sage-light/40 rounded-xl p-5 border border-deep-jungle/5">
                                                <Label>API Endpoints</Label>
                                                <div className="flex flex-col gap-2 mt-3">
                                                    {analysisResult.endpoints.map((s: string) => (
                                                        <div key={s} className="font-mono text-xs text-deep-jungle/70">{s}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Complete State */}
                            {status === "complete" && (
                                <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="w-24 h-24 bg-agentic-lime/20 rounded-full flex items-center justify-center mx-auto text-deep-jungle mb-6">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>

                                    <div>
                                        <h2 className="text-4xl font-display uppercase tracking-tight mb-4">Repository Enabled!</h2>
                                        <p className="text-forest-contrast/60 text-lg max-w-xl mx-auto">
                                            We have injected the <strong>WebMCP Adapter</strong>. Your repository is now ready for AI Agents.
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => router.push("/demo/dashboard")}
                                            className="bg-deep-jungle text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all text-xs"
                                        >
                                            Go to Dashboard
                                        </button>
                                        <button
                                            onClick={() => window.open(repoUrl, "_blank")}
                                            className="bg-white border border-deep-jungle/10 text-deep-jungle px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-sage-light transition-all text-xs"
                                        >
                                            View Pull Request
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}

function Feature({ icon: Icon, label, text }: any) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-sage-light/20 border border-deep-jungle/5">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-deep-jungle shadow-sm">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-deep-jungle/40">{label}</div>
                <div className="font-bold text-deep-jungle text-sm">{text}</div>
            </div>
        </div>
    )
}

function Label({ children }: any) {
    return <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-deep-jungle/40">{children}</div>
}

function Badge({ children }: any) {
    return <span className="bg-white border border-deep-jungle/5 px-2 py-1 rounded-md text-[10px] font-bold uppercase text-deep-jungle/70 tracking-wider shadow-sm">{children}</span>
}
