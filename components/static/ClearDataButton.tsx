"use client";

import { Button } from "@/components/ui/Button";
import { clearDemoData } from "@/lib/storage";

export function ClearDataButton() {
  return <Button variant="secondary" onClick={() => { clearDemoData(); window.location.reload(); }}>Clear my demo data</Button>;
}
