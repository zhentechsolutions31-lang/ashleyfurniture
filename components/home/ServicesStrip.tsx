import { Headphones, RotateCcw, Truck, Wrench } from "lucide-react";

const services = [
  { icon: Truck, title: "Fast Delivery", text: "Free over $999" },
  { icon: Wrench, title: "Assembly Help", text: "We make setup simple" },
  { icon: RotateCcw, title: "Easy Returns", text: "30-day returns" },
  { icon: Headphones, title: "Customer Support", text: "Here when you need us" },
];

export function ServicesStrip() {
  return (
    <section aria-label="Our services" className="border-y border-line bg-surface">
      <div className="container-shell grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4">
        {services.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center justify-center gap-3 px-2 md:border-r md:border-line md:last:border-r-0">
            <Icon className="h-7 w-7 shrink-0 text-primary" strokeWidth={1.6} aria-hidden="true" />
            <div><h2 className="text-sm font-semibold">{title}</h2><p className="text-xs text-muted">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
