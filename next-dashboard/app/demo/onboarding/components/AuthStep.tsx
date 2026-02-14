"use client";

import React from "react";
import { LoginCard } from "../../../components/LoginCard";

export function AuthStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-display uppercase tracking-tight text-deep-jungle mb-3">Merchant Registration</h2>
        <p className="text-forest-contrast text-[11px] font-bold uppercase tracking-tight max-w-md mx-auto">
          Choose your preferred method for account creation and multi-tenant access.
        </p>
      </div>

      <LoginCard onLoginSuccess={onNext} />
    </div>
  );
}
