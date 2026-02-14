'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ArrowRight,
  Terminal,
  Share2,
  ExternalLink,
  Sparkles,
  Github
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-24 text-center animate-in fade-in zoom-in-95 duration-1000">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold mb-8 uppercase tracking-widest">
        <Sparkles className="w-3 h-3" /> Live & Connected
      </div>

      <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <h1 className="text-5xl font-display text-slate-900 mb-6 leading-tight">
        Your MCP Server is <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-600 font-bold">Ready for Agents</span>
      </h1>

      <p className="text-lg text-slate-500 max-w-xl mx-auto mb-12">
        Claude, ChatGPT, and other AI agents can now discover, browse, and checkout from your inventory automatically.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16 text-left">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-indigo-200 transition-all">
          <Terminal className="w-6 h-6 text-indigo-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">Connect to Claude</h3>
          <p className="text-sm text-slate-500 mb-6">Install our desktop plugin to let Claude interact with your server locally.</p>
          <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all">
            Download Plugin <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-indigo-200 transition-all">
          <Share2 className="w-6 h-6 text-indigo-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">Share API Spec</h3>
          <p className="text-sm text-slate-500 mb-6">Let other developers build custom agentic flows on top of your inventory.</p>
          <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all">
            Copy Public URL <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => router.push('/demo/dashboard')}
          className="btn-primary flex items-center gap-2 px-10 shadow-lg shadow-indigo-500/20"
        >
          Go to Dashboard
        </button>
        <button className="btn-secondary !text-slate-900 flex items-center gap-2 px-10 border-slate-300">
          <Github className="w-4 h-4" /> View Docs
        </button>
      </div>
    </div>
  );
}
