"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export function PromoCodeForm() {
  const { promo, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (promo) return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-primary/30 bg-surface p-3"><span className="flex items-center gap-2 text-sm"><Tag className="h-4 w-4 text-primary" /><strong>{promo.code}</strong><span className="text-muted">{promo.label}</span></span><button type="button" className="icon-button min-h-11 min-w-11" aria-label={`Remove promo code ${promo.code}`} onClick={() => { removePromo(); setSuccess(""); setError(""); }}><X className="h-4 w-4" /></button></div>
  );

  return (
    <form noValidate onSubmit={(event) => { event.preventDefault(); const result = applyPromo(code); setError(result.ok ? "" : result.message); setSuccess(result.ok ? result.message : ""); if (result.ok) setCode(""); }}>
      <label htmlFor="promo-code" className="label">Promo code</label>
      <div className="flex gap-2"><input id="promo-code" className="field uppercase" placeholder="WELCOME10" value={code} onChange={(event) => { setCode(event.target.value); setError(""); }} aria-invalid={!!error} aria-describedby="promo-message" /><Button type="submit" variant="secondary">Apply</Button></div>
      {(error || success) && <p id="promo-message" role="status" className={`mt-2 text-sm ${error ? "text-danger" : "text-success"}`}>{error || success}</p>}
      <p className="mt-2 text-xs text-muted">Try WELCOME10, SAVE100 or FREESHIP.</p>
    </form>
  );
}
