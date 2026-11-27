#!/usr/bin/env node
/**
 * Process the curated, licensed photo candidates into the storefront image set.
 * Run after scripts/source-photos.mjs. All final assets are self-hosted WebP/JPEG.
 */
import assert from "node:assert/strict";
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CACHE = resolve(ROOT, "scripts/.photo-cache");
const PHOTOS = resolve(ROOT, "public/images/photos");
const candidates = JSON.parse(readFileSync(resolve(CACHE, "candidates.json"), "utf8"));
const photoMap = JSON.parse(readFileSync(resolve(ROOT, "scripts/photo-map.json"), "utf8"));
const products = JSON.parse(readFileSync(resolve(ROOT, "src/data/products.json"), "utf8"));

const pexels = {
  4445456: { id: "4445456", slug: "a-dog-lying-on-its-bed", source: "https://www.pexels.com/photo/a-dog-lying-on-its-bed-4445456/", file: resolve(CACHE, "pexels-4445456.jpg") },
  19176926: { id: "19176926", slug: "red-dog-sleeping-curled-up-in-a-fuzzy-pet-bed", source: "https://www.pexels.com/photo/red-dog-sleeping-curled-up-in-a-fuzzy-pet-bed-19176926/", file: resolve(CACHE, "pexels-19176926.jpg") },
  16707721: { id: "16707721", slug: "dog-lying-in-a-bed", source: "https://www.pexels.com/photo/dog-lying-in-a-bed-16707721/", file: resolve(CACHE, "pexels-16707721.jpg") },
  39690999: { id: "39690999", slug: "irish-setter-dogs-relaxing-outdoors-on-a-mat", source: "https://www.pexels.com/photo/irish-setter-dogs-relaxing-outdoors-on-a-mat-39690999/", file: resolve(CACHE, "pexels-39690999.jpg") },
  38937747: { id: "38937747", slug: "colorful-adirondack-chairs-in-a-lush-garden", source: "https://www.pexels.com/photo/colorful-adirondack-chairs-in-a-lush-garden-38937747/", file: resolve(CACHE, "pexels-38937747.jpg") },
  31918564: { id: "31918564", slug: "cozy-outdoor-patio-in-washington-dc-suburban-home", source: "https://www.pexels.com/photo/cozy-outdoor-patio-in-washington-dc-suburban-home-31918564/", file: resolve(CACHE, "pexels-31918564.jpg") },
};

const usage = new Map();
const normalizedCache = new Map();

function resolveSource(reference) {
  if (reference.startsWith("pexels:")) {
    const id = reference.slice("pexels:".length);
    const photo = pexels[id];
    assert(photo, `Missing Pexels source ${id}`);
    return { key: reference, provider: "Pexels", ...photo, license: "https://www.pexels.com/license/" };
  }
  const [group, indexText] = reference.split(":");
  const index = Number(indexText) - 1;
  const photo = candidates[group]?.candidates[index];
  assert(photo, `Missing photo source ${reference}`);
  return { key: reference, provider: "Unsplash", ...photo, license: "https://unsplash.com/license" };
}

async function normalized(photo) {
  if (!normalizedCache.has(photo.key)) {
    normalizedCache.set(photo.key, sharp(photo.file).rotate().toBuffer());
  }
  return normalizedCache.get(photo.key);
}

async function encode(input, output, width, height, maxBytes, format = "webp", zoom = 1) {
  const target = resolve(PHOTOS, output);
  mkdirSync(dirname(target), { recursive: true });
  let pipeline = sharp(input);
  if (zoom > 1) {
    const metadata = await sharp(input).metadata();
    const cropWidth = Math.round(metadata.width / zoom);
    const cropHeight = Math.round(metadata.height / zoom);
    const left = Math.round((metadata.width - cropWidth) / 2);
    const top = Math.round((metadata.height - cropHeight) / 2);
    pipeline = pipeline.extract({ left, top, width: cropWidth, height: cropHeight });
  }
  const render = (quality) => pipeline
    .clone()
    .resize(width, height, { fit: "cover", position: "attention" })
    .toFormat(format, format === "jpeg" ? { quality, mozjpeg: true } : { quality, effort: 5 })
    .toBuffer({ resolveWithObject: true });

  let result = await render(76);
  if (result.info.size > maxBytes) result = await render(64);
  if (result.info.size > maxBytes) result = await render(56);
  writeFileSync(target, result.data);
  if (result.info.size > maxBytes) console.warn(`${output} is ${result.info.size} bytes (target ${maxBytes})`);
  return `/images/photos/${output}`;
}

async function renderPhoto(reference, output, width, height, maxBytes, format = "webp", zoom = 1) {
  const photo = resolveSource(reference);
  const input = await normalized(photo);
  const path = await encode(input, output, width, height, maxBytes, format, zoom);
  if (!usage.has(photo.key)) usage.set(photo.key, { photo, files: [] });
  usage.get(photo.key).files.push(path);
  return path;
}

assert.equal(Object.keys(photoMap.products).length, products.length, "Every product needs a photo mapping");
assert.equal(new Set(Object.values(photoMap.products).map((entry) => entry.primary)).size, products.length, "Product primary photos should be unique");

for (const product of products) {
  const entry = photoMap.products[product.id];
  assert(entry?.primary, `Missing primary photo for ${product.id}`);
  await renderPhoto(entry.primary, `products/${product.id}-1.webp`, 1200, 900, 125000);
  await renderPhoto(entry.primary, `products/${product.id}-2.webp`, 1200, 900, 125000, "webp", 1.55);
  if (product.images.length === 3) {
    const context = photoMap.contexts[product.categoryPath[0]];
    assert(context, `Missing room context for ${product.categoryPath[0]}`);
    await renderPhoto(context, `products/${product.id}-3.webp`, 1200, 900, 125000);
  }
}

for (const [key, asset] of Object.entries(photoMap.assets)) {
  const maxBytes = key.startsWith("hero-") ? 260000 : key.startsWith("category-") ? 90000 : 180000;
  await renderPhoto(asset.source, asset.output, asset.width, asset.height, maxBytes, asset.format ?? "webp");
}

const credits = [...usage.values()]
  .map(({ photo, files }) => ({
    provider: photo.provider,
    title: photo.slug.replaceAll("-", " "),
    source: photo.source,
    license: photo.license,
    files: [...new Set(files)].sort(),
  }))
  .sort((a, b) => a.provider.localeCompare(b.provider) || a.source.localeCompare(b.source));

writeFileSync(resolve(PHOTOS, "credits.json"), `${JSON.stringify({
  note: "Licensed stock photography downloaded and self-hosted for this non-functional portfolio demo. Haven & Oak names, product copy, and branding are original to this project.",
  sources: credits,
}, null, 2)}\n`, "utf8");

console.log(`Processed ${products.length} product galleries, ${Object.keys(photoMap.assets).length} campaign assets, and ${credits.length} credited sources.`);
