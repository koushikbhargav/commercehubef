"use client";

import React from "react";

/* ── Table Root ─────────────────────────────── */

interface HaloTableProps {
  children: React.ReactNode;
  className?: string;
}

export function HaloTable({ children, className = "" }: HaloTableProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

/* ── Head ───────────────────────────────────── */

interface HaloTableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function HaloTableHead({
  children,
  className = "",
}: HaloTableHeadProps) {
  return <thead className={className}>{children}</thead>;
}

/* ── Header Row ─────────────────────────────── */

interface HaloTableHeaderProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function HaloTableHeader({
  children,
  className = "",
  align = "left",
}: HaloTableHeaderProps) {
  return (
    <th
      className={`
        px-4 py-3
        font-mono text-[9px] uppercase tracking-[0.25em] font-normal
        text-[var(--muted-foreground)]
        border-b border-[var(--border)]
        text-${align}
        ${className}
      `}
    >
      {children}
    </th>
  );
}

/* ── Body ───────────────────────────────────── */

interface HaloTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function HaloTableBody({
  children,
  className = "",
}: HaloTableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

/* ── Row ────────────────────────────────────── */

interface HaloTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function HaloTableRow({
  children,
  className = "",
  onClick,
}: HaloTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`
        border-b border-[var(--border)]
        transition-colors duration-150
        hover:bg-[var(--muted)]/30
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

/* ── Cell ───────────────────────────────────── */

interface HaloTableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function HaloTableCell({
  children,
  className = "",
  align = "left",
}: HaloTableCellProps) {
  return (
    <td
      className={`
        px-4 py-3
        text-sm text-[var(--foreground)]
        text-${align}
        ${className}
      `}
    >
      {children}
    </td>
  );
}
