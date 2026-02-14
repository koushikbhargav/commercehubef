"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "../lib/store";
import { LoginModal } from "./LoginModal";
import { UserProfile } from "./UserProfile";

export function AppHeader() {
  const { merchant, setLoginModalOpen } = useStore();
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 z-[60] bg-cyber-cream/80 backdrop-blur-md border-b border-forest-contrast/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="font-bold text-2xl font-display tracking-tight leading-none text-deep-jungle group-hover:text-forest-contrast transition-colors">COMMERCEHUB</span>
              <span className="text-[7px] font-bold tracking-[0.4em] uppercase mt-1 text-forest-contrast/60">Enabling AI Native Storefronts</span>
            </div>
          </Link>


          <div className="flex items-center gap-5">
            <button
              onClick={() => router.push(merchant.isOnboarded ? "/dashboard" : "/onboarding")}
              className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-deep-jungle hover:text-agentic-lime transition-colors"
            >
              Console
            </button>
            {!merchant.user ? (
              <button
                onClick={() => router.push("/onboarding?reset=true")}
                className="btn-primary"
              >
                Onboard
              </button>
            ) : (
              <UserProfile />
            )}
          </div>
        </div>
      </header>
      <LoginModal />
    </>
  );
}
