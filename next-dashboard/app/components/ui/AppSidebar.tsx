"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar,
  Database,
  Plugs,
  Robot,
  GearSix,
  List,
  X,
  GitBranch,
} from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../AuthProvider";

interface NavItem {
  num: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { num: "01", label: "Dashboard", href: "/demo/dashboard", icon: <ChartBar weight="regular" className="w-4 h-4" /> },
  { num: "02", label: "Integrate Storefront", href: "/demo/connect-repo", icon: <GitBranch weight="regular" className="w-4 h-4" /> },
  { num: "03", label: "Data Hub", href: "/demo/data", icon: <Database weight="regular" className="w-4 h-4" /> },
  { num: "04", label: "Platforms", href: "/demo/platforms", icon: <Plugs weight="regular" className="w-4 h-4" /> },
  { num: "05", label: "Agent Console", href: "/demo/test-agent", icon: <Robot weight="regular" className="w-4 h-4" /> },
  { num: "06", label: "Settings", href: "/demo/settings", icon: <GearSix weight="regular" className="w-4 h-4" /> },
];

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className = "" }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/demo/dashboard") return pathname === "/demo/dashboard";
    return pathname.startsWith(href);
  };

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.substring(0, 2).toUpperCase()
    : user?.email
      ? user.email.substring(0, 2).toUpperCase()
      : "ME";

  const userName = user?.user_metadata?.full_name || user?.email || "User";

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <Link href="/demo/dashboard" className="block">
          <span className="font-display text-xl tracking-tight text-[var(--cream)]">
            COMMERCEHUB
          </span>
        </Link>
      </div>

      {/* Separator */}
      <div className="mx-5 border-t border-[var(--cream)]/10" />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5
                    font-mono text-[10px] uppercase tracking-[0.2em]
                    rounded-[var(--radius)]
                    transition-colors duration-150
                    ${active
                      ? "text-[var(--cream)] bg-[var(--cream)]/8"
                      : "text-[var(--cream)]/55 hover:text-[var(--cream)] hover:bg-[var(--cream)]/5"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-olive rounded-full" />
                  )}

                  <span className="text-[8px] opacity-40 w-4">{item.num}</span>
                  <span className="opacity-70">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Separator */}
      <div className="mx-5 border-t border-[var(--cream)]/10" />

      {/* Bottom area — theme toggle + user */}
      <div className="px-5 py-4 flex flex-col gap-4">
        <ThemeToggle />

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[var(--cream)]/15 flex items-center justify-center text-[var(--cream)] text-[9px] font-mono uppercase flex-shrink-0">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              userInitials
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-wide text-[var(--cream)] truncate">
              {userName}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-9 h-9 rounded-[var(--radius)] bg-[var(--brand)] text-[var(--brand-foreground)]"
        aria-label="Open sidebar"
      >
        <List weight="bold" className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: static, mobile: slide-over */}
      <aside
        className={`
          fixed md:sticky top-0 left-0
          h-screen w-[220px] flex-shrink-0
          bg-[var(--brand)] dark:bg-[#050505]
          flex flex-col
          z-50 md:z-30
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${className}
        `}
      >
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 md:hidden text-[var(--cream)]/60 hover:text-[var(--cream)]"
          aria-label="Close sidebar"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
