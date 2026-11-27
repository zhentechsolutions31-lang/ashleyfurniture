"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { Product } from "@/lib/types";

type ToastAction = { label: string; onClick: () => void };
type Toast = { id: number; message: string; action?: ToastAction };

type UIContextValue = {
  quickView: Product | null;
  setQuickView: (product: Product | null) => void;
  toast: (message: string, action?: ToastAction) => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, action?: ToastAction) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-2), { id, message, action }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((item) => window.setTimeout(() => dismiss(item.id), item.action ? 5000 : 4000));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, dismiss]);

  const value = useMemo(() => ({ quickView, setQuickView, toast }), [quickView, toast]);

  return (
    <UIContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[80] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-24 sm:items-end" aria-live="polite" aria-atomic="false">
        {toasts.map((item) => (
          <div key={item.id} role="status" className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-md border border-line bg-white p-4 text-sm text-ink shadow-lg">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
            <span className="flex-1">{item.message}</span>
            {item.action && (
              <button type="button" className="min-h-11 shrink-0 font-semibold text-primary underline underline-offset-2" onClick={() => { item.action?.onClick(); dismiss(item.id); }}>
                {item.action.label}
              </button>
            )}
            <button type="button" className="icon-button -mr-2 min-h-11 min-w-11" aria-label="Dismiss notification" onClick={() => dismiss(item.id)}>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used inside UIProvider");
  return context;
}
