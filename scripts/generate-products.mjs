#!/usr/bin/env node
/**
 * Deterministic static catalog generator for Haven & Oak.
 * Run from any directory: node scripts/generate-products.mjs
 */
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = resolve(ROOT, "src/data");
const PHOTO_MAP = JSON.parse(readFileSync(resolve(ROOT, "scripts/photo-map.json"), "utf8"));
const BRAND = "Haven & Oak";

const categoryDefinitions = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Relaxed seating, inviting textures, and considered proportions for the room where everyday life unfolds.",
    children: [
      ["sofas", "Sofas"],
      ["sectionals", "Sectionals"],
      ["recliners", "Recliners"],
      ["accent-chairs", "Accent Chairs"],
      ["ottomans", "Ottomans"],
    ],
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "Restful beds and organized storage with warm woods, soft upholstery, and details that make winding down feel effortless.",
    children: [
      ["beds", "Beds"],
      ["dressers", "Dressers"],
      ["nightstands", "Nightstands"],
    ],
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    description: "Gathering-ready tables, comfortable chairs, and coordinated sets for weeknight suppers and long weekend meals.",
    children: [
      ["dining-tables", "Dining Tables"],
      ["dining-chairs", "Dining Chairs"],
      ["dining-sets", "Dining Sets"],
    ],
  },
  {
    name: "Home Office",
    slug: "home-office",
    description: "Focused workspaces and supportive seating designed to make small corners and full home offices feel equally considered.",
    children: [
      ["desks", "Desks"],
      ["office-chairs", "Office Chairs"],
    ],
  },
  {
    name: "Outdoor",
    slug: "outdoor",
    description: "Weather-ready seating and dining pieces that bring an easy, indoor sensibility to patios, porches, and terraces.",
    children: [
      ["outdoor-seating", "Outdoor Seating"],
      ["outdoor-dining", "Outdoor Dining"],
    ],
  },
  {
    name: "Mattresses",
    slug: "mattresses",
    description: "Supportive hybrid, foam, latex, and innerspring mattresses with balanced comfort for a more restorative night.",
    children: [],
  },
  {
    name: "Rugs & Decor",
    slug: "rugs-decor",
    description: "Layer soft patterns, grounding rugs, and original artwork to add warmth and personality without a full redesign.",
    children: [
      ["rugs", "Rugs"],
      ["wall-art", "Wall Art"],
    ],
  },
  {
    name: "Storage & Shelves",
    slug: "storage",
    description: "Flexible shelving, concealed storage, and hardworking cabinets that keep daily clutter neatly out of view.",
    children: [
      ["bookcases", "Bookcases"],
      ["storage", "Storage"],
    ],
  },
  {
    name: "Pet",
    slug: "pet",
    description: "Washable mats and supportive beds made for naps, everyday messes, and the four-legged members of your household.",
    children: [
      ["pet-beds", "Pet Beds"],
      ["pet-mats", "Pet Mats"],
    ],
  },
];

const presets = {
  sofas: {
    styles: ["transitional", "modern"],
    materials: ["solid-wood", "polyester"],
    features: ["removable-cushions", "stain-resistant"],
    assembly: "Attach the legs with the included hardware; two people recommend for positioning. About 20 minutes.",
    care: "Vacuum gently with an upholstery attachment and blot spills promptly with a clean, dry cloth. Test cleaners on a hidden area first.",
  },
  sectionals: {
    styles: ["modern", "contemporary"],
    materials: ["engineered-wood", "polyester"],
    features: ["modular-seating", "stain-resistant"],
    assembly: "Connect the modules and attach the feet with included hardware. Two adults recommended; about 35 minutes.",
    care: "Vacuum cushions and crevices regularly. Blot spills promptly and use mild upholstery soap only after a hidden-area test.",
  },
  recliners: {
    styles: ["transitional", "contemporary"],
    materials: ["solid-wood", "polyester"],
    features: ["easy-recline", "high-resiliency-foam"],
    assembly: "Slot the back into the base until secure. Allow at least 18 inches of clearance behind the chair; about 15 minutes.",
    care: "Wipe wood or metal parts with a soft, dry cloth. Vacuum upholstery and blot spills immediately; avoid saturating cushions.",
  },
  "accent-chairs": {
    styles: ["modern", "contemporary"],
    materials: ["solid-wood", "upholstery"],
    features: ["solid-wood-frame", "soft-upholstery"],
    assembly: "Attach the four legs with the supplied hardware and tighten by hand; about 10 minutes.",
    care: "Dust the frame with a soft cloth. Vacuum the seat and back, then blot spills with a clean cloth and mild soap solution.",
  },
  ottomans: {
    styles: ["transitional", "contemporary"],
    materials: ["engineered-wood", "upholstery"],
    features: ["lift-top-storage", "removable-cushion"],
    assembly: "Attach the legs or secure the hinge hardware as directed; about 10 minutes. Keep fingers clear of hinges.",
    care: "Vacuum the upholstery and wipe spills promptly. Keep the interior dry and avoid overfilling the storage compartment.",
  },
  beds: {
    styles: ["modern", "transitional"],
    materials: ["solid-wood", "engineered-wood"],
    features: ["solid-wood-frame", "supportive-slats"],
    assembly: "Two adults should assemble the headboard, frame, and slats in about 45 minutes. A compatible foundation is recommended.",
    care: "Dust with a soft, dry cloth and wipe spills promptly. Tighten hardware periodically and avoid harsh or silicone-based cleaners.",
  },
  dressers: {
    styles: ["transitional", "modern"],
    materials: ["solid-wood", "engineered-wood"],
    features: ["smooth-drawers", "anti-tip-hardware"],
    assembly: "Attach the legs, fit the drawers, and secure the anti-tip restraint to a wall stud; about 50 minutes.",
    care: "Dust with a soft, dry cloth and wipe spills promptly. Use coasters for moisture and avoid prolonged direct sunlight.",
  },
  nightstands: {
    styles: ["transitional", "modern"],
    materials: ["solid-wood", "engineered-wood"],
    features: ["soft-close-drawers", "cable-access"],
    assembly: "Attach the legs or base and slide the drawer into place; about 15 minutes. Hardware and instructions included.",
    care: "Wipe with a soft, slightly damp cloth and dry immediately. Use coasters and keep heat-producing devices off the finish.",
  },
  "dining-tables": {
    styles: ["modern", "farmhouse"],
    materials: ["solid-wood", "engineered-wood"],
    features: ["solid-wood-top", "easy-assembly"],
    assembly: "Attach the legs or pedestal and tighten all bolts evenly; about 30 minutes. Two adults recommended for positioning.",
    care: "Use trivets and coasters. Wipe spills with a soft, damp cloth, dry promptly, and avoid abrasive or ammonia-based cleaners.",
  },
  "dining-chairs": {
    styles: ["modern", "transitional"],
    materials: ["solid-wood", "upholstery"],
    features: ["supportive-seat", "durable-finish"],
    assembly: "Attach the legs and back supports with the included hardware; about 15 minutes per chair.",
    care: "Dust wood with a soft cloth. Vacuum upholstered seats and blot spills promptly; tighten leg bolts every few months.",
  },
  "dining-sets": {
    styles: ["transitional", "modern"],
    materials: ["solid-wood", "upholstery"],
    features: ["coordinated-set", "easy-assembly"],
    assembly: "Assemble the table and chairs with included hardware; allow 60–90 minutes. Two adults recommended.",
    care: "Wipe the table and chair frames with a soft, damp cloth. Blot upholstery spills promptly and dry all surfaces after cleaning.",
  },
  desks: {
    styles: ["modern", "mid-century"],
    materials: ["engineered-wood", "solid-wood"],
    features: ["cable-management", "easy-assembly"],
    assembly: "Attach the legs or frame and secure any drawers; about 30 minutes. Check stability before adding equipment.",
    care: "Dust with a soft, dry cloth and wipe spills promptly. Use a desk mat and avoid placing hot drinks directly on the finish.",
  },
  "office-chairs": {
    styles: ["contemporary", "modern"],
    materials: ["steel", "mesh"],
    features: ["adjustable-height", "lumbar-support"],
    assembly: "Fit the seat, back, and armrests to the base, then insert the gas lift; about 20 minutes.",
    care: "Wipe mesh with a damp cloth and mild soap. Keep the hydraulic lift dry and check wheel and bolt tightness periodically.",
  },
  "outdoor-seating": {
    styles: ["coastal", "transitional"],
    materials: ["teak", "solution-dyed-acrylic"],
    features: ["weather-resistant", "quick-dry-cushions"],
    assembly: "Attach the legs or connect the frame with supplied hardware; about 25 minutes. Check all connections before use.",
    care: "Rinse with clean water and mild soap as needed, then air dry. Use fitted covers during severe weather or extended storage.",
  },
  "outdoor-dining": {
    styles: ["coastal", "farmhouse"],
    materials: ["acacia", "powder-coated-steel"],
    features: ["weather-resistant", "easy-clean-finish"],
    assembly: "Attach legs and braces with the included hardware; allow 30 minutes per chair and 40 minutes per table.",
    care: "Rinse away dirt and dry thoroughly. Store indoors during freezing weather and use outdoor-safe cleaners for stubborn spots.",
  },
  mattresses: {
    styles: ["contemporary"],
    materials: ["memory-foam", "high-density-foam"],
    features: ["pressure-relief", "motion-isolation"],
    assembly: "No assembly required. Unroll the mattress and allow 24–48 hours to reach its full shape before first use.",
    care: "Spot clean only with mild soap and water; do not saturate. Air periodically and use a supportive, well-fitted protector.",
  },
  rugs: {
    styles: ["transitional", "contemporary"],
    materials: ["polypropylene", "recycled-polyester"],
    features: ["low-pile", "stain-resistant"],
    assembly: "No assembly required. Unroll in a clean area and allow the fibers to relax for a few days before placement.",
    care: "Vacuum without a beater bar and blot spills immediately. Use a rug pad; professional cleaning is recommended for deep stains.",
  },
  "wall-art": {
    styles: ["modern", "transitional"],
    materials: ["wood", "archival-paper"],
    features: ["ready-to-hang", "protective-glazing"],
    assembly: "Ready to hang with the included hardware. Choose anchors appropriate for your wall type and follow the supplied template.",
    care: "Dust the frame with a soft, dry cloth. Hang away from direct sunlight and moisture; never spray cleaner onto the artwork.",
  },
  bookcases: {
    styles: ["modern", "mid-century"],
    materials: ["engineered-wood", "solid-wood"],
    features: ["adjustable-shelves", "anti-tip-hardware"],
    assembly: "Connect the sides, fit the shelves, and secure the anti-tip restraint to a wall stud; about 45 minutes.",
    care: "Dust shelves with a soft, dry cloth and wipe spills promptly. Respect shelf load limits and avoid climbing on the unit.",
  },
  storage: {
    styles: ["transitional", "modern"],
    materials: ["engineered-wood", "solid-wood"],
    features: ["concealed-storage", "anti-tip-hardware"],
    assembly: "Attach the base, align the doors or drawers, and secure the anti-tip restraint; about 45–60 minutes.",
    care: "Wipe with a soft, slightly damp cloth and dry promptly. Keep interiors dry and avoid overloading drawers or shelves.",
  },
  "pet-beds": {
    styles: ["contemporary", "transitional"],
    materials: ["polyester", "high-density-foam"],
    features: ["washable-cover", "supportive-foam"],
    assembly: "No assembly required. Remove the cover, insert the cushion, and place the bed on a dry, level surface.",
    care: "Remove loose hair with a lint roller or vacuum brush. Machine wash the cover cold when needed and air dry completely.",
  },
  "pet-mats": {
    styles: ["contemporary", "transitional"],
    materials: ["polyester", "recycled-polyester"],
    features: ["washable-cover", "non-slip-backing"],
    assembly: "No assembly required. Unroll or unfold the mat on a clean, dry, level surface.",
    care: "Shake out loose debris and machine wash cold with mild detergent. Air dry or tumble dry low; avoid fabric softener.",
  },
};

const featureLabels = {
  "removable-cushions": "Removable cushions make cleanup simple",
  "stain-resistant": "Stain-resistant finish simplifies everyday cleanup",
  "modular-seating": "Modular pieces adapt to your room",
  "power-recliner": "One-touch power reclining control",
  "usb-port": "Built-in USB charging keeps devices close",
  "easy-recline": "Smooth reclining motion with a locking position",
  "high-resiliency-foam": "High-resiliency foam cushions stay supportive",
  "solid-wood-frame": "Solid-wood frame for lasting stability",
  "soft-upholstery": "Soft upholstery with a tailored finish",
  "lift-top-storage": "Lift-top storage hides everyday clutter",
  "removable-cushion": "Removable cushion simplifies care",
  "supportive-slats": "Supportive slats suit a standard foundation",
  "smooth-drawers": "Smooth drawers keep essentials organized",
  "anti-tip-hardware": "Wall anchor hardware included for safety",
  "soft-close-drawers": "Soft-close drawers reduce noise",
  "cable-access": "Cable access keeps devices tidy",
  "solid-wood-top": "Solid-wood top with natural character",
  "easy-assembly": "Straightforward assembly with included hardware",
  "supportive-seat": "Contoured seat supports longer sittings",
  "durable-finish": "Durable finish wipes clean easily",
  "coordinated-set": "Coordinated pieces create a complete look",
  "cable-management": "Built-in cable management clears the desktop",
  "adjustable-height": "Adjustable height supports a better posture",
  "lumbar-support": "Contoured lumbar support adds comfort",
  "weather-resistant": "Weather-ready materials for outdoor living",
  "quick-dry-cushions": "Quick-dry cushions return to use sooner",
  "easy-clean-finish": "Smooth finish makes routine cleaning easy",
  "pressure-relief": "Pressure-relieving comfort for restful nights",
  "motion-isolation": "Cushioning helps limit motion transfer",
  "low-pile": "Low-pile profile fits under many doors",
  "ready-to-hang": "Hanging hardware included for easy display",
  "protective-glazing": "Protective glazing helps shield the artwork",
  "adjustable-shelves": "Adjustable shelves fit changing collections",
  "concealed-storage": "Concealed storage keeps rooms looking calm",
  "washable-cover": "Washable cover simplifies fresh-up routines",
  "supportive-foam": "Supportive foam cushions favorite resting spots",
  "non-slip-backing": "Non-slip backing helps the mat stay put",
  "cooling-comfort": "Cooling comfort layers help regulate warmth",
  "orthopedic-support": "Balanced orthopedic support for everyday rest",
  "latex-comfort": "Responsive latex comfort with a buoyant feel",
  "reversible-design": "Reversible design offers two styling options",
  "extendable-tabletop": "Extendable top makes room for extra guests",
  "hidden-storage": "Hidden storage keeps the desktop clear",
  "foldable-design": "Folding design saves floor space",
  "edge-support": "Reinforced perimeter supports the sleep surface",
  "responsive-comfort": "Responsive coils add buoyant support",
  "breathable-cover": "Breathable cover encourages airflow",
};

// title, child category, price cents, dimensions inches, weight lb, colors,
// original detail phrase, suggested setting. Flags mark deliberate sale,
// range, and sold-out assignments rather than relying on runtime randomness.
const catalog = [
  ["Alderbrook 3-Seat Sofa", "sofas", 89900, [82, 36, 34], 141, ["oatmeal", "gray"], "soft track arms and a low, tailored profile", "a family room that balances busy mornings with slow evenings"],
  ["Willow 5-Piece Modular Sectional", "sectionals", 349999, [142, 92, 33], 286, ["ivory", "taupe"], "deep seats and generous modular proportions", "an open-plan living space that needs flexible conversation areas", { sale: true, pieces: 5 }],
  ["Calder 2-Seat Power Reclining Sofa", "sofas", 129900, [80, 39, 38], 188, ["gray", "brown"], "a clean, cushioned back and discreet touch controls", "a media room where comfort should never interrupt the view", { rangeMax: 169900, rangeSizes: ["Standard", "Power plus", "Power plus with console"], features: ["power-recliner", "usb-port"] }],
  ["Cove 3-Piece Chaise Sectional", "sectionals", 229900, [128, 68, 34], 254, ["blue", "gray"], "an extended chaise and gently rounded corners", "a spacious lounge made for stretching out after dinner", { pieces: 3 }],
  ["Ridgeway Power Wall-Hugger Recliner", "recliners", 99900, [38, 40, 42], 112, ["tan", "brown"], "a compact frame that reclines close to the wall", "a reading corner where every inch of floor space matters", { sale: true, features: ["power-recliner", "easy-recline"] }],
  ["Solace Swivel Glider Recliner", "recliners", 119900, [35, 38, 41], 98, ["olive", "cream"], "a gently curved back and quiet swivel glide", "a nursery or den that needs adaptable, calming comfort"],
  ["Wren Curved Accent Chair", "accent-chairs", 44900, [31, 32, 30], 38, ["rust", "oatmeal"], "a wraparound curved back and slender wooden legs", "a bedroom nook that deserves a characterful extra seat", { soldOut: true }],
  ["Pebble Lift-Top Storage Ottoman", "ottomans", 22900, [32, 22, 19], 26, ["gray", "natural"], "a softly rounded top and hidden storage compartment", "a coffee-table arrangement that needs flexible extra seating"],

  ["Ashgrove Platform Bed", "beds", 109900, [84, 86, 48], 128, ["walnut", "oak"], "a low platform profile and slatted headboard", "a calm bedroom with a clean-lined, uncluttered aesthetic"],
  ["Marlowe Upholstered Bed", "beds", 134900, [90, 88, 52], 152, ["ivory", "gray"], "a tall channel-tufted headboard and softly padded base", "a primary bedroom that feels serene from the doorway", { sale: true }],
  ["Oakline Storage Bed", "beds", 99900, [88, 92, 46], 176, ["oak", "walnut"], "two discreet drawers and a warm, grained frame", "a smaller bedroom where storage should work below the bed", { rangeMax: 139900, rangeSizes: ["Queen", "King", "California king"] }],
  ["Juniper 6-Drawer Dresser", "dressers", 79900, [58, 20, 30], 118, ["walnut", "oak"], "six wide drawers and softly beveled fronts", "a bedroom that needs generous storage without visual heaviness"],
  ["Sienna 9-Drawer Dresser", "dressers", 99900, [64, 22, 32], 142, ["ivory", "white"], "a light painted finish and nine carefully sized drawers", "an airy bedroom with limited closet space", { sale: true }],
  ["Linden 2-Drawer Nightstand", "nightstands", 24900, [22, 18, 24], 31, ["oak", "walnut"], "a compact two-drawer body and open rear cable port", "a bedside setup that keeps books and chargers within reach"],
  ["Ellery 3-Drawer Nightstand", "nightstands", 32900, [24, 20, 26], 39, ["gray", "oak"], "three shallow drawers and a contrasting pull detail", "a layered bedside composition with room for small essentials"],

  ["Harbor Extendable Dining Table", "dining-tables", 89900, [90, 40, 30], 104, ["walnut", "oak"], "a self-storing leaf and sturdy trestle base", "a dining room that alternates between four and eight guests", { sale: true, features: ["solid-wood-top", "extendable-tabletop"] }],
  ["Pierce Spindle Dining Chair", "dining-chairs", 14900, [20, 22, 34], 18, ["walnut", "white"], "turned spindle posts and a gently contoured seat", "a farmhouse table that welcomes everyday family meals"],
  ["Mila Upholstered Dining Chair", "dining-chairs", 19900, [22, 23, 35], 21, ["olive", "tan"], "a softly upholstered seat and tapered wood legs", "long dinners where comfort matters as much as the setting"],
  ["Rowan 7-Piece Dining Set", "dining-sets", 159900, [84, 40, 30], 181, ["oak", "ivory"], "a rectangular table with six coordinating side chairs", "a dedicated dining room built around generous shared meals", { pieces: 7 }],
  ["Briar 5-Piece Round Dining Set", "dining-sets", 119900, [48, 48, 30], 126, ["walnut", "gray"], "a round pedestal table and four compact chairs", "a breakfast nook that benefits from easy conversation", { sale: true, pieces: 5 }],
  ["Alder Linear Dining Table", "dining-tables", 129900, [96, 42, 30], 138, ["oak", "walnut"], "a broad linear top and clean architectural legs", "a contemporary dining space with room to entertain"],
  ["Lark Bistro Dining Chair", "dining-chairs", 12900, [19, 21, 31], 15, ["black", "tan"], "a powder-coated frame and lightweight profile", "a small kitchen table that needs durable everyday seating"],
  ["Marlow Oval Pedestal Dining Table", "dining-tables", 149900, [84, 44, 30], 119, ["walnut", "ivory"], "an oval top and sculptural central pedestal", "a dining area where curved edges soften the room"],

  ["Arden Writing Desk", "desks", 39900, [48, 24, 30], 58, ["oak", "walnut"], "a compact worktop and two smooth utility drawers", "a bedroom corner that needs a proper place to focus", { sale: true }],
  ["Ledger Executive Desk", "desks", 74900, [66, 30, 31], 96, ["walnut", "gray"], "a wide work surface and locking file pedestal", "a home office that supports paperwork and video calls"],
  ["Frame Lift-Top Desk", "desks", 54900, [48, 24, 38], 72, ["oak", "white"], "a floating lift-top panel with hidden media storage", "a multifunctional room that shifts between work and creative projects", { features: ["cable-management", "hidden-storage"] }],
  ["Nook Folding Desk", "desks", 18900, [36, 18, 29], 24, ["walnut", "black"], "a slim folding top and space-saving metal frame", "an apartment workspace that needs to disappear at day's end", { features: ["foldable-design", "easy-assembly"] }],
  ["Form Task Chair", "office-chairs", 32900, [26, 26, 47], 31, ["gray", "black"], "a breathable mesh back and adjustable armrests", "a compact workstation used for email, planning, and everyday tasks"],
  ["Vista High-Back Office Chair", "office-chairs", 44900, [28, 28, 51], 38, ["black", "gray"], "a tall supportive back and synchronized recline", "long workdays that call for reliable posture support"],
  ["Sway Mid-Back Office Chair", "office-chairs", 29900, [27, 26, 46], 34, ["olive", "gray"], "a flexible mid-back shell and cushioned seat", "a creative workspace that values movement and color", { sale: true }],
  ["Drift Leather Office Chair", "office-chairs", 89900, [29, 29, 49], 42, ["brown", "black"], "supple upholstery and a polished five-star base", "an executive office that should feel settled and substantial", { features: ["adjustable-height", "lumbar-support"] }],

  ["Cedar Ridge Outdoor Loveseat", "outdoor-seating", 69900, [58, 30, 32], 74, ["tan", "olive"], "a teak frame and soft, quick-dry seat cushions", "a covered porch made for morning coffee and evening conversation"],
  ["Solstice Outdoor Sectional", "outdoor-seating", 129900, [110, 68, 31], 143, ["sand", "gray"], "modular outdoor sections and deep relaxed seating", "a generous patio arranged for hosting friends", { sale: true, pieces: 3 }],
  ["Harborline Adirondack Chair", "outdoor-seating", 34900, [32, 38, 40], 29, ["natural", "olive"], "a slatted back and broad angled seat", "a quiet garden corner with a view worth lingering over"],
  ["Dune Outdoor Rocking Chair", "outdoor-seating", 29900, [30, 34, 41], 27, ["white", "natural"], "a curved slatted back and gentle rocking runners", "a shaded balcony where slow afternoons feel inviting"],
  ["Driftwood Outdoor Dining Table", "outdoor-dining", 74900, [72, 36, 30], 86, ["natural", "gray"], "an acacia top and cross-braced powder-coated frame", "a patio set for casual meals under open sky"],
  ["Pergola Outdoor Dining Chair", "outdoor-dining", 24900, [21, 23, 34], 22, ["olive", "natural"], "a slatted back and sturdy all-weather frame", "an outdoor table that needs lightweight, stackable seating"],
  ["Lantern 5-Piece Outdoor Dining Set", "outdoor-dining", 99900, [72, 36, 30], 118, ["natural", "olive"], "a coordinated table and four all-weather chairs", "a compact deck ready for weeknight dinners outside", { sale: true, pieces: 5 }],
  ["Coastline Outdoor Bistro Set", "outdoor-dining", 44900, [30, 30, 40], 48, ["white", "blue"], "a round cafe table and two compact chairs", "a small terrace that still deserves a proper gathering place", { pieces: 3 }],

  ["Cloudrest Hybrid Mattress", "mattresses", 99900, [80, 60, 12], 92, ["ivory", "gray"], "coiled support beneath a cushioned foam surface", "sleepers who want a balanced feel without a rigid top", { materials: ["innerspring", "memory-foam"], features: ["pressure-relief", "motion-isolation"] }],
  ["Evergreen Innerspring Mattress", "mattresses", 74900, [80, 60, 10], 81, ["white", "ivory"], "a traditional coil core with a lightly padded surface", "a guest room that should feel welcoming on the first night", { sale: true, materials: ["steel", "polyester"], features: ["edge-support", "responsive-comfort"] }],
  ["Havenly Memory Foam Mattress", "mattresses", 119900, [80, 60, 12], 88, ["ivory", "white"], "contouring foam layers and a breathable knit cover", "side sleepers who appreciate close, pressure-relieving comfort"],
  ["Willow Latex Hybrid Mattress", "mattresses", 149900, [80, 60, 11], 96, ["natural", "white"], "responsive latex wrapped around a supportive core", "a cool bedroom where buoyant comfort takes priority", { materials: ["natural-latex", "wool"], features: ["latex-comfort", "breathable-cover"] }],
  ["Drift Plush Mattress", "mattresses", 89900, [80, 60, 13], 90, ["ivory", "blue"], "a pillowy top and a stable foam-and-coil foundation", "a restful retreat designed around softness and deep relaxation"],
  ["Summit Orthopedic Mattress", "mattresses", 69900, [80, 60, 11], 86, ["white", "gray"], "balanced lumbar support and a smooth, washable cover", "a daily sleep routine that values steady, dependable support", { sale: true, features: ["orthopedic-support", "motion-isolation"] }],
  ["Breeze Cooling Mattress", "mattresses", 109900, [80, 60, 12], 84, ["ivory", "gray"], "a ventilated foam layer and moisture-wicking cover", "warm sleepers looking for a less clammy night", { features: ["cooling-comfort", "pressure-relief"] }],
  ["Luna Euro-Top Mattress", "mattresses", 129900, [80, 60, 14], 98, ["white", "natural"], "a generous Euro-top and individually wrapped coils", "a spacious primary suite with room for indulgent comfort", { soldOut: true, features: ["pressure-relief", "edge-support"] }],

  ["Solace Wool Area Rug", "rugs", 39900, [120, 96, 2], 48, ["sand", "gray"], "a dense wool pile and subtle tonal geometry", "a living room that needs softness underfoot and a quiet anchor"],
  ["Tide Geometric Indoor Rug", "rugs", 24900, [120, 120, 2], 36, ["blue", "ivory"], "a graphic geometric field and crisp ivory border", "a neutral room ready for a measured hit of color"],
  ["Meadow Flatweave Rug", "rugs", 19900, [120, 72, 2], 28, ["olive", "natural"], "a flatwoven surface with an easy organic rhythm", "a dining area where a low profile suits moving chairs", { materials: ["wool", "cotton"] }],
  ["Hearth Vintage-Style Rug", "rugs", 29900, [120, 96, 2], 42, ["rust", "ivory"], "a softened ornate pattern and gently faded palette", "a traditional room that benefits from timeworn character", { sale: true }],
  ["Orbit Abstract Wall Art", "wall-art", 18900, [32, 2, 40], 12, ["rust", "blue"], "overlapping circles and a warm, restrained palette", "a blank wall that needs a simple contemporary focal point"],
  ["Stillwater Framed Art", "wall-art", 22900, [40, 2, 30], 15, ["olive", "sand"], "quiet landscape forms and a slim natural-wood frame", "a reading nook that could use a gentle sense of escape"],
  ["Grove Botanical Print", "wall-art", 15900, [24, 2, 32], 9, ["green", "ivory"], "delicate leaf studies on a softly textured ground", "a sunlit breakfast area with a fresh, botanical mood", { sale: true }],
  ["Arch No. 3 Framed Art", "wall-art", 27900, [36, 2, 44], 17, ["brown", "white"], "layered architectural arches and tactile neutral tones", "an entryway that deserves a welcoming vertical accent"],

  ["Harlow Open Bookcase", "bookcases", 44900, [36, 14, 72], 68, ["oak", "walnut"], "five open shelves and clean tapered side supports", "a living room library that mixes books with found objects"],
  ["Atlas Ladder Bookcase", "bookcases", 32900, [32, 16, 70], 52, ["walnut", "black"], "an open ladder profile with four roomy tiers", "a small home office that needs storage without a heavy footprint"],
  ["Cedar 5-Cube Storage Unit", "storage", 54900, [56, 16, 30], 83, ["oak", "white"], "five modular cubes with removable back panels", "a family room where baskets and displayed pieces share space", { sale: true }],
  ["Ellis Media Console", "storage", 69900, [60, 18, 28], 79, ["walnut", "oak"], "two sliding doors and a ventilated equipment bay", "a media setup that should look considered when screens are off"],
  ["Marlow Storage Cabinet", "storage", 59900, [42, 20, 58], 101, ["gray", "walnut"], "two paneled doors and one adjustable interior shelf", "a dining room that needs table linens kept close at hand", { rangeMax: 89900, rangeSizes: ["Compact", "Standard"] }],
  ["Willow Entryway Bench", "storage", 44900, [48, 18, 23], 61, ["oak", "gray"], "a padded seat and two useful storage drawers", "an entryway that welcomes bags, shoes, and a brief pause"],
  ["Parliament Storage Ottoman", "storage", 18900, [38, 22, 20], 29, ["tan", "brown"], "a hinged upholstered top and generous concealed base", "a spare room that needs seating and blanket storage", { sale: true }],
  ["Keystone 4-Door Storage Cabinet", "storage", 89900, [48, 22, 64], 137, ["oak", "walnut"], "four framed doors and a broad adjustable shelf", "a dining or living room with more collections than closet space"],

  ["Cloudburst Bolster Pet Bed", "pet-beds", 12900, [30, 26, 14], 12, ["oatmeal", "gray"], "a supportive oval cushion ringed by a soft bolster", "a dog that likes to curl up close to the family"],
  ["Hearthstone Orthopedic Pet Bed", "pet-beds", 17900, [34, 28, 16], 16, ["taupe", "olive"], "a thick supportive base and supportive raised edges", "an older pet that appreciates an easier place to rest", { sale: true }],
  ["Pebble Cave Pet Bed", "pet-beds", 9900, [26, 24, 18], 11, ["gray", "rust"], "a softly enclosed hood and deep, snug cushion", "a small pet that enjoys a den-like sleeping spot"],
  ["Willow Wraparound Pet Bed", "pet-beds", 14900, [32, 30, 18], 14, ["olive", "oatmeal"], "a wraparound bolster and washable cotton-blend cover", "a cat that alternates between stretching and curling"],
  ["Trailhead Pet Mat", "pet-mats", 5900, [36, 24, 2], 4, ["gray", "blue"], "a low-profile cushion and grippy recycled backing", "a kitchen or entryway where everyday paws tend to land"],
  ["Haven Washable Pet Mat", "pet-mats", 4900, [30, 20, 2], 3, ["oatmeal", "taupe"], "a simple washable surface with a soft quilted top", "a busy household that needs quick cleanup between washes", { sale: true }],
  ["Paws & Leaves Pet Mat", "pet-mats", 5900, [32, 22, 2], 4, ["olive", "ivory"], "a playful paw-and-leaf pattern with a nonslip base", "a pet station that can be practical without looking plain"],
  ["Drift Bolster Pet Mat", "pet-mats", 6900, [40, 28, 3], 6, ["sand", "gray"], "a slim bolster edge and supportive foam center", "a larger dog that prefers stretching out on a low bed"],
  ["Haven 2-Drawer Nightstand", "nightstands", 26900, [23, 19, 25], 35, ["ivory", "oak"], "two roomy drawers and a softly rounded drawer front", "a bedside corner that needs warm storage in a compact scale"],
];

const materialPhrases = {
  "solid-wood": "solid wood",
  "engineered-wood": "engineered wood",
  polyester: "durable polyester upholstery",
  upholstery: "soft upholstery",
  steel: "a sturdy steel frame",
  mesh: "breathable mesh",
  teak: "weather-ready teak",
  "solution-dyed-acrylic": "solution-dyed acrylic cushions",
  acacia: "a naturally grained acacia frame",
  "powder-coated-steel": "powder-coated steel",
  "memory-foam": "responsive memory foam",
  "high-density-foam": "supportive high-density foam",
  innerspring: "a responsive innerspring core",
  polypropylene: "durable polypropylene fibers",
  "recycled-polyester": "recycled polyester fibers",
  wood: "a solid-wood frame",
  "archival-paper": "archival paper",
  wool: "natural wool",
  cotton: "soft cotton",
  "natural-latex": "responsive natural latex",
};

const stylePhrases = {
  modern: "clean-lined modern",
  contemporary: "relaxed contemporary",
  traditional: "warm traditional",
  transitional: "easy transitional",
  farmhouse: "grounded farmhouse",
  coastal: "breezy coastal",
  "mid-century": "mid-century inspired",
  curved: "softly curved",
  cozy: "cozy",
};

const primaryByChild = new Map(categoryDefinitions.flatMap((category) => (
  category.children.length
    ? category.children.map(([slug]) => [slug, category])
    : [[category.slug, category]]
)));

function hash(value) {
  let result = 2166136261;
  for (const character of String(value)) {
    result ^= character.codePointAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return value.replace(/(^|[\s-])\S/g, (letter) => letter.toUpperCase());
}

function sentence(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function naturalList(values, formatter = (value) => value) {
  const formatted = values.map(formatter);
  if (formatted.length < 2) return formatted[0] ?? "";
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(", ")}, and ${formatted.at(-1)}`;
}

function makeDescription(product, seed) {
  const [title, , , dimensions, , colors, detail, setting] = seed;
  const styles = product.styles.map((style) => stylePhrases[style] ?? style);
  const materials = product.materials.map((material) => (
    ["pet-beds", "pet-mats", "rugs"].includes(product.category) && material === "polyester"
      ? "durable polyester fibers"
      : materialPhrases[material] ?? material
  ));
  const colorNames = colors.map((color) => color === "natural" ? "natural wood tones" : color);
  const highlights = product.features.map((feature) => featureLabels[feature]).filter(Boolean);
  const featureSentence = highlights.length
    ? `${highlights.map((highlight, index) => index === 0 ? sentence(highlight) : highlight.charAt(0).toLowerCase() + highlight.slice(1)).join("; ")}.`
    : "Thoughtful construction keeps the piece practical for everyday use.";
  const detailSentence = `The design is defined by ${detail}`;
  const dimensionNote = `Its ${dimensions[0]} by ${dimensions[1]} by ${dimensions[2]}-inch footprint is easy to plan around`;
  const materialSentence = `${naturalList(materials)} add structure and warmth`;
  const templates = [
    `The ${title} brings considered design to ${setting}. ${detailSentence}. Its ${naturalList(styles)} character and ${naturalList(colorNames)} palette feel easy to place, while ${materialSentence}. ${featureSentence} The result is welcoming, practical, and easy to adapt as your routines change.`,
    `Designed for ${setting}, the ${title} pairs ${detail} with a quietly useful silhouette. ${dimensionNote}. The ${naturalList(colorNames)} palette complements ${naturalList(materials)} for a cohesive look. ${featureSentence} Practical details make home life simpler without losing the warm, approachable character.`,
    `With ${detail}, the ${title} makes a calm statement in ${setting}. A ${naturalList(styles)} sensibility informs the proportions, while ${naturalList(colorNames)} tones combine easily with pieces you already own. ${sentence(materialSentence)}. ${featureSentence} The design balances visual softness with practical construction for a real home.`,
    `The ${title} suits ${setting} with ${detail}. ${sentence(naturalList(materials))} support the design, and the ${naturalList(colorNames)} palette adds warmth without overwhelming the room. ${featureSentence} The ${naturalList(styles)} character works with both existing furnishings and a fresh start. ${dimensionNote}.`,
    `Bring a little more intention to ${setting} with the ${title}. ${detailSentence}, while ${naturalList(materials)} provide a reassuring sense of durability. The ${naturalList(colorNames)} palette and ${naturalList(styles)} styling create an easy foundation for surrounding decor. ${featureSentence} Practical but expressive, it lets your own artwork and textiles take the lead.`,
    `For ${setting}, the ${title} combines ${detail} with a versatile scale. ${sentence(materialSentence)}. Its ${naturalList(colorNames)} palette sits comfortably alongside ${naturalList(styles)} influences. ${featureSentence} The design rewards simple care through changing seasons and daily habits. ${dimensionNote}.`,
  ];
  return templates[hash(title) % templates.length];
}

function makeProduct(seed, index) {
  const [title, category, price, dimensions, weight, colors] = seed;
  const flags = seed[8] ?? {};
  const primary = primaryByChild.get(category);
  assert(primary, `Unknown child category: ${category}`);
  const preset = presets[category];
  const id = `HO${String(1001 + index).toString().padStart(4, "0")}`;
  const styles = flags.styles ?? preset.styles;
  const materials = flags.materials ?? preset.materials;
  const features = flags.features ?? preset.features;
  const sale = Boolean(flags.sale);
  const saleRate = 0.18 + (hash(title) % 9) / 100;
  const originalPrice = sale ? Math.round((price / (1 - saleRate)) / 100) * 100 : undefined;
  const createdAt = new Date(Date.UTC(2025, 8, 1) + ((index * 37) % 425) * 86400000).toISOString().slice(0, 10);
  const imageCount = index % 6 === 0 ? 3 : 2;
  const badges = [];
  if (sale) badges.push("sale");
  if ((index + 1001) % 10 === 3) badges.push("best-seller");
  if ((index + 1001) % 12 === 5) badges.push("exclusive");
  if ((index + 1001) % 14 === 8) badges.push("luxe");
  if (createdAt >= "2026-07-01" && index % 3 !== 0) badges.push("new");
  const product = {
    id,
    slug: `${slugify(title)}-${id}`,
    title,
    brand: BRAND,
    category,
    categoryPath: [primary.slug, ...(category === primary.slug ? [] : [category])],
    styles,
    colors,
    materials,
    features,
    badges,
    price,
    ...(originalPrice ? { originalPrice } : {}),
    ...(flags.rangeMax ? { priceMax: flags.rangeMax } : {}),
    ...(["accent-chairs", "ottomans", "nightstands", "dining-chairs", "wall-art", "pet-mats"].includes(category) ? { priceLabel: "each" } : {}),
    rating: Number((3.9 + (hash(`${title}-rating`) % 11) / 10).toFixed(1)),
    reviewCount: 18 + (hash(`${title}-reviews`) % 369),
    inStock: !flags.soldOut,
    createdAt,
    shortFeatures: [
      ...features.slice(0, 2).map((feature) => featureLabels[feature]).filter(Boolean),
      `${dimensions[0]}" W × ${dimensions[1]}" D × ${dimensions[2]}" H`,
    ],
    description: "",
    ...(flags.pieces ? {
      includes: category === "sectionals"
        ? `Includes ${flags.pieces} modular pieces with all required connectors and hardware.`
        : `Includes ${flags.pieces} pieces: one table and ${flags.pieces - 1} chairs.`,
    } : {}),
    assembly: preset.assembly,
    dimensions: { width: dimensions[0], depth: dimensions[1], height: dimensions[2], unit: "in", weight },
    care: preset.care,
    images: Array.from({ length: imageCount }, (_, imageIndex) => ({
      src: `/images/photos/products/${id}-${imageIndex + 1}.webp`,
      alt: `${title} in ${naturalList(colors)}, ${["front view", "material detail", "styled room view"][imageIndex]}`,
    })),
  };
  product.description = makeDescription(product, seed);
  if (index % 2 === 0 || flags.rangeMax) {
    const variantCount = flags.rangeMax || index % 3 === 0 ? 4 : 2;
    const rangeSizes = flags.rangeSizes ?? [];
    product.variants = Array.from({ length: variantCount }, (_, variantIndex) => {
      const color = colors[variantIndex % colors.length];
      const size = rangeSizes.length
        ? rangeSizes[Math.floor(variantIndex / colors.length) % rangeSizes.length]
        : undefined;
      const finishOptions = {
        sofas: ["Performance weave", "Textured weave"],
        sectionals: ["Performance weave", "Textured weave"],
        recliners: ["Performance weave", "Textured weave"],
        "accent-chairs": ["Natural wood", "Smoked wood"],
        ottomans: ["Performance weave", "Textured weave"],
        beds: ["Natural wood", "Smoked wood"],
        dressers: ["Natural finish", "Distressed finish"],
        nightstands: ["Natural finish", "Distressed finish"],
        "dining-tables": ["Natural finish", "Distressed finish"],
        "dining-chairs": ["Natural wood", "Smoked wood"],
        "dining-sets": ["Natural finish", "Distressed finish"],
        desks: ["Natural finish", "Distressed finish"],
        "office-chairs": ["Mesh back", "Upholstered back"],
        "outdoor-seating": ["Standard cushion", "Deep cushion"],
        "outdoor-dining": ["Natural finish", "Smoked finish"],
        mattresses: ["Standard cover", "Cool-touch cover"],
        rugs: ["Flatweave", "Plush weave"],
        "wall-art": ["Natural frame", "Black frame"],
        bookcases: ["Natural finish", "Distressed finish"],
        storage: ["Natural finish", "Distressed finish"],
        "pet-beds": ["Classic cover", "Heathered cover"],
        "pet-mats": ["Classic cover", "Heathered cover"],
      };
      const finish = !size && variantCount === 4
        ? finishOptions[category][Math.floor(variantIndex / colors.length)]
        : undefined;
      const delta = flags.rangeMax
        ? (variantIndex === variantCount - 1
          ? flags.rangeMax - price
          : Math.round(((flags.rangeMax - price) * variantIndex) / (variantCount - 1) / 100) * 100)
        : variantIndex * (index % 4 === 0 ? 4500 : 2500);
      const optionParts = [color, size, finish].filter(Boolean);
      return {
        id: `${id}-${slugify(optionParts.join("-"))}`,
        label: optionParts.map((part) => titleCase(part)).join(" / "),
        options: { color: titleCase(color), ...(size ? { size: titleCase(size) } : {}), ...(finish ? { finish } : {}) },
        price: price + delta,
        ...(originalPrice ? { originalPrice: originalPrice + delta } : {}),
        inStock: product.inStock,
        ...(variantIndex % 2 === 1 ? { image: product.images[1].src } : {}),
      };
    });
  }
  return product;
}

const primaryOrder = new Map(categoryDefinitions.map((category, index) => [category.slug, index]));
const products = catalog.map(makeProduct).sort((a, b) => (
  primaryOrder.get(a.categoryPath[0]) - primaryOrder.get(b.categoryPath[0]) || a.id.localeCompare(b.id)
));
const categories = categoryDefinitions.map((category) => ({
  name: category.name,
  slug: category.slug,
  image: `/images/photos/categories/${category.slug}.webp`,
  description: category.description,
  children: category.children.map(([slug, name]) => ({ slug, name })),
}));

const styleOrder = ["modern", "contemporary", "traditional", "transitional", "farmhouse", "coastal", "mid-century"];
const colorOrder = ["gray", "tan", "ivory", "white", "brown", "blue", "green", "black", "sand", "walnut", "natural"];
const categoryPromoTiles = [
  ["The soft landing edit", "spring-refresh"],
  ["A quieter kind of luxury", "cozy-furniture"],
  ["Set the table beautifully", "designer-picks"],
  ["Make room for focus", "new-arrivals"],
  ["Open-air living", "spring-refresh"],
  ["A better night starts here", "cozy-furniture"],
  ["Color, texture, personality", "designer-picks"],
  ["A place for everything", "new-arrivals"],
  ["Comfort for every member", "best-sellers"],
];

const navigation = [
  ...categories.map((category, categoryIndex) => {
    const categoryProducts = products.filter((product) => product.categoryPath[0] === category.slug);
    const categoryStyles = styleOrder.filter((style) => categoryProducts.some((product) => product.styles.includes(style)));
    const categoryColors = colorOrder.filter((color) => categoryProducts.some((product) => product.colors.includes(color)));
    const [promoTitle, promoSlug] = categoryPromoTiles[categoryIndex];
    return {
      kind: "category",
      label: category.name,
      slug: category.slug,
      href: `/c/${category.slug}`,
      links: [
        { label: `Shop all ${category.name}`, href: `/c/${category.slug}` },
        ...category.children.map((child) => ({ label: child.name, href: `/c/${category.slug}/${child.slug}` })),
      ],
      styleLinks: categoryStyles.map((style) => ({ label: titleCase(style), href: `/c/${category.slug}?style=${style}` })),
      colorLinks: categoryColors.map((color) => ({ label: titleCase(color), href: `/c/${category.slug}?color=${color}` })),
      promoTile: {
        title: promoTitle,
        description: category.description,
        href: `/collections/${promoSlug}`,
        image: category.image,
      },
    };
  }),
  {
    kind: "collection",
    label: "Deals",
    slug: "deals",
    href: "/collections/deals",
    links: [
      ["deals", "Deals"],
      ["digital-deals", "Digital Deals"],
      ["designer-picks", "Designer Picks"],
      ["best-sellers", "Best Sellers"],
      ["new-arrivals", "New Arrivals"],
      ["spring-refresh", "Spring Refresh"],
      ["cozy-furniture", "Cozy Furniture"],
    ].map(([slug, label]) => ({ label, href: `/collections/${slug}` })),
    styleLinks: [],
    colorLinks: [],
  },
  {
    kind: "style",
    label: "Style",
    slug: "style",
    href: "/style/modern",
    links: styleOrder.map((style) => ({ label: titleCase(style), href: `/style/${style}` })),
    styleLinks: [],
    colorLinks: [],
  },
  {
    kind: "service",
    label: "Financing",
    slug: "financing",
    href: "/pages/financing",
    links: [
      { label: "Explore financing", href: "/pages/financing" },
      { label: "Delivery options", href: "/pages/delivery" },
      { label: "Assembly services", href: "/pages/assembly" },
    ],
    styleLinks: [],
    colorLinks: [],
  },
];

const promoDefinitions = [
  ["deals", "Deals", "Thoughtful furniture at friendlier prices, with fresh savings across the pieces your home needs most.", "/images/photos/promos/deals.webp", () => products.filter((product) => product.badges.includes("sale"))],
  ["digital-deals", "Digital Deals", "An online-only edit of distinctive designs, selected for standout value and considered details.", "/images/photos/categories/home-office.webp", () => products.filter((product) => product.badges.includes("exclusive") && product.price <= 150000).slice(0, 8)],
  ["designer-picks", "Designer Picks", "Layered materials, balanced proportions, and timeless forms chosen for a carefully composed home.", "/images/photos/promos/designer-picks.webp", () => ["HO1001", "HO1004", "HO1009", "HO1012", "HO1021", "HO1031", "HO1043", "HO1052", "HO1056", "HO1060", "HO1063", "HO1067"]],
  ["best-sellers", "Best Sellers", "The pieces customers return to again and again, from everyday seating to restorative bedroom essentials.", "/images/photos/categories/living-room.webp", () => ["HO1001", "HO1002", "HO1009", "HO1017", "HO1028", "HO1033", "HO1040", "HO1042", "HO1048", "HO1056", "HO1064", "HO1066"]],
  ["new-arrivals", "New Arrivals", "New perspectives on familiar rooms, featuring fresh finishes, useful details, and welcoming silhouettes.", "/images/photos/promos/new-arrivals.webp", () => [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12)],
  ["spring-refresh", "Spring Refresh", "A lighter, brighter mix of breezy color and natural texture for rooms ready to welcome a new season.", "/images/photos/categories/outdoor.webp", () => products.filter((product) => product.styles.some((style) => ["coastal", "farmhouse"].includes(style)) || product.colors.some((color) => ["olive", "ivory", "sand"].includes(color))).slice(0, 12)],
  ["cozy-furniture", "Cozy Furniture", "Soft surfaces, warm neutrals, and inviting comfort for slower mornings and evenings spent at home.", "/images/photos/categories/rugs-decor.webp", () => products.filter((product) => ["living-room", "bedroom", "mattresses", "rugs-decor", "pet"].includes(product.categoryPath[0]) && product.colors.some((color) => ["oatmeal", "taupe", "ivory", "rust", "sand"].includes(color))).slice(0, 12)],
];

const promos = promoDefinitions.map(([slug, title, description, image, select]) => ({
  slug,
  title,
  description,
  image,
  productIds: [...new Set(select().map((product) => typeof product === "string" ? product : product.id))],
}));

const promoCodes = [
  { code: "WELCOME10", type: "percent", value: 10, minSubtotal: 0, label: "10% off" },
  { code: "SAVE100", type: "fixed", value: 10000, minSubtotal: 100000, label: "$100 off $1,000+" },
  { code: "FREESHIP", type: "ship", value: 0, minSubtotal: 0, label: "Free shipping" },
];

function validate() {
  assert.equal(products.length, 72, "Catalog must contain exactly 72 products");
  assert.equal(new Set(products.map((product) => product.id)).size, 72);
  assert.equal(new Set(products.map((product) => product.title)).size, 72);
  assert.equal(new Set(products.map((product) => product.slug)).size, 72);
  assert.equal(categories.length, 9);
  assert.equal(navigation.length, 12);
  assert.equal(promos.length, 7);
  assert.equal(products.filter((product) => product.badges.includes("sale")).length, 18);
  assert.equal(products.filter((product) => product.priceMax !== undefined).length, 3);
  assert.equal(products.filter((product) => !product.inStock).length, 2);
  assert.equal(products.filter((product) => product.variants).length, 37);
  const allowedBadges = new Set(["exclusive", "luxe", "sale", "new", "best-seller"]);
  const validIds = new Set(products.map((product) => product.id));
  for (const category of categories) {
    const count = products.filter((product) => product.categoryPath[0] === category.slug).length;
    assert.equal(count, 8, `${category.slug} must have 8 products`);
    assert(category.image.startsWith("/images/photos/categories/") && category.image.endsWith(".webp"));
    assert(existsSync(resolve(ROOT, "public", category.image.slice(1))), `${category.slug} references a missing category photo`);
  }
  for (const product of products) {
    assert(PHOTO_MAP.products[product.id]?.primary, `${product.id} needs a curated photo mapping`);
    assert.match(product.id, /^HO\d{4}$/);
    assert.match(product.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/i);
    assert(product.slug.endsWith(`-${product.id}`));
    assert.equal(product.brand, BRAND);
    assert(product.styles.every((style) => styleOrder.includes(style)), `${product.id} uses an unsupported style`);
    assert(primaryByChild.has(product.category));
    assert.equal(product.categoryPath[0], primaryByChild.get(product.category).slug);
    assert(Number.isInteger(product.price) && product.price >= 4900 && product.price <= 349999);
    assert(product.rating >= 0 && product.rating <= 5);
    assert(Number.isInteger(product.reviewCount) && product.reviewCount >= 0);
    assert.match(product.createdAt, /^\d{4}-\d{2}-\d{2}$/);
    const descriptionWords = product.description.trim().split(/\s+/).length;
    assert(descriptionWords >= 50 && descriptionWords <= 100, `${product.id} description length: ${descriptionWords} words`);
    assert(product.shortFeatures.length >= 1 && product.shortFeatures.length <= 3);
    assert(product.badges.every((badge) => allowedBadges.has(badge)));
    assert.equal(Boolean(product.originalPrice), product.badges.includes("sale"));
    assert(!product.originalPrice || product.originalPrice > product.price);
    assert(!product.priceMax || product.priceMax > product.price);
    assert(product.dimensions.unit === "in");
    assert(product.dimensions.width > 0 && product.dimensions.depth > 0 && product.dimensions.height > 0 && product.dimensions.weight > 0);
    assert(product.images.length >= 2 && product.images.length <= 3);
    assert(new Set(product.images.map((image) => image.src)).size === product.images.length);
    assert(product.images.every((image) => image.src.startsWith("/images/photos/products/") && image.src.endsWith(".webp") && image.alt.length > 10));
    assert(product.images.every((image) => existsSync(resolve(ROOT, "public", image.src.slice(1)))), `${product.id} references a missing photo`);
    if (product.priceMax) assert(product.variants?.length, `${product.id} price range needs variants`);
    if (product.variants) {
      assert(product.variants.length >= 2 && product.variants.length <= 4);
      assert.equal(new Set(product.variants.map((variant) => variant.id)).size, product.variants.length, `${product.id} has duplicate variant IDs`);
      assert.equal(product.variants[0].price, product.price);
      assert(product.variants.every((variant) => variant.inStock === product.inStock));
      const optionKeys = Object.keys(product.variants[0].options).sort();
      assert(product.variants.every((variant) => JSON.stringify(Object.keys(variant.options).sort()) === JSON.stringify(optionKeys)), `${product.id} has inconsistent variant options`);
      const combinations = optionKeys.reduce((rows, key) => rows.flatMap((row) => (
        [...new Set(product.variants.map((variant) => variant.options[key]))].map((value) => ({ ...row, [key]: value }))
      )), [{}]);
      assert(combinations.every((combination) => product.variants.some((variant) => (
        Object.entries(combination).every(([key, value]) => variant.options[key] === value)
      ))), `${product.id} has incomplete variant combinations`);
      if (product.priceMax) assert.equal(product.variants.at(-1).price, product.priceMax);
    }
  }
  for (const promo of promos) {
    assert(promo.productIds.length > 0, `${promo.slug} must not be empty`);
    assert(promo.productIds.every((id) => validIds.has(id)), `${promo.slug} contains unknown products: ${promo.productIds.filter((id) => !validIds.has(id)).join(", ")}`);
    assert(promo.image.startsWith("/images/photos/") && existsSync(resolve(ROOT, "public", promo.image.slice(1))), `${promo.slug} references a missing promo photo`);
  }
  assert.deepEqual(promoCodes.map((promo) => promo.code), ["WELCOME10", "SAVE100", "FREESHIP"]);
}

function writeJson(name, value) {
  mkdirSync(DATA, { recursive: true });
  writeFileSync(resolve(DATA, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

validate();
writeJson("products.json", products);
writeJson("categories.json", categories);
writeJson("navigation.json", navigation);
writeJson("promos.json", promos);
writeJson("promoCodes.json", promoCodes);
console.log(`Generated ${products.length} products, ${categories.length} categories, ${navigation.length} navigation groups, ${promos.length} collections, and ${promoCodes.length} promo codes.`);
console.log(`Catalog checks: 18 sale, 3 price ranges, 2 sold out, 37 with variants.`);
