"use client";

import { useRef, useEffect, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label: string;
}

export default function SignaturePad({ value, onChange, label }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (sigRef.current && value && !initializedRef.current) {
      initializedRef.current = true;
      const img = new Image();
      img.onload = () => {
        const canvas = sigRef.current?.getCanvas();
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
        }
      };
      img.src = value;
    }
  }, [value]);

  const handleEnd = useCallback(() => {
    if (sigRef.current) {
      onChange(sigRef.current.toDataURL());
    }
  }, [onChange]);

  const handleClear = useCallback(() => {
    sigRef.current?.clear();
    initializedRef.current = false;
    onChange("");
  }, [onChange]);

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <SignatureCanvas
          ref={sigRef}
          onEnd={handleEnd}
          penColor="#1e293b"
          canvasProps={{
            width: 380,
            height: 100,
            className: "w-full",
          }}
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        Clear signature
      </button>
    </div>
  );
}
