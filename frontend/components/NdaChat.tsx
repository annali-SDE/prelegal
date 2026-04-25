"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessage, ChatResponse } from "@/types/chat";

interface DocumentChatProps {
  documentType: string;
  onFieldsUpdate: (updates: Record<string, unknown>) => void;
  onComplete: () => void;
}

export default function NdaChat({ documentType, onFieldsUpdate, onComplete }: DocumentChatProps) {
  const { user, isLoading: authLoading, openAuthModal } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingTextRef = useRef<string | null>(null);
  const pendingSnapshotRef = useRef<ChatMessage[] | null>(null);
  const greetingFetchedRef = useRef(false);

  // Reset conversation when document type changes
  useEffect(() => {
    greetingFetchedRef.current = false;
    setMessages([]);
  }, [documentType]);

  // Fetch greeting exactly once after user is confirmed (re-runs when documentType changes via reset above)
  useEffect(() => {
    if (!user || greetingFetchedRef.current) return;
    greetingFetchedRef.current = true;
    fetch(`/api/chat/greeting?document_type=${encodeURIComponent(documentType)}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setMessages([{ role: "assistant", content: data.message }]);
      })
      .catch(() => {});
  }, [user, documentType]);

  // Auto-open auth modal when not authenticated after loading
  useEffect(() => {
    if (!authLoading && !user) openAuthModal();
  }, [authLoading, user, openAuthModal]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const doSend = useCallback(
    async (snapshot: ChatMessage[], text: string) => {
      setIsSending(true);
      try {
        const res = await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            document_type: documentType,
            message: text,
            conversation_history: snapshot,
          }),
        });

        if (res.status === 401) {
          setMessages(snapshot);
          pendingTextRef.current = text;
          pendingSnapshotRef.current = snapshot;
          openAuthModal();
          return;
        }

        if (!res.ok) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Sorry, something went wrong. Please try again." },
          ]);
          return;
        }

        const data: ChatResponse = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

        if (Object.keys(data.extracted_fields).length > 0) {
          onFieldsUpdate(data.extracted_fields);
        }
        if (data.is_complete) onComplete();
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Network error. Please check your connection and try again." },
        ]);
      } finally {
        setIsSending(false);
        inputRef.current?.focus();
      }
    },
    [documentType, openAuthModal, onFieldsUpdate, onComplete]
  );

  // After successful sign-in, retry any pending message
  useEffect(() => {
    if (!user || !pendingTextRef.current || !pendingSnapshotRef.current) return;
    const text = pendingTextRef.current;
    const snapshot = pendingSnapshotRef.current;
    pendingTextRef.current = null;
    pendingSnapshotRef.current = null;
    setMessages([...snapshot, { role: "user", content: text }]);
    doSend(snapshot, text);
  }, [user, doSend]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isSending || !user) return;
    setInput("");
    const snapshot = messages;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    doSend(snapshot, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">AI Assistant</p>
        {user && (
          <span className="text-xs text-slate-400">{user.email}</span>
        )}
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {authLoading && (
          <div className="flex justify-center pt-8">
            <span className="text-sm text-slate-400">Loading…</span>
          </div>
        )}
        {!authLoading && !user && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">
              Sign in to start creating your document with the AI assistant.
            </p>
            <button
              onClick={openAuthModal}
              className="px-4 py-2 bg-[#209dd7] hover:bg-[#1a85b9] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Sign in
            </button>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#209dd7] text-white rounded-tr-sm"
                  : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {user && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              placeholder="Type a message… (Enter to send)"
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#209dd7] focus:border-transparent resize-none transition-all disabled:bg-slate-50"
            />
            <button
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-[#209dd7] hover:bg-[#1a85b9] disabled:bg-slate-200 text-white transition-colors"
              aria-label="Send"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Shift+Enter for new line</p>
        </div>
      )}
    </div>
  );
}
