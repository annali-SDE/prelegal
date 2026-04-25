"use client";

import { catalog } from "@/types/catalog";

interface GenericPreviewProps {
  documentType: string;
  fields: Record<string, unknown>;
  isComplete: boolean;
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export default function GenericPreview({ documentType, fields, isComplete }: GenericPreviewProps) {
  const entry = catalog.find((e) => e.slug === documentType);
  const docName = entry?.name ?? documentType;
  const fieldEntries = Object.entries(fields).filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "");

  return (
    <div
      id="document-preview"
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-slate-700 font-serif leading-relaxed"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {/* Header */}
      <div className="text-center mb-10 pb-8 border-b border-slate-200">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Common Paper</p>
        <h1 className="text-2xl font-bold text-[#032147] mb-1">{docName}</h1>
        {entry && (
          <p className="text-xs text-slate-400 mt-3 max-w-lg mx-auto leading-relaxed">
            {entry.description}
          </p>
        )}
      </div>

      {/* Completion status */}
      {!isComplete && (
        <div className="mb-8 p-4 bg-[#209dd7]/5 border border-[#209dd7]/20 rounded-xl">
          <p className="text-xs text-[#209dd7] font-medium">
            Chat in progress — the preview will populate as you provide information.
          </p>
        </div>
      )}
      {isComplete && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-xs text-emerald-700 font-medium">
            All required fields gathered — your document is ready to download.
          </p>
        </div>
      )}

      {/* Fields */}
      {fieldEntries.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Document Details
          </h2>
          {fieldEntries.map(([key, value]) => (
            <div key={key} className="border-b border-slate-100 pb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                {formatKey(key)}
              </p>
              <p className="text-sm text-slate-800">{formatValue(value)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">
            Start chatting to fill in your document details.
          </p>
        </div>
      )}
    </div>
  );
}
