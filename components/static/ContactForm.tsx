"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { save } from "@/lib/storage";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [storageError, setStorageError] = useState("");

  if (sent) return <div role="status" className="rounded-md border border-success/30 bg-success/5 p-5"><CheckCircle2 className="h-6 w-6 text-success" /><h2 className="mt-2 font-semibold">Message saved</h2><p className="mt-1 text-sm text-muted">This demo does not send email. Your message was saved only in this browser.</p></div>;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Record<string, string> = {};
    if (!name) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (message.length < 10) next.message = "Enter a message of at least 10 characters.";
    setErrors(next);
    setStorageError("");
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    const saved = save("ho-contact-message", { name, email, message, createdAt: new Date().toISOString() });
    if (!saved) {
      setStorageError("Your message couldn’t be saved in this browser. Enable browser storage or free up space, then try again.");
      return;
    }
    setSent(true);
  };

  const clearError = (field: string) => {
    setErrors((current) => ({ ...current, [field]: "" }));
    setStorageError("");
  };

  return (
    <form className="grid gap-4 sm:grid-cols-2" noValidate onSubmit={submit}>
      <div>
        <label htmlFor="contact-name" className="label">Name</label>
        <input id="contact-name" name="name" className="field" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={() => clearError("name")} />
        {errors.name && <p id="contact-name-error" className="field-error" role="alert"><AlertCircle className="h-4 w-4" />{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="contact-email" className="label">Email</label>
        <input id="contact-email" name="email" type="email" className="field" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={() => clearError("email")} />
        {errors.email && <p id="contact-email-error" className="field-error" role="alert"><AlertCircle className="h-4 w-4" />{errors.email}</p>}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="label">How can we help?</label>
        <textarea id="contact-message" name="message" className="field min-h-36" required aria-invalid={!!errors.message} aria-describedby={errors.message ? "contact-message-error" : undefined} onChange={() => clearError("message")} />
        {errors.message && <p id="contact-message-error" className="field-error" role="alert"><AlertCircle className="h-4 w-4" />{errors.message}</p>}
      </div>
      {storageError && <p className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm text-danger sm:col-span-2" role="alert">{storageError}</p>}
      <div className="sm:col-span-2"><Button type="submit">Save message</Button></div>
    </form>
  );
}
