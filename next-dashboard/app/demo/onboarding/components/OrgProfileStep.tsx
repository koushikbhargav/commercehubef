"use client";

import React, { useState } from "react";
import { useStore } from "../../../lib/store";
import { Building2, Briefcase, Hash, Mail, ArrowRight, ArrowLeft } from "lucide-react";

export function OrgProfileStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { merchant, updateOrg } = useStore();
  const [formData, setFormData] = useState({
    name: merchant.org?.name || "",
    industry: merchant.org?.industry || "Fashion",
    taxId: merchant.org?.taxId || "",
    contactEmail: merchant.org?.contactEmail || merchant.user?.email || "",
    address: merchant.org?.address || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrg(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
      <div className="mb-10">
        <h2 className="text-2xl font-display uppercase tracking-tight text-deep-jungle mb-3">Organization Profile</h2>
        <p className="text-forest-contrast text-[11px] font-bold uppercase tracking-tight max-w-md">
          Establish your business identity for compliance and agent routing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-2">
          <label className="text-[8px] font-bold uppercase tracking-widest text-deep-jungle/60 ml-1">Business Name</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-contrast/40" />
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Acme Commerce Group"
              className="w-full bg-white border border-forest-contrast/10 rounded-xl py-3 pl-12 pr-4 text-[11px] font-bold uppercase tracking-tight focus:border-forest-contrast transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[8px] font-bold uppercase tracking-widest text-deep-jungle/60 ml-1">Industry Sector</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-contrast/40" />
            <select
              value={formData.industry}
              onChange={e => setFormData({ ...formData, industry: e.target.value })}
              className="w-full bg-white border border-forest-contrast/10 rounded-xl py-3 pl-12 pr-4 text-[11px] font-bold uppercase tracking-tight focus:border-forest-contrast transition-all outline-none appearance-none"
            >
              <option value="Fashion">Fashion & Apparel</option>
              <option value="Electronics">Consumer Electronics</option>
              <option value="Home">Home & Garden</option>
              <option value="Services">Professional Services</option>
              <option value="Food">Food & Beverage</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[8px] font-bold uppercase tracking-widest text-deep-jungle/60 ml-1">Tax Identification (Optional)</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-contrast/40" />
            <input
              type="text"
              value={formData.taxId}
              onChange={e => setFormData({ ...formData, taxId: e.target.value })}
              placeholder="VAT / GST / EIN Number"
              className="w-full bg-white border border-forest-contrast/10 rounded-xl py-3 pl-12 pr-4 text-[11px] font-bold uppercase tracking-tight focus:border-forest-contrast transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[8px] font-bold uppercase tracking-widest text-deep-jungle/60 ml-1">Contact Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-contrast/40" />
            <input
              required
              type="email"
              value={formData.contactEmail}
              onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="business@example.com"
              className="w-full bg-white border border-forest-contrast/10 rounded-xl py-3 pl-12 pr-4 text-[11px] font-bold uppercase tracking-tight focus:border-forest-contrast transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-forest-contrast/5 pt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-deep-jungle/60 hover:text-deep-jungle transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Change Auth
        </button>
        <button
          type="submit"
          disabled={!formData.name || !formData.contactEmail}
          className="btn-primary px-8 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
