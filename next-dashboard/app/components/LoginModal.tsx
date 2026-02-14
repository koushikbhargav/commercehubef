"use client";

import React from "react";
import { useStore } from "../lib/store";
import { LoginCard } from "./LoginCard";
import { X } from "lucide-react";

export function LoginModal() {
  const { isLoginModalOpen, setLoginModalOpen } = useStore();

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-deep-jungle/40 backdrop-blur-md animate-in fade-in duration-500"
        onClick={() => setLoginModalOpen(false)}
      ></div>

      {/* Content */}
      <div className="relative z-10 w-full flex justify-center animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <button 
          onClick={() => setLoginModalOpen(false)}
          className="absolute -top-12 right-0 md:-right-12 p-2 text-cyber-cream/60 hover:text-cyber-cream transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <LoginCard onLoginSuccess={() => setLoginModalOpen(false)} />
      </div>
    </div>
  );
}
