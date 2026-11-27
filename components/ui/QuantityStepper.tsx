"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QTY } from "@/lib/cart";

export function QuantityStepper({ value, onChange, label, compact = false }: { value: number; onChange: (value: number) => void; label: string; compact?: boolean }) {
  const set = (next: number) => onChange(Math.max(1, Math.min(MAX_QTY, Number.isFinite(next) ? next : 1)));
  return (
    <div className={`inline-flex items-center rounded-sm border border-line bg-white ${compact ? "h-10" : "h-12"}`} role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className="icon-button h-full min-w-10 rounded-none" onClick={() => set(value - 1)} disabled={value <= 1} aria-label={`Decrease quantity of ${label}`}>
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        className="h-full w-10 border-x border-line bg-transparent text-center text-sm font-semibold outline-none focus:bg-surface"
        type="number"
        min={1}
        max={MAX_QTY}
        value={value}
        aria-label={`Quantity of ${label}`}
        onChange={(event) => set(Number(event.target.value))}
      />
      <button type="button" className="icon-button h-full min-w-10 rounded-none" onClick={() => set(value + 1)} disabled={value >= MAX_QTY} aria-label={`Increase quantity of ${label}`}>
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
