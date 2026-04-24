"use client";

import { NdaFormData } from "@/types/nda";
import SignaturePad from "./SignaturePad";

interface SignatureSectionProps {
  data: NdaFormData;
  onChange: (updates: Partial<NdaFormData>) => void;
}

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#209dd7] focus:border-transparent transition-all";

export default function SignatureSection({ data, onChange }: SignatureSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-[#209dd7] flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Signatures</h3>
      </div>

      {/* Party 1 */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <p className="text-xs font-semibold text-[#209dd7] uppercase tracking-wide">Party 1</p>
        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
            Date Signed
          </label>
          <input
            type="date"
            className={inputClass}
            value={data.party1Date}
            onChange={(e) => onChange({ party1Date: e.target.value })}
          />
        </div>
        <SignaturePad
          label="Signature"
          value={data.party1SignatureData}
          onChange={(sig) => onChange({ party1SignatureData: sig })}
        />
      </section>

      {/* Party 2 */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <p className="text-xs font-semibold text-[#209dd7] uppercase tracking-wide">Party 2</p>
        <div>
          <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
            Date Signed
          </label>
          <input
            type="date"
            className={inputClass}
            value={data.party2Date}
            onChange={(e) => onChange({ party2Date: e.target.value })}
          />
        </div>
        <SignaturePad
          label="Signature"
          value={data.party2SignatureData}
          onChange={(sig) => onChange({ party2SignatureData: sig })}
        />
      </section>
    </div>
  );
}
