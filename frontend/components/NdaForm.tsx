"use client";

import { NdaFormData } from "@/types/nda";
import SignaturePad from "./SignaturePad";

interface NdaFormProps {
  data: NdaFormData;
  onChange: (updates: Partial<NdaFormData>) => void;
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#209dd7] text-white text-xs font-bold flex items-center justify-center">
        {number}
      </span>
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">{title}</h3>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#209dd7] focus:border-transparent transition-all";

const selectClass =
  "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#209dd7] focus:border-transparent transition-all";

export default function NdaForm({ data, onChange }: NdaFormProps) {
  return (
    <div className="space-y-8">
      {/* Section 1: Agreement Terms */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <SectionHeader number="1" title="Agreement Terms" />

        <Field label="Purpose" hint="How confidential information may be used">
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            value={data.purpose}
            onChange={(e) => onChange({ purpose: e.target.value })}
            placeholder="Evaluating whether to enter into a business relationship..."
          />
        </Field>

        <Field label="Effective Date">
          <input
            type="date"
            className={inputClass}
            value={data.effectiveDate}
            onChange={(e) => onChange({ effectiveDate: e.target.value })}
          />
        </Field>

        <Field label="MNDA Term" hint="Length of this agreement">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mndaTermType"
                value="expires"
                checked={data.mndaTermType === "expires"}
                onChange={() => onChange({ mndaTermType: "expires" })}
                className="accent-[#209dd7]"
              />
              <span className="text-sm text-slate-700">Expires after</span>
              <input
                type="number"
                min={1}
                max={10}
                className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#209dd7]"
                value={data.mndaTermYears}
                onChange={(e) => onChange({ mndaTermYears: Number(e.target.value) })}
                disabled={data.mndaTermType !== "expires"}
              />
              <span className="text-sm text-slate-700">year(s) from Effective Date</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mndaTermType"
                value="until_terminated"
                checked={data.mndaTermType === "until_terminated"}
                onChange={() => onChange({ mndaTermType: "until_terminated" })}
                className="accent-[#209dd7]"
              />
              <span className="text-sm text-slate-700">Until terminated per agreement terms</span>
            </label>
          </div>
        </Field>

        <Field label="Term of Confidentiality" hint="How long confidential information is protected">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confidentialityTermType"
                value="years"
                checked={data.confidentialityTermType === "years"}
                onChange={() => onChange({ confidentialityTermType: "years" })}
                className="accent-[#209dd7]"
              />
              <input
                type="number"
                min={1}
                max={10}
                className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#209dd7]"
                value={data.confidentialityTermYears}
                onChange={(e) => onChange({ confidentialityTermYears: Number(e.target.value) })}
                disabled={data.confidentialityTermType !== "years"}
              />
              <span className="text-sm text-slate-700">
                year(s) from Effective Date (trade secrets until no longer protected by law)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confidentialityTermType"
                value="perpetuity"
                checked={data.confidentialityTermType === "perpetuity"}
                onChange={() => onChange({ confidentialityTermType: "perpetuity" })}
                className="accent-[#209dd7]"
              />
              <span className="text-sm text-slate-700">In perpetuity</span>
            </label>
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Governing Law">
            <input
              type="text"
              className={inputClass}
              value={data.governingLaw}
              onChange={(e) => onChange({ governingLaw: e.target.value })}
              placeholder="e.g. Delaware"
            />
          </Field>
          <Field label="Jurisdiction" hint="City/county and state">
            <input
              type="text"
              className={inputClass}
              value={data.jurisdiction}
              onChange={(e) => onChange({ jurisdiction: e.target.value })}
              placeholder="e.g. New Castle, DE"
            />
          </Field>
        </div>
      </section>

      {/* Section 2: Party 1 */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <SectionHeader number="2" title="Party 1" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name">
            <input
              type="text"
              className={inputClass}
              value={data.party1Name}
              onChange={(e) => onChange({ party1Name: e.target.value })}
              placeholder="Jane Smith"
            />
          </Field>
          <Field label="Title">
            <input
              type="text"
              className={inputClass}
              value={data.party1Title}
              onChange={(e) => onChange({ party1Title: e.target.value })}
              placeholder="CEO"
            />
          </Field>
        </div>
        <Field label="Company">
          <input
            type="text"
            className={inputClass}
            value={data.party1Company}
            onChange={(e) => onChange({ party1Company: e.target.value })}
            placeholder="Acme Corp."
          />
        </Field>
        <Field label="Notice Address" hint="Email or postal address">
          <input
            type="text"
            className={inputClass}
            value={data.party1NoticeAddress}
            onChange={(e) => onChange({ party1NoticeAddress: e.target.value })}
            placeholder="jane@acme.com"
          />
        </Field>
        <Field label="Date Signed">
          <input
            type="date"
            className={inputClass}
            value={data.party1Date}
            onChange={(e) => onChange({ party1Date: e.target.value })}
          />
        </Field>
        <SignaturePad
          label="Signature"
          value={data.party1SignatureData}
          onChange={(sig) => onChange({ party1SignatureData: sig })}
        />
      </section>

      {/* Section 3: Party 2 */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <SectionHeader number="3" title="Party 2" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name">
            <input
              type="text"
              className={inputClass}
              value={data.party2Name}
              onChange={(e) => onChange({ party2Name: e.target.value })}
              placeholder="John Doe"
            />
          </Field>
          <Field label="Title">
            <input
              type="text"
              className={inputClass}
              value={data.party2Title}
              onChange={(e) => onChange({ party2Title: e.target.value })}
              placeholder="VP of Partnerships"
            />
          </Field>
        </div>
        <Field label="Company">
          <input
            type="text"
            className={inputClass}
            value={data.party2Company}
            onChange={(e) => onChange({ party2Company: e.target.value })}
            placeholder="Globex Inc."
          />
        </Field>
        <Field label="Notice Address" hint="Email or postal address">
          <input
            type="text"
            className={inputClass}
            value={data.party2NoticeAddress}
            onChange={(e) => onChange({ party2NoticeAddress: e.target.value })}
            placeholder="john@globex.com"
          />
        </Field>
        <Field label="Date Signed">
          <input
            type="date"
            className={inputClass}
            value={data.party2Date}
            onChange={(e) => onChange({ party2Date: e.target.value })}
          />
        </Field>
        <SignaturePad
          label="Signature"
          value={data.party2SignatureData}
          onChange={(sig) => onChange({ party2SignatureData: sig })}
        />
      </section>
    </div>
  );
}
