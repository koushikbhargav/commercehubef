"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../lib/store";
import { User, LogOut, Settings, ChevronDown, Shield, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

export function UserProfile() {
  const { merchant, logout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (merchant.user?.image) {
      console.log('[UserProfile] Avatar URL:', merchant.user.image);
      setImageError(false);
    }
  }, [merchant.user?.image]);

  if (!merchant.user) return null;

  const handleLogout = async () => {
    await authClient.signOut();
    logout();
    router.push("/");
  };

  const userImage = merchant.user.image;
  const userInitials = merchant.user.name
    ? merchant.user.name.substring(0, 2).toUpperCase()
    : "ME";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white border border-forest-contrast/10 hover:border-forest-contrast/20 transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-deep-jungle flex items-center justify-center text-cyber-cream overflow-hidden">
          {userImage && !imageError ? (
            <img 
              src={userImage} 
              alt={merchant.user.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                console.error('[UserProfile] Failed to load avatar:', userImage);
                setImageError(true);
              }}
            />
          ) : (
            <span className="text-xs font-bold">{userInitials}</span>
          )}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-bold text-deep-jungle uppercase tracking-tight leading-none group-hover:text-forest-contrast">
            {merchant.user.name}
          </span>
          <span className="text-[7px] font-bold text-forest-contrast/40 uppercase tracking-[0.2em] mt-1">
            {merchant.user.role}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-forest-contrast/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-white border border-forest-contrast/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-6 border-b border-forest-contrast/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-deep-jungle flex items-center justify-center text-cyber-cream shadow-xl overflow-hidden">
                 {userImage && !imageError ? (
                    <img 
                      src={userImage} 
                      alt={merchant.user.name} 
                      className="w-full h-full object-cover" 
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
              </div>
              <div>
                <p className="text-xs font-bold text-deep-jungle uppercase tracking-tight">{merchant.user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5 opacity-40">
                  <Mail className="w-2.5 h-2.5" />
                  <p className="text-[9px] font-bold uppercase tracking-widest truncate max-w-[120px]">{merchant.user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-forest-contrast/5 rounded-lg border border-forest-contrast/5">
              <Shield className="w-3 h-3 text-forest-contrast" />
              <span className="text-[8px] font-bold text-forest-contrast uppercase tracking-[0.2em]">Verified Account</span>
            </div>
          </div>

          <div className="p-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-deep-jungle/60 hover:text-deep-jungle hover:bg-forest-contrast/5 rounded-xl transition-all">
              <User className="w-4 h-4" /> Profile
            </button>
            <button 
              onClick={() => router.push('/settings')}
              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-deep-jungle/60 hover:text-deep-jungle hover:bg-forest-contrast/5 rounded-xl transition-all"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>

          <div className="p-2 border-t border-forest-contrast/5 bg-forest-contrast/[0.02]">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
