'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

export default function WaitlistPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans selection:bg-agentic-lime selection:text-deep-jungle">

            {/* Background Ambience */}
            {/* Background Ambience Removed */}

            {/* Header Removed */}

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 pb-20">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-agentic-lime mb-10 shadow-[0_0_20px_rgba(202,255,51,0.1)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-agentic-lime animate-pulse" />
                    Early Access
                </div>

                {/* Hero Text */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8 max-w-5xl mx-auto leading-[0.9]">
                    The API for the <br />
                    <span className="text-agentic-lime">Agentic Economy</span>
                </h1>

                <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
                    Turn any inventory into an AI-native interface. <br className="hidden md:block" />
                    Let autonomous agents discover, query, and purchase your products.
                </p>

                {/* Form */}
                <div className="w-full max-w-md mx-auto">
                    {submitted ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-agentic-lime/10 rounded-full flex items-center justify-center mb-4 border border-agentic-lime/20">
                                <Check className="w-8 h-8 text-agentic-lime" />
                            </div>
                            <h3 className="text-xl font-display text-white mb-2">You're on the list.</h3>
                            <p className="text-sm text-white/40">We'll notify you when early access opens.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-6 text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="enter your email..."
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-agentic-lime/50 focus:bg-white/10 transition-all font-mono text-sm"
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-agentic-lime/20 to-deep-jungle/20 opacity-0 group-hover:opacity-100 -z-10 blur-xl transition-opacity duration-500" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black rounded-xl py-4 font-bold uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Join Waitlist <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>


                        </form>
                    )}
                </div>
            </main>


        </div>
    );
}
