"use client";

import React, { useState } from "react";
import { useStore } from "../../../lib/store";
import { ShieldCheck, FileText, Upload, CheckCircle2, Loader2, ArrowLeft, ArrowRight } from "lucide-react";

export function VerificationStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { merchant, verifyBusiness } = useStore();
  const [docType, setDocType] = useState<'incorporation' | 'license' | 'identity'>('incorporation');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleVerify = async () => {
    if (!selectedFile) return;
    setIsVerifying(true);
    await verifyBusiness(docType);
    setIsVerifying(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-10">
        <h2 className="text-2xl font-display uppercase tracking-tight text-deep-jungle mb-3">Business Verification</h2>
        <p className="text-forest-contrast text-[11px] font-bold uppercase tracking-tight max-w-md">
          Upload required documentation to verify your business and unlock global trust tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-10">
        <div className="space-y-4">
          <label className="text-[8px] font-bold uppercase tracking-widest text-deep-jungle/60 ml-1">Select Document Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'incorporation', label: 'Certificate', icon: FileText },
              { id: 'license', label: 'Trade License', icon: ShieldCheck },
              { id: 'identity', label: 'ID Verification', icon: CheckCircle2 }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setDocType(t.id as any)}
                className={`p-4 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${docType === t.id
                    ? "bg-forest-contrast border-forest-contrast text-cyber-cream"
                    : "bg-white border-forest-contrast/10 text-deep-jungle/60 hover:border-forest-contrast/30"
                  }`}
              >
                <t.icon className="w-5 h-5" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div
          onClick={handleUploadClick}
          className={`p-10 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-white/30 group transition-all cursor-pointer ${selectedFile && merchant.verificationStatus !== 'verified'
              ? "border-forest-secondary bg-forest-secondary/5"
              : "border-forest-contrast/10 hover:border-forest-contrast/30"
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {merchant.verificationStatus === 'verified' ? (
            <>
              <div className="w-16 h-16 bg-forest-secondary/10 text-forest-secondary rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-secondary">Verification Success</span>
            </>
          ) : isVerifying ? (
            <>
              <Loader2 className="w-8 h-8 text-forest-contrast animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-contrast">Processing...</span>
            </>
          ) : selectedFile ? (
            <>
              <div className="w-16 h-16 bg-forest-secondary/10 text-forest-secondary rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-secondary mb-1">File Attached</p>
                <p className="text-[9px] text-forest-contrast/60">{selectedFile.name}</p>
              </div>
              <p className="text-[8px] uppercase tracking-widest text-forest-contrast/40 mt-2">Click to change file</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-forest-contrast/5 text-forest-contrast/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-contrast/60 block">Click to upload or drop files</span>
                <span className="text-[8px] text-forest-contrast/40 uppercase mt-1">PDF, PNG, JPG (Max 10MB)</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-forest-contrast/5 pt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-deep-jungle/60 hover:text-deep-jungle transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Profile
        </button>

        {merchant.verificationStatus === 'verified' ? (
          <button
            onClick={onNext}
            className="btn-primary px-8 flex items-center gap-2 group"
          >
            Connect Store <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={handleVerify}
            disabled={isVerifying || !selectedFile}
            className="btn-primary px-10 disabled:opacity-50"
          >
            {isVerifying ? "Verifying..." : "Verify Identity"}
          </button>
        )}
      </div>
    </div>
  );
}
