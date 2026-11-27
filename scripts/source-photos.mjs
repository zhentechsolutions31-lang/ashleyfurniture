#!/usr/bin/env node
/**
 * Download licensed Unsplash candidates for the Haven & Oak photo library.
 * Search pages are read-only; final selected images are processed and self-hosted
 * by scripts/process-photos.mjs. No retailer imagery is used.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CACHE = resolve(ROOT, "scripts/.photo-cache");
const OUTPUT = resolve(CACHE, "candidates.json");

const searches = [
  ["sofas", "beige sofa furniture", 10],
  ["sectionals", "sectional sofa interior", 8],
  ["recliners", "recliner chair living room", 8],
  ["accent-chairs", "accent chair interior", 6],
  ["ottomans", "ottoman furniture interior", 6],
  ["beds", "platform bed bedroom", 10],
  ["dressers", "dresser furniture bedroom", 8],
  ["nightstands", "nightstand bedroom", 8],
  ["dining-tables", "wooden dining table interior", 10],
  ["dining-chairs", "dining chair interior", 8],
  ["dining-sets", "dining table chairs room", 8],
  ["desks", "writing desk home office", 10],
  ["office-chairs", "office chair workspace", 10],
  ["outdoor-seating", "outdoor sofa patio", 8],
  ["outdoor-dining", "outdoor dining table chairs", 8],
  ["mattresses", "mattress bedroom", 10],
  ["rugs", "area rug living room", 8],
  ["wall-art", "framed wall art interior", 8],
  ["bookcases", "bookcase living room", 6],
  ["storage", "storage cabinet furniture interior", 10],
  ["pet-beds", "dog bed interior", 8],
  ["pet-mats", "pet mat floor", 6],
  ["rooms-living", "warm modern living room interior", 10],
  ["rooms-bedroom", "neutral bedroom interior", 10],
  ["rooms-dining", "dining room interior", 10],
  ["rooms-office", "home office interior", 8],
  ["rooms-outdoor", "outdoor patio furniture", 10],
  ["rooms-decor", "rug wall art living room", 8],
  ["rooms-storage", "bookcase storage living room", 8],
  ["rooms-pet", "dog bed living room", 8],
];

const cacheById = new Map();
const failedFile = resolve(CACHE, "failed.json");
const failedIds = new Set(existsSync(failedFile) ? JSON.parse(readFileSync(failedFile, "utf8")) : []);
const results = {};

async function fetchText(url) {
  return execFileSync("curl", ["-L", "--fail", "--silent", "--show-error", url], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

function parseSearch(html) {
  const found = new Map();
  const normalized = html.replaceAll('\\"', '"');
  const pattern = /"id":"([A-Za-z0-9_-]{11})","alternative_slugs":\{"en":"([^"]+)"/g;
  for (const match of normalized.matchAll(pattern)) {
    const [, id, slug] = match;
    if (!found.has(id)) found.set(id, { id, slug, source: `https://unsplash.com/photos/${slug}-${id}` });
  }
  return [...found.values()];
}

async function downloadPhoto(photo) {
  if (cacheById.has(photo.id)) return cacheById.get(photo.id);
  if (failedIds.has(photo.id)) throw new Error("Previously unavailable");
  const file = resolve(CACHE, `${photo.id}.jpg`);
  if (!existsSync(file) || statSync(file).size < 1000) {
    execFileSync("curl", [
      "-L", "--fail", "--silent", "--show-error",
      "--output", file,
      `https://unsplash.com/photos/${photo.id}/download?force=true&w=1600`,
    ]);
  }
  if (statSync(file).size < 1000) throw new Error(`Empty download for ${photo.id}`);
  const record = { ...photo, file };
  cacheById.set(photo.id, record);
  return record;
}

mkdirSync(CACHE, { recursive: true });

for (const [key, query, count] of searches) {
  const queryPath = encodeURIComponent(query).replaceAll("%20", "-");
  const html = await fetchText(`https://unsplash.com/s/photos/${queryPath}`);
  const photos = parseSearch(html).slice(0, count);
  if (photos.length < 1) throw new Error(`No candidates for ${query}`);
  results[key] = { query, candidates: [] };
  for (const photo of photos) {
    try {
      const downloaded = await downloadPhoto(photo);
      results[key].candidates.push(downloaded);
      console.log(`${key}: ${photo.id} ${photo.slug}`);
    } catch (error) {
      failedIds.add(photo.id);
      writeFileSync(failedFile, `${JSON.stringify([...failedIds], null, 2)}\n`, "utf8");
      console.warn(`Skipped ${photo.id}: ${error.message}`);
    }
  }
}

writeFileSync(OUTPUT, `${JSON.stringify(results, null, 2)}\n`, "utf8");
console.log(`Saved ${Object.values(results).reduce((total, group) => total + group.candidates.length, 0)} candidates to ${OUTPUT}`);
