"use client";

import { useState, useCallback } from "react";
import NdaChat from "@/components/NdaChat";
import NdaPreview from "@/components/NdaPreview";
import SignatureSection from "@/components/SignatureSection";
import { NdaFormData, defaultFormData } from "@/types/nda";

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleChange = useCallback((updates: Partial<NdaFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const { exportNdaToPdf } = await import("@/utils/exportPdf");
      await exportNdaToPdf();
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "PDF export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#209dd7] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[#032147]">Mutual NDA Creator</span>
            <span className="text-xs text-slate-400 hidden sm:inline">— Common Paper v1.0</span>
          </div>

          <div className="flex items-center gap-3">
            {isComplete && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                All fields gathered
              </span>
            )}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-[#753991] hover:bg-[#5e2c74] disabled:bg-[#b07fc4] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Generating PDF&hellip;
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {exportError && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2 text-sm text-red-700">
          Export failed: {exportError}
        </div>
      )}

      {/* Main split layout */}
      <div className="max-w-screen-2xl mx-auto flex h-[calc(100vh-56px)]">
        {/* Left: Chat + Signatures */}
        <aside className="w-110 shrink-0 flex flex-col border-r border-slate-200 bg-slate-50 overflow-hidden">
          {/* Chat panel — takes remaining height */}
          <div className="flex-1 min-h-0 flex flex-col px-6 pt-6 pb-3">
            <NdaChat onFieldsUpdate={handleChange} onComplete={handleComplete} />
          </div>
          {/* Signature panel — scrollable below */}
          <div className="border-t border-slate-200 px-6 py-6 overflow-y-auto max-h-[45vh]">
            <SignatureSection data={formData} onChange={handleChange} />
          </div>
        </aside>

        {/* Right: Live Preview */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Live Preview
              </p>
              <span className="text-xs text-slate-300">Updates as you chat</span>
            </div>
            <NdaPreview data={formData} />
          </div>
        </main>
      </div>
    </div>
  );
}
