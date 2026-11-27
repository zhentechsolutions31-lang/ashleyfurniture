import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Haven & Oak – Furniture & Interior Inspiration",
  description:
    "Meet Haven & Oak, an original furniture and interior-inspiration concept. Explore room ideas, design principles and editorial stories for a more considered home.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Haven & Oak – Furniture & Interior Inspiration",
    description:
      "A considered point of view on rooms, materials and thoughtful living.",
    url: "/",
    images: [
      {
        url: "/images/photos/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "A warm, thoughtfully styled Haven & Oak living room",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haven & Oak – Furniture & Interior Inspiration",
    description: "Rooms, materials and ideas for a more considered home.",
    images: ["/images/photos/og-image.jpg"],
  },
};

export default function Home() {
  return <HomePage />;
}
