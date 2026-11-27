import type { Metadata } from "next";
import { SITE_URL } from "./catalog";
import type { Product } from "./types";

export interface SeoCopy {
  focusKeyword: string;
  secondaryKeywords: string[];
  title: string;
  description: string;
}

export type CatalogSeoScope =
  | { kind: "category"; slug: string; subcategory?: string }
  | { kind: "collection" | "style" | "color"; slug: string };

export type UtilityPageKey =
  | "search"
  | "cart"
  | "checkout"
  | "order"
  | "wishlist"
  | "not-found"
  | "product-not-found"
  | "collection-not-found"
  | "page-not-found";

export function normalizeKeywords(...groups: Array<string | readonly string[] | undefined>): string[] {
  const values = groups.flatMap((group) => typeof group === "string" ? [group] : group ?? []);
  const seen = new Set<string>();
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function brandedTitle(title: string): string {
  return /\bashley\b/i.test(title) ? title : `${title} | Ashley`;
}

export function metadataTitle(title: string): { absolute: string } {
  return { absolute: brandedTitle(title) };
}

export function truncateText(value: string, maxLength = 160): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

export function keywordsFor(seo: SeoCopy): string[] {
  return normalizeKeywords(seo.focusKeyword, seo.secondaryKeywords);
}

function humanize(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const categorySeo: Record<string, SeoCopy> = {
  "living-room": {
    focusKeyword: "living room furniture",
    secondaryKeywords: ["sofas", "sectionals", "living room sets", "accent chairs"],
    title: "Living Room Furniture | Sofas & Sectionals",
    description: "Shop living room furniture at Ashley Furniture, including sofas, sectionals, recliners and accent chairs designed for comfort, style and everyday living.",
  },
  bedroom: {
    focusKeyword: "bedroom furniture",
    secondaryKeywords: ["bedroom sets", "beds", "dressers", "nightstands", "bedroom collections"],
    title: "Bedroom Furniture | Beds, Dressers & More",
    description: "Complete your bedroom with Ashley Furniture bedroom furniture, including beds, dressers, nightstands and coordinated pieces for restful, organised spaces.",
  },
  "dining-room": {
    focusKeyword: "dining room furniture",
    secondaryKeywords: ["dining room sets", "dining tables", "dining chairs", "kitchen and dining room furniture"],
    title: "Dining Room Furniture | Tables, Chairs & Sets",
    description: "Explore dining room furniture at Ashley Furniture, from dining tables and chairs to coordinated sets for everyday meals, gatherings and smaller spaces.",
  },
  "home-office": {
    focusKeyword: "home office furniture",
    secondaryKeywords: ["home office desks", "office chairs", "bookcases", "office sets"],
    title: "Home Office Furniture | Desks, Chairs & More",
    description: "Build a focused workspace with Ashley Furniture home office furniture, including practical desks, supportive office chairs and storage for every home office.",
  },
  outdoor: {
    focusKeyword: "outdoor furniture",
    secondaryKeywords: ["patio furniture", "outdoor lounge furniture", "outdoor dining furniture", "outdoor seating"],
    title: "Outdoor Furniture | Patio Seating & Dining",
    description: "Transform your patio or porch with Ashley Furniture outdoor furniture, including weather-ready seating, outdoor dining sets and relaxed lounge pieces.",
  },
  mattresses: {
    focusKeyword: "mattresses",
    secondaryKeywords: ["hybrid mattresses", "foam mattresses", "mattress sizes", "mattress support"],
    title: "Mattresses | Comfort, Sizes & Support",
    description: "Explore mattresses at Ashley Furniture across hybrid, foam, latex and innerspring styles, with different sizes and comfort levels for a more restorative night.",
  },
  "rugs-decor": {
    focusKeyword: "home decor",
    secondaryKeywords: ["area rugs", "wall art", "home accents", "rugs for every room"],
    title: "Home Decor & Rugs | Accents for Every Room",
    description: "Finish every room with Ashley Furniture home decor, including area rugs, wall art and original accents that add warmth, texture and personality.",
  },
  storage: {
    focusKeyword: "home storage and organization",
    secondaryKeywords: ["storage furniture", "shelving", "bookcases", "closet organization"],
    title: "Home Storage & Organization | Shelving",
    description: "Get organised with Ashley Furniture home storage and organization furniture, including bookcases, shelving and cabinets that keep everyday clutter out of view.",
  },
  pet: {
    focusKeyword: "pet furniture",
    secondaryKeywords: ["pet beds", "washable pet mats", "dog beds", "pet comfort"],
    title: "Pet Furniture | Beds, Mats & Comfort",
    description: "Give pets a comfortable place to rest with Ashley Furniture pet furniture, including supportive beds and washable mats for everyday naps and messes.",
  },
};

const subcategorySeo: Record<string, SeoCopy> = {
  sofas: {
    focusKeyword: "sofas and couches",
    secondaryKeywords: ["sofa chaise", "reclining sofas", "sofa sleepers", "gray sofas"],
    title: "Sofas & Couches | Styles, Sizes & Comfort",
    description: "Find sofas and couches at Ashley Furniture in a range of sizes, upholstery colours and styles, with comfortable seating for family rooms and smaller spaces.",
  },
  sectionals: {
    focusKeyword: "sectional sofas",
    secondaryKeywords: ["modular sectionals", "small sectionals", "chaise sectionals", "comfortable seating"],
    title: "Sectional Sofas | Modular Styles & Sizes",
    description: "Explore sectional sofas at Ashley Furniture, including modular and chaise styles in sizes for spacious family rooms and compact living spaces.",
  },
  recliners: {
    focusKeyword: "reclining chairs",
    secondaryKeywords: ["reclining sofas", "power recliners", "manual recliners", "living room chairs"],
    title: "Reclining Chairs | Comfort for Every Room",
    description: "Relax with Ashley Furniture reclining chairs, from compact accent options to spacious seating designed for comfortable living rooms and everyday unwinding.",
  },
  "accent-chairs": {
    focusKeyword: "accent chairs",
    secondaryKeywords: ["armchairs", "reading chairs", "living room chairs", "upholstered chairs"],
    title: "Accent Chairs | Styles for Every Space",
    description: "Add comfort and character with Ashley Furniture accent chairs, from upholstered armchairs to compact reading seats for living rooms, bedrooms and corners.",
  },
  ottomans: {
    focusKeyword: "ottoman furniture",
    secondaryKeywords: ["storage ottomans", "upholstered ottomans", "coffee table ottoman", "living room furniture"],
    title: "Ottoman Furniture | Comfortable & Versatile",
    description: "Explore ottoman furniture at Ashley Furniture for flexible seating, footrests and hidden storage, with upholstered styles that complement living room layouts.",
  },
  beds: {
    focusKeyword: "beds",
    secondaryKeywords: ["queen beds", "king beds", "upholstered beds", "bedroom furniture"],
    title: "Beds | Queen, King & Upholstered Styles",
    description: "Create a restful bedroom with Ashley Furniture beds, including queen, king and upholstered styles designed for comfort, proportion and everyday relaxation.",
  },
  dressers: {
    focusKeyword: "dressers",
    secondaryKeywords: ["bedroom dressers", "chest of drawers", "bedroom storage", "wood dressers"],
    title: "Dressers | Bedroom Storage & Style",
    description: "Organise clothing and bedroom essentials with Ashley Furniture dressers, combining practical drawer storage with warm materials and considered bedroom style.",
  },
  nightstands: {
    focusKeyword: "nightstands",
    secondaryKeywords: ["bedside tables", "nightstand sets", "bedroom storage", "small nightstands"],
    title: "Nightstands | Bedside Storage & Style",
    description: "Keep bedtime essentials close with Ashley Furniture nightstands and bedside tables, offering compact storage for lamps, books and everyday bedroom items.",
  },
  "dining-tables": {
    focusKeyword: "dining tables",
    secondaryKeywords: ["round dining tables", "rectangular dining tables", "small dining tables", "kitchen tables"],
    title: "Dining Tables | Shapes, Sizes & Styles",
    description: "Gather around Ashley Furniture dining tables in round, rectangular and compact sizes, with styles suited to everyday meals, kitchens and dining rooms.",
  },
  "dining-chairs": {
    focusKeyword: "dining chairs",
    secondaryKeywords: ["upholstered dining chairs", "wood dining chairs", "dining room seating", "kitchen chairs"],
    title: "Dining Chairs | Comfortable Seating Styles",
    description: "Seat every guest comfortably with Ashley Furniture dining chairs, from supportive upholstered options to wood styles for kitchens and dining rooms.",
  },
  "dining-sets": {
    focusKeyword: "dining room sets",
    secondaryKeywords: ["dining table sets", "kitchen dining sets", "dining table and chairs", "small dining sets"],
    title: "Dining Room Sets | Tables & Chairs",
    description: "Create a coordinated dining space with Ashley Furniture dining room sets, pairing dining tables and chairs for compact kitchens and larger gathering rooms.",
  },
  desks: {
    focusKeyword: "home office desks",
    secondaryKeywords: ["writing desks", "computer desks", "corner desks", "office furniture"],
    title: "Home Office Desks | Practical Workspaces",
    description: "Set up a practical workspace with Ashley Furniture home office desks, including writing, computer and corner designs for focused work in any room.",
  },
  "office-chairs": {
    focusKeyword: "ergonomic office chairs",
    secondaryKeywords: ["office chairs", "supportive seating", "desk chairs", "home office furniture"],
    title: "Ergonomic Office Chairs | Supportive Seating",
    description: "Work comfortably with Ashley Furniture ergonomic office chairs, featuring supportive seating and practical designs for home offices, studies and desk setups.",
  },
  "outdoor-seating": {
    focusKeyword: "outdoor lounge furniture",
    secondaryKeywords: ["patio seating", "outdoor chairs", "outdoor sofas", "patio lounge"],
    title: "Outdoor Lounge Furniture | Patio Seating",
    description: "Explore outdoor lounge furniture at Ashley Furniture, including patio chairs and comfortable seating made for porches, terraces and backyard gatherings.",
  },
  "outdoor-dining": {
    focusKeyword: "outdoor dining furniture",
    secondaryKeywords: ["patio dining sets", "outdoor tables", "outdoor chairs", "patio furniture"],
    title: "Outdoor Dining Furniture | Patio Sets",
    description: "Host meals outside with Ashley Furniture outdoor dining furniture, including patio tables, chairs and coordinated sets for relaxed indoor-outdoor living.",
  },
  rugs: {
    focusKeyword: "area rugs",
    secondaryKeywords: ["runner rugs", "rugs by size", "indoor outdoor rugs", "living room rugs"],
    title: "Area Rugs | Styles, Sizes & Textures",
    description: "Ground your room with Ashley Furniture area rugs in varied sizes, patterns and textures, including runners and versatile indoor-outdoor options.",
  },
  "wall-art": {
    focusKeyword: "wall art",
    secondaryKeywords: ["canvas wall art", "wall prints", "home accents", "living room decor"],
    title: "Wall Art | Prints, Canvas & Decor",
    description: "Add a personal focal point with Ashley Furniture wall art, including canvas pieces and prints that bring colour, texture and character to every room.",
  },
  bookcases: {
    focusKeyword: "bookcases",
    secondaryKeywords: ["bookshelves", "home shelving", "storage furniture", "living room shelving"],
    title: "Bookcases | Shelving & Home Storage",
    description: "Display books and organise everyday pieces with Ashley Furniture bookcases and shelving, designed for living rooms, studies and home office spaces.",
  },
  storage: {
    focusKeyword: "storage furniture",
    secondaryKeywords: ["storage cabinets", "home storage", "shelving units", "organization furniture"],
    title: "Storage Furniture | Cabinets & Shelving",
    description: "Keep your home tidy with Ashley Furniture storage furniture, including cabinets and shelving units that conceal clutter while adding practical style.",
  },
  "pet-beds": {
    focusKeyword: "pet beds",
    secondaryKeywords: ["dog beds", "washable pet beds", "supportive pet beds", "pet furniture"],
    title: "Pet Beds | Comfortable Washable Styles",
    description: "Help pets rest comfortably with Ashley Furniture pet beds, featuring supportive shapes and washable options for everyday naps and easy cleanup.",
  },
  "pet-mats": {
    focusKeyword: "pet mats",
    secondaryKeywords: ["washable pet mats", "dog mats", "pet floor mats", "pet furniture"],
    title: "Pet Mats | Durable, Washable Comfort",
    description: "Protect floors and give pets a cosy spot with Ashley Furniture pet mats, including durable, washable designs for high-traffic areas and everyday use.",
  },
};

const collectionSeo: Record<string, SeoCopy> = {
  deals: {
    focusKeyword: "furniture deals",
    secondaryKeywords: ["furniture sale", "furniture discounts", "home furnishing deals", "special deals"],
    title: "Furniture Deals | Home Furnishing Savings",
    description: "Discover furniture deals at Ashley Furniture across living room, bedroom, dining and outdoor pieces, with illustrative savings for a considered home.",
  },
  "digital-deals": {
    focusKeyword: "online furniture deals",
    secondaryKeywords: ["online furniture sale", "affordable furniture", "home decor deals", "online accents"],
    title: "Online Furniture Deals | Accents & Decor",
    description: "Browse online furniture deals at Ashley Furniture for affordable accents, decor and everyday pieces, with demo prices designed for easy comparison.",
  },
  "designer-picks": {
    focusKeyword: "designer furniture",
    secondaryKeywords: ["designer furniture picks", "luxury furniture", "statement furniture", "elevated home decor"],
    title: "Designer Furniture | Distinctive Pieces",
    description: "Explore designer furniture at Ashley Furniture through distinctive silhouettes, elevated materials and statement pieces selected for a considered home.",
  },
  "best-sellers": {
    focusKeyword: "best selling furniture",
    secondaryKeywords: ["popular furniture", "top rated furniture", "best seller sofas", "furniture favourites"],
    title: "Best-Selling Furniture | Popular Pieces",
    description: "Shop best-selling furniture at Ashley Furniture, featuring popular sofas, bedroom pieces and home favourites chosen for comfort, quality and versatile style.",
  },
  "new-arrivals": {
    focusKeyword: "new furniture",
    secondaryKeywords: ["new furniture arrivals", "latest furniture", "new home decor", "fresh furniture styles"],
    title: "New Furniture | Fresh Arrivals & Styles",
    description: "Discover new furniture at Ashley Furniture, from fresh silhouettes and warm finishes to modern accents that bring new energy to your home.",
  },
  "spring-refresh": {
    focusKeyword: "spring home decor",
    secondaryKeywords: ["spring furniture", "seasonal home decor", "fresh home accents", "spring room refresh"],
    title: "Spring Home Decor | Furniture & Accents",
    description: "Refresh your rooms with Ashley Furniture spring home decor, including light textures, natural tones, outdoor pieces and easy furniture updates.",
  },
  "cozy-furniture": {
    focusKeyword: "cozy furniture",
    secondaryKeywords: ["comfortable furniture", "soft furniture", "cosy sofas", "warm home decor"],
    title: "Cozy Furniture | Soft Textures & Comfort",
    description: "Create an inviting space with Ashley Furniture cozy furniture, featuring soft textures, comfortable seating and warm pieces for unhurried evenings.",
  },
};

const styleSeo: Record<string, SeoCopy> = {
  modern: {
    focusKeyword: "modern furniture",
    secondaryKeywords: ["contemporary furniture", "modern home decor", "clean lines", "modern seating"],
    title: "Modern Furniture | Clean Lines & Style",
    description: "Explore modern furniture at Ashley Furniture with clean lines, balanced proportions and versatile pieces for calm, contemporary rooms.",
  },
  contemporary: {
    focusKeyword: "contemporary furniture",
    secondaryKeywords: ["modern furniture", "contemporary home decor", "current furniture trends", "versatile furniture"],
    title: "Contemporary Furniture | Fresh Style",
    description: "Refresh your home with Ashley Furniture contemporary furniture, combining current silhouettes, adaptable designs and materials for everyday living.",
  },
  traditional: {
    focusKeyword: "traditional furniture",
    secondaryKeywords: ["classic furniture", "timeless furniture", "traditional home decor", "classic seating"],
    title: "Traditional Furniture | Timeless Details",
    description: "Discover traditional furniture at Ashley Furniture with classic shapes, warm finishes and timeless details that bring lasting character to your home.",
  },
  transitional: {
    focusKeyword: "transitional furniture",
    secondaryKeywords: ["transitional style furniture", "classic modern furniture", "versatile furniture", "timeless interiors"],
    title: "Transitional Furniture | Classic & Modern",
    description: "Blend comfort and tradition with Ashley Furniture transitional furniture, pairing classic influences with clean modern lines for versatile interiors.",
  },
  farmhouse: {
    focusKeyword: "farmhouse furniture",
    secondaryKeywords: ["farmhouse decor", "rustic furniture", "country furniture", "warm wood furniture"],
    title: "Farmhouse Furniture | Warm, Practical Style",
    description: "Create a welcoming home with Ashley Furniture farmhouse furniture, featuring warm materials, practical details and relaxed country-inspired style.",
  },
  coastal: {
    focusKeyword: "coastal furniture",
    secondaryKeywords: ["coastal decor", "beach house furniture", "relaxed furniture", "airy interiors"],
    title: "Coastal Furniture | Relaxed, Airy Style",
    description: "Bring a relaxed feeling home with Ashley Furniture coastal furniture, featuring airy colours, natural textures and easy pieces for light-filled rooms.",
  },
  "mid-century": {
    focusKeyword: "mid-century modern furniture",
    secondaryKeywords: ["mid century furniture", "retro furniture", "mid modern decor", "iconic furniture designs"],
    title: "Mid-Century Modern Furniture | Iconic Style",
    description: "Explore mid-century modern furniture at Ashley Furniture, with iconic proportions, warm woods and retro-inspired pieces for characterful interiors.",
  },
};

const colorSeo: Record<string, SeoCopy> = {
  gray: {
    focusKeyword: "gray furniture",
    secondaryKeywords: ["grey furniture", "gray sofas", "neutral furniture", "gray home decor"],
    title: "Gray Furniture | Styles for Your Home",
    description: "Explore gray furniture at Ashley Furniture, from neutral sofas and bedroom pieces to versatile dining and storage for a calm, coordinated home.",
  },
  tan: {
    focusKeyword: "tan furniture",
    secondaryKeywords: ["tan sofas", "beige furniture", "warm neutral furniture", "tan home decor"],
    title: "Tan Furniture | Styles for Your Home",
    description: "Warm your rooms with Ashley Furniture tan furniture, including beige seating, bedroom pieces and natural finishes that pair easily with layered decor.",
  },
  white: {
    focusKeyword: "white furniture",
    secondaryKeywords: ["white sofas", "white bedroom furniture", "bright home decor", "white dining furniture"],
    title: "White Furniture | Styles for Your Home",
    description: "Brighten your space with Ashley Furniture white furniture, including sofas, bedroom and dining pieces that create a fresh backdrop for any decor.",
  },
  brown: {
    focusKeyword: "brown furniture",
    secondaryKeywords: ["brown sofas", "wood furniture", "warm furniture finishes", "brown home decor"],
    title: "Brown Furniture | Styles for Your Home",
    description: "Add warmth with Ashley Furniture brown furniture, from rich wood finishes to soft upholstered seating that grounds living rooms and bedrooms.",
  },
  blue: {
    focusKeyword: "blue furniture",
    secondaryKeywords: ["blue sofas", "navy furniture", "blue accent chairs", "coastal furniture"],
    title: "Blue Furniture | Styles for Your Home",
    description: "Bring colour to your rooms with Ashley Furniture blue furniture, including navy seating, soft upholstered accents and pieces for coastal-inspired spaces.",
  },
  ivory: {
    focusKeyword: "ivory furniture",
    secondaryKeywords: ["ivory sofas", "cream furniture", "soft neutral furniture", "ivory bedroom furniture"],
    title: "Ivory Furniture | Styles for Your Home",
    description: "Create a soft, welcoming look with Ashley Furniture ivory furniture, featuring cream upholstery and light neutral finishes for relaxed, elegant rooms.",
  },
  green: {
    focusKeyword: "green furniture",
    secondaryKeywords: ["green sofas", "sage furniture", "botanical decor", "green accent chairs"],
    title: "Green Furniture | Styles for Your Home",
    description: "Connect your home to nature with Ashley Furniture green furniture, from sage sofas to botanical accents that add calm colour and character.",
  },
  black: {
    focusKeyword: "black furniture",
    secondaryKeywords: ["black sofas", "black dining tables", "modern black furniture", "contrast furniture"],
    title: "Black Furniture | Styles for Your Home",
    description: "Make a confident statement with Ashley Furniture black furniture, including sofas, tables and storage that add contrast to modern and classic rooms.",
  },
  sand: {
    focusKeyword: "sand furniture",
    secondaryKeywords: ["sand sofas", "beige furniture", "natural neutral decor", "warm upholstery"],
    title: "Sand Furniture | Styles for Your Home",
    description: "Layer warm neutrals with Ashley Furniture sand furniture, featuring soft upholstery and natural finishes for relaxed, earthy and welcoming interiors.",
  },
  walnut: {
    focusKeyword: "walnut furniture",
    secondaryKeywords: ["walnut wood furniture", "walnut tables", "dark wood furniture", "walnut decor"],
    title: "Walnut Furniture | Styles for Your Home",
    description: "Introduce rich wood tones with Ashley Furniture walnut furniture, including tables, beds and storage crafted for warmth and enduring style.",
  },
  natural: {
    focusKeyword: "natural furniture",
    secondaryKeywords: ["natural wood furniture", "neutral furniture", "organic home decor", "natural finishes"],
    title: "Natural Furniture | Styles for Your Home",
    description: "Celebrate honest materials with Ashley Furniture natural furniture, featuring wood grains, woven textures and neutral finishes for an organic home.",
  },
  terracotta: {
    focusKeyword: "terracotta furniture",
    secondaryKeywords: ["terracotta decor", "rust coloured furniture", "warm accent furniture", "earthy home decor"],
    title: "Terracotta Furniture | Styles for Your Home",
    description: "Add earthy warmth with Ashley Furniture terracotta furniture and accents, bringing rust-toned colour and inviting texture to relaxed interiors.",
  },
};

export function getCatalogSeo(scope: CatalogSeoScope): SeoCopy | undefined {
  if (scope.kind === "category") {
    if (scope.subcategory) return subcategorySeo[scope.subcategory];
    return categorySeo[scope.slug] ?? subcategorySeo[scope.slug];
  }
  if (scope.kind === "collection") return collectionSeo[scope.slug];
  if (scope.kind === "style") return styleSeo[scope.slug];
  return colorSeo[scope.slug];
}

export function productSeo(product: Product): SeoCopy {
  const subcategory = product.categoryPath[1] ?? product.category;
  const feature = product.shortFeatures.find((item) => item.trim() && !/\d+"\s*[W×]/.test(item)) ?? product.features[0];
  const cleanFeature = feature?.replace(/[.!?]+$/, "").trim();
  const prefix = `Discover the ${product.title} at Ashley Furniture.`;
  const suffix = " Explore this piece in our demo catalogue.";
  const featureLimit = 160 - prefix.length - suffix.length - 2;
  const compactFeature = cleanFeature
    ? truncateText(cleanFeature, Math.max(0, featureLimit)).replace(/…$/, "").trim()
    : "";
  return {
    focusKeyword: product.title.toLocaleLowerCase(),
    secondaryKeywords: normalizeKeywords(
      "Ashley Furniture",
      subcategorySeo[subcategory]?.focusKeyword ?? humanize(subcategory),
      ...product.styles.slice(0, 2).map((style) => `${humanize(style)} furniture`),
      ...product.colors.slice(0, 2).map((color) => `${humanize(color)} furniture`),
      ...product.features.slice(0, 2).map(humanize),
    ),
    title: product.title,
    description: `${prefix}${compactFeature ? ` ${compactFeature}.` : ""}${suffix}`,
  };
}

export const homeSeo: SeoCopy = {
  focusKeyword: "Ashley Furniture",
  secondaryKeywords: [
    "affordable home furniture",
    "home goods",
    "Ashley HomeStore",
    "living room furniture",
    "bedroom furniture",
    "dining room furniture",
    "mattresses",
  ],
  title: "Ashley Furniture | Affordable Home Furniture & Decor",
  description: "Shop Ashley Furniture for stylish, affordable home furniture and home goods in every style and budget. Browse online or visit a store near you and save today!",
};

export const staticPageSeo: Record<string, SeoCopy> = {
  about: {
    focusKeyword: "Ashley Furniture",
    secondaryKeywords: ["about Ashley Furniture", "furniture brand concept", "interior inspiration", "our design story"],
    title: "About Ashley Furniture | Our Design Story",
    description: "Meet Ashley Furniture, a home furniture and interior-inspiration concept exploring warm materials, practical design and thoughtful ideas for everyday homes.",
  },
  contact: {
    focusKeyword: "contact Ashley Furniture",
    secondaryKeywords: ["Ashley Furniture contact", "demo support", "furniture questions", "accessibility feedback"],
    title: "Contact Ashley Furniture | Demo Support",
    description: "Contact Ashley Furniture with questions about the furniture catalogue, accessibility or this frontend showcase. Demo messages stay in your browser.",
  },
  faq: {
    focusKeyword: "Ashley Furniture FAQ",
    secondaryKeywords: ["furniture demo FAQ", "demo checkout questions", "cart help", "order tracking help"],
    title: "Ashley Furniture FAQ | Demo Shopping Questions",
    description: "The Ashley Furniture FAQ answers questions about the demo cart, promo codes, mock checkout, delivery estimates, returns and order tracking.",
  },
  shipping: {
    focusKeyword: "furniture shipping and delivery",
    secondaryKeywords: ["furniture delivery", "shipping information", "delivery estimates", "store pickup demo"],
    title: "Furniture Shipping & Delivery | Demo Guide",
    description: "Explore furniture shipping and delivery in the Ashley Furniture demo, including standard timing, pickup estimates and locally calculated ZIP delivery windows.",
  },
  returns: {
    focusKeyword: "furniture returns and exchanges",
    secondaryKeywords: ["return policy", "furniture returns", "exchange policy", "demo return window"],
    title: "Furniture Returns & Exchanges | Demo Policy",
    description: "Read the Ashley Furniture returns and exchanges demo policy, including the 30-day window and why no real returns or refunds are processed.",
  },
  privacy: {
    focusKeyword: "privacy policy",
    secondaryKeywords: ["Ashley Furniture privacy", "localStorage privacy", "demo data", "clear browser data"],
    title: "Privacy Policy | Ashley Furniture Demo Data",
    description: "The Ashley Furniture privacy policy explains how this demo uses browser localStorage for carts, wishlists and mock orders, and how to clear data.",
  },
  terms: {
    focusKeyword: "terms of use",
    secondaryKeywords: ["Ashley Furniture terms", "demo terms", "website terms", "portfolio disclaimer"],
    title: "Terms of Use | Ashley Furniture Demo",
    description: "Review the Ashley Furniture demo terms of use. This portfolio storefront does not sell goods, collect payments, process financing or create real orders.",
  },
  accessibility: {
    focusKeyword: "website accessibility",
    secondaryKeywords: ["accessible furniture website", "keyboard navigation", "Ashley Furniture accessibility", "reduced motion"],
    title: "Website Accessibility | Ashley Furniture",
    description: "The Ashley Furniture website accessibility approach covers keyboard navigation, visible focus, labelled forms, responsive dialogs and reduced-motion support.",
  },
  financing: {
    focusKeyword: "furniture financing",
    secondaryKeywords: ["furniture payment plans", "demo financing", "monthly furniture estimates", "financing information"],
    title: "Furniture Financing | Ashley Furniture Demo",
    description: "Understand the illustrative furniture financing estimates in this Ashley Furniture demo. No credit checks, applications or real payments are processed.",
  },
  "design-services": {
    focusKeyword: "interior design services",
    secondaryKeywords: ["virtual interior design", "room planning", "furniture selection", "Ashley Furniture design"],
    title: "Interior Design Services | Ashley Furniture",
    description: "Explore Ashley Furniture interior design services, from room planning and finish coordination to furniture selection. This demo does not book consultations.",
  },
  careers: {
    focusKeyword: "furniture careers",
    secondaryKeywords: ["furniture jobs", "Ashley Furniture careers", "design careers", "demo company information"],
    title: "Furniture Careers | Ashley Furniture Demo",
    description: "Explore furniture careers on the Ashley Furniture demo page and the brand this frontend portfolio represents. No jobs are currently offered.",
  },
  press: {
    focusKeyword: "Ashley Furniture press and media",
    secondaryKeywords: ["press and media", "furniture brand story", "media information", "portfolio concept"],
    title: "Ashley Furniture Press & Media | Brand Story",
    description: "Learn about Ashley Furniture press and media for this original furniture and interior-inspiration concept. No official press office or media assets exist.",
  },
  stores: {
    focusKeyword: "furniture store locator",
    secondaryKeywords: ["Ashley Furniture stores", "store locator demo", "furniture pickup", "online furniture store"],
    title: "Furniture Store Locator | Ashley Furniture Demo",
    description: "Visit the Ashley Furniture store locator demo. Browse the online catalogue and review illustrative pickup information for living room and bedroom pieces.",
  },
  "track-order": {
    focusKeyword: "furniture order tracking",
    secondaryKeywords: ["order tracking", "track demo order", "furniture order status", "Ashley Furniture order"],
    title: "Furniture Order Tracking | Ashley Furniture",
    description: "Use Ashley Furniture order tracking to view a mock order saved in this browser after demo checkout. Enter your order number and email for status.",
  },
};

const utilitySeo: Record<UtilityPageKey, SeoCopy> = {
  search: {
    focusKeyword: "search furniture",
    secondaryKeywords: ["furniture search", "find home decor", "product search", "Ashley Furniture catalogue"],
    title: "Search Furniture & Decor | Ashley Furniture",
    description: "Search furniture in the Ashley Furniture demo catalogue by room, style, colour or product name to find furniture and decor inspiration for your home.",
  },
  cart: {
    focusKeyword: "furniture shopping cart",
    secondaryKeywords: ["shopping cart", "furniture cart", "cart totals", "demo promo codes"],
    title: "Furniture Shopping Cart | Ashley Furniture",
    description: "Review your furniture shopping cart with Ashley Furniture demo promo codes, quantities and estimated totals. Your selections are saved only in this browser.",
  },
  checkout: {
    focusKeyword: "demo furniture checkout",
    secondaryKeywords: ["mock checkout", "furniture checkout", "demo order", "no real payments"],
    title: "Demo Furniture Checkout | Ashley Furniture",
    description: "Complete the Ashley Furniture demo furniture checkout with fictional delivery details. No real payments, card numbers or orders are processed.",
  },
  order: {
    focusKeyword: "demo order confirmation",
    secondaryKeywords: ["furniture order confirmation", "mock order", "order status", "Ashley Furniture order"],
    title: "Demo Order Confirmation | Ashley Furniture",
    description: "View a locally saved Ashley Furniture demo order confirmation, estimated total and order status. No real purchase or shipment was created.",
  },
  wishlist: {
    focusKeyword: "furniture wishlist",
    secondaryKeywords: ["save furniture", "wishlist", "favourite furniture", "browser wishlist"],
    title: "Furniture Wishlist | Ashley Furniture",
    description: "Use your Ashley Furniture furniture wishlist to save and revisit pieces in this browser. Compare rooms, styles and colours without adding items to your cart.",
  },
  "not-found": {
    focusKeyword: "Ashley Furniture",
    secondaryKeywords: ["page not found", "furniture catalogue", "interior inspiration"],
    title: "Page Not Found | Ashley Furniture",
    description: "The Ashley Furniture page you requested could not be found. Return to the homepage or browse the separate furniture and interior-inspiration catalogue.",
  },
  "product-not-found": {
    focusKeyword: "product not found",
    secondaryKeywords: ["Ashley Furniture furniture", "furniture catalogue", "demo products"],
    title: "Product Not Found | Ashley Furniture",
    description: "Product not found in the Ashley Furniture demo catalogue. Browse other furniture and interior pieces to find inspiration for your home.",
  },
  "collection-not-found": {
    focusKeyword: "collection not found",
    secondaryKeywords: ["Ashley Furniture furniture", "furniture catalogue", "shop furniture"],
    title: "Collection Not Found | Ashley Furniture",
    description: "Collection not found in the Ashley Furniture demo catalogue. Browse furniture, decor and interior pieces for every room, colour and style.",
  },
  "page-not-found": {
    focusKeyword: "Ashley Furniture",
    secondaryKeywords: ["page not found", "furniture information", "demo website"],
    title: "Page Not Found | Ashley Furniture",
    description: "The Ashley Furniture information page could not be found. Visit the homepage or explore the demo furniture catalogue and design resources.",
  },
};

export function utilityMetadata(key: UtilityPageKey): Metadata {
  const seo = utilitySeo[key];
  return {
    title: metadataTitle(seo.title),
    description: seo.description,
    keywords: keywordsFor(seo),
    robots: { index: false, follow: false },
  };
}

export const homeMetadata: Metadata = {
  title: metadataTitle(homeSeo.title),
  description: homeSeo.description,
  keywords: keywordsFor(homeSeo),
  alternates: { canonical: "/" },
  openGraph: {
    title: brandedTitle(homeSeo.title),
    description: homeSeo.description,
    url: "/",
    images: [
      {
        url: "/images/photos/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "A warm, thoughtfully styled Ashley Furniture living room",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brandedTitle(homeSeo.title),
    description: homeSeo.description,
    images: ["/images/photos/og-image.jpg"],
  },
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ashley Furniture | Affordable Home Furniture & Decor",
    template: "%s",
  },
  description: "Shop Ashley Furniture for stylish, affordable home furniture and home goods for every room—living room, bedroom, dining, home office and outdoor.",
  applicationName: "Ashley Furniture",
  keywords: normalizeKeywords("Ashley Furniture", "affordable home furniture", "home goods", "sofas", "beds", "dining room furniture", "home office furniture", "outdoor furniture", "home decor"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ashley Furniture",
    title: "Ashley Furniture | Affordable Home Furniture & Decor",
    description: "Shop Ashley Furniture for stylish, affordable home furniture and home goods in every style and budget.",
    images: [{ url: "/images/photos/og-image.jpg", width: 1200, height: 630, alt: "Ashley Furniture" }],
  },
  twitter: { card: "summary_large_image", title: "Ashley Furniture", description: "Shop Ashley Furniture for stylish, affordable home furniture and home goods in every style and budget." },
  robots: process.env.NEXT_PUBLIC_SITE_DEMO === "false"
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: { icon: "/favicon.svg", apple: "/icon.svg" },
};

export function canonical(path: string): string {
  return `${SITE_URL.replace(/\/$/, "")}${path}`;
}
