import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

type CommonProps = { children: ReactNode; className?: string; variant?: "primary" | "secondary" | "ghost"; };

export function Button({ children, className = "", variant = "primary", type = "button", ...props }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
}

export function ButtonLink({ children, className = "", variant = "primary", href, onClick }: CommonProps & { href: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return <Link href={href} className={`btn btn-${variant} ${className}`} onClick={onClick}>{children}</Link>;
}
