"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useStore } from "../lib/store";
import { useSearchParams } from "next/navigation";
import { AuthStep } from "./components/AuthStep";
import { OrgProfileStep } from "./components/OrgProfileStep";
import { VerificationStep } from "./components/VerificationStep";
import { StoreConnectStep } from "./components/StoreConnectStep";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Check } from "lucide-react";

function OnboardingContent() {
  const [step, setStep] = useState(1);
  const { merchant, completeOnboarding, logout } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const steps = [
    { id: 1, title: "Authentication", description: "Secure your merchant account" },
    { id: 2, title: "Organization", description: "Tell us about your business" },
    { id: 3, title: "Verification", description: "Verify your business identity" },
    { id: 4, title: "Connect Store", description: "Establish your commerce linkage" },
  ];

  // Update step and URL to keep them in sync
  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    router.replace(`/onboarding?step=${newStep}`);
  };

  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      logout();
      setStep(1);
      router.replace('/onboarding');
    } else {
      const stepParam = searchParams.get('step');
      if (stepParam) {
        const targetStep = parseInt(stepParam);
        if (!isNaN(targetStep) && targetStep >= 1 && targetStep <= steps.length) {
          // Only update if it's different to avoid loops
          if (targetStep !== step) {
            setStep(targetStep);
          }
          return;
        }
      }

      if (merchant.user && step === 1) {
        handleStepChange(2);
      }
    }
  }, [searchParams, merchant.user, logout, router]);

  const handleComplete = () => {
    completeOnboarding();
    router.push("/import");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-contrast/5 border border-forest-contrast/10 text-deep-jungle text-[9px] font-bold mb-6 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-forest-contrast" /> Merchant Onboarding
        </div>
        <h1 className="text-4xl font-display uppercase tracking-tight text-deep-jungle mb-4">
          Welcome to CommerceHub
        </h1>
        <p className="text-forest-contrast text-sm font-medium uppercase tracking-tight">
          Complete these steps to activate your Agentic Commerce interface.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-20 px-4">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-forest-contrast/5 z-0">
            <div
              className="h-full bg-forest-secondary transition-all duration-700 ease-in-out"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {steps.map((s) => {
            const isCompleted = s.id < step;

            const isActive = step === s.id;

            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted && !isActive
                    ? "bg-forest-secondary border-forest-secondary text-cyber-cream shadow-none"
                    : isActive
                      ? "bg-cyber-cream border-forest-contrast text-deep-jungle shadow-xl shadow-forest-contrast/10 ring-4 ring-forest-contrast/5"
                      : "bg-cyber-cream border-forest-contrast/10 text-forest-contrast/30"
                    }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <span className="text-[11px] font-bold">{s.id}</span>
                  )}
                </div>
                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-32 text-center">
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] block transition-colors duration-300 ${isActive ? "text-deep-jungle" : "text-forest-contrast/40"
                    }`}>
                    {s.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/50 backdrop-blur-sm border border-forest-contrast/10 rounded-[2rem] p-8 md:p-12 shadow-sm min-h-[400px] flex flex-col">
        {step === 1 && (
          <AuthStep onNext={() => handleStepChange(2)} />
        )}
        {step === 2 && (
          <OrgProfileStep
            onNext={() => handleStepChange(3)}
            onBack={() => handleStepChange(1)}
          />
        )}
        {step === 3 && (
          <VerificationStep
            onNext={() => handleStepChange(4)}
            onBack={() => handleStepChange(2)}
          />
        )}
        {step === 4 && (
          <StoreConnectStep
            onComplete={handleComplete}
            onBack={() => handleStepChange(3)}
          />
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-forest-contrast">Loading onboarding...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
