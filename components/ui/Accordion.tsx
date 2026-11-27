"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `accordion-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="border-b border-line">
      <h3>
        <button type="button" className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left font-semibold" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
          {title}<ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pb-5 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}
