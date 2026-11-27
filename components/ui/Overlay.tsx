"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "right" | "left" | "center" | "bottom";
  className?: string;
  hideClose?: boolean;
};

type OverlayEntry = { token: string; element: HTMLDivElement | null };

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
const overlayStack: OverlayEntry[] = [];
let previousBodyOverflow = "";

function focusPanel(panel: HTMLDivElement | null) {
  if (!panel) return;
  const first = panel.querySelector<HTMLElement>(focusableSelector);
  (first ?? panel).focus();
}

function lockBody(token: string, element: HTMLDivElement | null) {
  if (overlayStack.length === 0) previousBodyOverflow = document.body.style.overflow;
  overlayStack.push({ token, element });
  document.body.style.overflow = "hidden";
}

function unlockBody(token: string): HTMLDivElement | null {
  const index = overlayStack.findIndex((entry) => entry.token === token);
  if (index >= 0) overlayStack.splice(index, 1);
  if (overlayStack.length === 0) {
    document.body.style.overflow = previousBodyOverflow;
    return null;
  }
  return overlayStack[overlayStack.length - 1]?.element ?? null;
}

export function Overlay({ open, onClose, title, children, side = "center", className = "", hideClose = false }: OverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const token = useId();
  const titleId = useId();

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    lockBody(token, panelRef.current);
    if (rootRef.current) rootRef.current.style.zIndex = String(70 + overlayStack.length - 1);
    const timer = window.setTimeout(() => focusPanel(panelRef.current), 30);

    const onKeyDown = (event: KeyboardEvent) => {
      if (overlayStack[overlayStack.length - 1]?.token !== token) return;
      if (event.key === "Escape") {
        const target = event.target as HTMLElement | null;
        if (target?.closest('[role="combobox"][aria-expanded="true"]')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const elements = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => element.offsetParent !== null);
      if (!elements.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      const nextPanel = unlockBody(token);
      if (nextPanel?.isConnected) focusPanel(nextPanel);
      else if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, token]);

  if (!open) return null;
  const position = side === "right"
    ? "inset-y-0 right-0 h-full w-full max-w-[440px] rounded-none"
    : side === "left"
      ? "inset-y-0 left-0 h-full w-[85%] max-w-sm rounded-none"
      : side === "bottom"
        ? "inset-x-0 bottom-0 max-h-[92dvh] w-full rounded-t-lg"
        : "inset-0 m-auto h-fit max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-2xl rounded-lg";

  return (
    <div ref={rootRef} className="fixed inset-0 z-[70]">
      <button type="button" className="absolute inset-0 h-full w-full cursor-default bg-footer/50 backdrop-blur-[2px]" aria-label="Close dialog" onClick={onClose} tabIndex={-1} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`absolute flex flex-col bg-white text-ink shadow-lg ${position} ${className}`}
      >
        <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-line px-5">
          <h2 id={titleId} className="font-heading text-xl font-semibold">{title}</h2>
          {!hideClose && (
            <button type="button" onClick={onClose} className="icon-button" aria-label={`Close ${title}`}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
