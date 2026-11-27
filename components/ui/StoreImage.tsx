import Image from "next/image";
import type { CSSProperties } from "react";

export function StoreImage({ src, alt, className = "", priority = false, sizes = "100vw", fill = true, style }: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  style?: CSSProperties;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={`object-cover ${className}`}
      style={style}
    />
  );
}
