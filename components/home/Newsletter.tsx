"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { save } from "@/lib/storage";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSuccess(false);
      setMessage("Enter a valid email address.");
      return;
    }
    save("ho-newsletter", { email, subscribedAt: new Date().toISOString() });
    setSuccess(true);
    setMessage("You’re on the list. Welcome to Haven & Oak.");
    setEmail("");
  };

  return (
    <form onSubmit={submit} noValidate className={compact ? "mt-4" : "mx-auto mt-6 max-w-xl"} aria-label="Newsletter subscription">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={compact ? "footer-email" : "newsletter-email"} className="sr-only">Email address</label>
          <input
            id={compact ? "footer-email" : "newsletter-email"}
            type="email"
            autoComplete="email"
            className={`field ${compact ? "border-footer-text/30 bg-white/10 text-white placeholder:text-footer-text/70" : "border-white/40 bg-white text-ink"}`}
            placeholder="Email address"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setMessage(""); }}
            aria-invalid={!!message && !success}
            aria-describedby={message ? (compact ? "footer-newsletter-message" : "newsletter-message") : undefined}
          />
        </div>
        <button type="submit" className={`btn ${compact ? "btn-secondary" : "bg-white text-primary hover:bg-footer-text"}`}>Subscribe <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
      </div>
      {message && (
        <p id={compact ? "footer-newsletter-message" : "newsletter-message"} className={`mt-2 flex items-center gap-2 text-sm ${success ? "text-white" : "text-white"}`} role="status">
          {success && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}{message}
        </p>
      )}
      {!compact && <p className="mt-3 text-xs text-white/80">No network request is made. This demo saves your preference only in this browser.</p>}
    </form>
  );
}
