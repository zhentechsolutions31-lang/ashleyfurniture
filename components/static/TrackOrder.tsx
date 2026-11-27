"use client";

import { useState } from "react";
import { AlertCircle, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getStoredOrders } from "@/lib/orders";
import type { Order } from "@/lib/types";

export function TrackOrder() {
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = String(data.get("orderId") ?? "").trim().toUpperCase();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const next: Record<string, string> = {};
    if (!/^HO-[A-Z0-9]{8}$/.test(id)) next.orderId = "Enter an order number in the format HO-XXXXXXXX.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`tracking-${first === "orderId" ? "id" : "email"}`)?.focus();
      setOrder(null);
      setMessage("");
      return;
    }

    const match = getStoredOrders().find((item) =>
      item.id === id && item.delivery.email.toLowerCase() === email,
    );
    setOrder(match ?? null);
    setMessage(match ? "Demo order found." : "No matching demo order was found in this browser.");
  };

  return (
    <form className="max-w-xl" noValidate onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tracking-id" className="label">Order number</label>
          <input
            id="tracking-id"
            name="orderId"
            className="field"
            placeholder="HO-XXXXXXXX"
            autoComplete="off"
            required
            aria-invalid={!!errors.orderId}
            aria-describedby={errors.orderId ? "tracking-id-error" : undefined}
            onChange={() => setErrors((current) => ({ ...current, orderId: "" }))}
          />
          {errors.orderId && <p id="tracking-id-error" className="field-error" role="alert"><AlertCircle className="h-4 w-4" />{errors.orderId}</p>}
        </div>
        <div>
          <label htmlFor="tracking-email" className="label">Email used at checkout</label>
          <input
            id="tracking-email"
            name="email"
            type="email"
            className="field"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "tracking-email-error" : undefined}
            onChange={() => setErrors((current) => ({ ...current, email: "" }))}
          />
          {errors.email && <p id="tracking-email-error" className="field-error" role="alert"><AlertCircle className="h-4 w-4" />{errors.email}</p>}
        </div>
      </div>
      <Button type="submit" className="mt-4">Find my demo order</Button>
      {message && (
        <div role="status" className="mt-5 rounded-md border border-line bg-surface p-4">
          <p className="flex items-center gap-2 font-semibold"><PackageSearch className="h-5 w-5 text-primary" />{message}</p>
          {order && <p className="mt-2 text-sm text-muted">Status: Confirmed · Placed {new Date(order.createdAt).toLocaleDateString("en-US")}. This is a local demo record, not a live shipment.</p>}
        </div>
      )}
    </form>
  );
}
