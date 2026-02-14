"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "../lib/store";
import { createClient } from "../utils/supabase/client";

export function LoginCard({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { login } = useStore();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authType, setAuthType] = useState<'google' | 'email' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) console.error("[LoginCard] Supabase URL is missing!");
  }, []);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthType('google');
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`
      }
    });

    if (error) {
      console.error('[Google Login Error]', error);
      setMessage(error.message);
      setIsAuthenticating(false);
      setAuthType(null);
    }
  };

  const handleSendOtp = async () => {
    setIsAuthenticating(true);
    setAuthType('email');
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: identifier,
        options: { shouldCreateUser: true }
      });

      if (error) throw error;
      
      setStep('otp');
      setMessage(`Code sent to ${identifier}`);
      setIsAuthenticating(false);
    } catch (error: any) {
      console.error('[OTP Send Error]', error);
      setMessage(error.message);
      setIsAuthenticating(false);
      setAuthType(null);
    }
  };

  const handleVerifyOtp = async () => {
    setIsAuthenticating(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: identifier,
        token: otpCode,
        type: 'email'
      });

      if (error) throw error;

      if (data.session) {
        // Optimistic login
        login({
            id: data.user?.id || 'new_user',
            name: data.user?.email?.split('@')[0] || 'Merchant',
            email: data.user?.email || identifier,
            role: 'owner',
            authMethod: 'email'
        });
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error('[OTP Verify Error]', error);
      setMessage(error.message || "Invalid code");
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-2xl shadow-forest-contrast/5 border border-forest-contrast/5">
      {step === 'email' ? (
        <>
          <div className="space-y-4 mb-8">
            <button 
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full h-14 bg-white border border-slate-200 rounded-[1rem] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthenticating && authType === 'google' ? (
                <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span className="text-sm font-medium text-slate-700">
                {isAuthenticating && authType === 'google' ? "Authenticating..." : "Log in with Google"}
              </span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="px-3 bg-white text-slate-400">or</span></div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-bold text-slate-800 ml-1">Enter your business email</label>
              <input 
                type="email" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-14 bg-white border border-slate-200 rounded-[1rem] px-5 text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                placeholder="name@company.com"
              />
            </div>

            {message && (
              <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg">
                {message}
              </div>
            )}

            <button 
              onClick={handleSendOtp}
              disabled={!identifier || isAuthenticating}
              className="w-full h-14 bg-[#316196] text-white rounded-[1rem] text-sm font-bold tracking-tight hover:bg-[#28507d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
            >
              {isAuthenticating && authType === 'email' ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                   Sending...
                 </>
              ) : "Continue with Email"}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => { setStep('email'); setMessage(null); }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-4"
          >
            ← Back to email
          </button>
          
          <div className="space-y-2 text-left">
            <label className="text-[11px] font-bold text-slate-800 ml-1">Enter Login Code</label>
            <p className="text-xs text-slate-500">Sent to {identifier}</p>
            <input 
              type="text" 
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full h-14 bg-white border border-slate-200 rounded-[1rem] px-5 text-lg tracking-widest outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-center"
              placeholder="123456"
              maxLength={6}
            />
          </div>

          {message && (
            <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg">
              {message}
            </div>
          )}

          <button 
            onClick={handleVerifyOtp}
            disabled={otpCode.length < 6 || isAuthenticating}
            className="w-full h-14 bg-[#316196] text-white rounded-[1rem] text-sm font-bold tracking-tight hover:bg-[#28507d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
          >
            {isAuthenticating ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                 Verifying...
               </>
            ) : "Verify & Login"}
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-400 font-medium">
          By continuing, you agree to Halo's<br/>
          <span className="text-slate-600 underline">Terms of Service</span> and <span className="text-slate-600 underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
