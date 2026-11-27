#!/usr/bin/env node
/**
 * Self-contained, original SVG placeholder artwork for Haven & Oak.
 * Reads the generated static JSON and writes only under public/images.
 */
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = resolve(ROOT, "public/images");
const products = JSON.parse(readFileSync(resolve(ROOT, "src/data/products.json"), "utf8"));
const categories = JSON.parse(readFileSync(resolve(ROOT, "src/data/categories.json"), "utf8"));

const palette = {
  oatmeal: "#d8c6aa",
  gray: "#8f9290",
  ivory: "#eee6d6",
  taupe: "#a99987",
  brown: "#775744",
  blue: "#718896",
  tan: "#bd946d",
  olive: "#7d8465",
  cream: "#eee0c7",
  rust: "#a9674f",
  natural: "#c29a6b",
  walnut: "#76513d",
  oak: "#bd9364",
  white: "#f4f1e9",
  black: "#3f4341",
  sand: "#cdb593",
  green: "#71816a",
};

const categoryArtwork = {
  "living-room": ["sofas"],
  bedroom: ["beds"],
  "dining-room": ["dining-sets"],
  "home-office": ["desks", "office-chairs"],
  outdoor: ["outdoor-seating"],
  mattresses: ["mattresses"],
  "rugs-decor": ["wall-art", "rugs"],
  storage: ["bookcases"],
  pet: ["pet-beds"],
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
}

function mix(first, second, amount) {
  const a = rgb(first);
  const b = rgb(second);
  return `#${a.map((channel, index) => Math.round(channel + (b[index] - channel) * amount).toString(16).padStart(2, "0")).join("")}`;
}

function color(value) {
  return palette[value] ?? "#b7a58e";
}

function wrapTitle(title, maxCharacters = 43) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (`${line} ${word}`.trim().length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function definitions(colors, variant = 1) {
  const main = color(colors[0]);
  const accent = color(colors[1] ?? colors[0]);
  const wood = colors.includes("walnut") ? color("walnut") : colors.includes("oak") ? color("oak") : color("natural");
  const wallTop = variant % 2 ? "#f7f1e7" : "#f2ece3";
  return `
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${wallTop}"/><stop offset="1" stop-color="#dfd0bb"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d8c1a3"/><stop offset="1" stop-color="#b99773"/>
    </linearGradient>
    <linearGradient id="fabric" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="${mix(main, "#ffffff", 0.22)}"/><stop offset="0.55" stop-color="${main}"/><stop offset="1" stop-color="${mix(main, "#594536", 0.18)}"/>
    </linearGradient>
    <linearGradient id="fabric-alt" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${mix(accent, "#ffffff", 0.25)}"/><stop offset="1" stop-color="${mix(accent, "#594536", 0.16)}"/>
    </linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="${mix(wood, "#ffffff", 0.2)}"/><stop offset="0.5" stop-color="${wood}"/><stop offset="1" stop-color="${mix(wood, "#3e2c22", 0.22)}"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dbe9e5"/><stop offset="1" stop-color="#b8cfc7"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6f7470"/><stop offset="0.45" stop-color="#343a37"/><stop offset="1" stop-color="#777c76"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-40%" width="160%" height="200%">
      <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#4c392a" flood-opacity="0.2"/>
    </filter>
    <filter id="soft" x="-40%" y="-80%" width="180%" height="260%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>`;
}

function svgDocument(width, height, title, body, defs = definitions(["oatmeal", "gray"])) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="art-title">
  <title id="art-title">${escapeXml(title)}</title>
  <defs>${defs}</defs>
${body}
</svg>
`;
}

function plant(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="8" rx="58" ry="13" fill="#5c4937" opacity=".14"/>
    <path d="M-38-78H38L28 4H-28Z" fill="#b47858"/>
    <path d="M-31-67H31" stroke="#d59a75" stroke-width="5" opacity=".55"/>
    <g fill="none" stroke="#68765a" stroke-width="5" stroke-linecap="round">
      <path d="M0-78Q-8-158-48-208"/><path d="M2-78Q22-156 50-210"/><path d="M0-78Q-3-183 4-235"/>
    </g>
    <g fill="#7c8a69">
      <ellipse cx="-43" cy="-188" rx="18" ry="38" transform="rotate(-38 -43 -188)"/>
      <ellipse cx="-25" cy="-151" rx="16" ry="34" transform="rotate(-52 -25 -151)"/>
      <ellipse cx="46" cy="-191" rx="18" ry="39" transform="rotate(37 46 -191)"/>
      <ellipse cx="28" cy="-145" rx="15" ry="32" transform="rotate(48 28 -145)"/>
      <ellipse cx="5" cy="-216" rx="16" ry="37" transform="rotate(5 5 -216)"/>
    </g>
    <g fill="#95a181" opacity=".9">
      <ellipse cx="-56" cy="-217" rx="13" ry="28" transform="rotate(-43 -56 -217)"/>
      <ellipse cx="61" cy="-225" rx="13" ry="29" transform="rotate(42 61 -225)"/>
    </g>
  </g>`;
}

function floorLamp(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="0" rx="50" ry="12" fill="#5e4b39" opacity=".15"/>
    <path d="M0-230V0" stroke="#6b5b49" stroke-width="8"/>
    <path d="M-55-335H55L76-230H-76Z" fill="#ead9ba" stroke="#c8ac83" stroke-width="4"/>
    <path d="M-45-325H45" stroke="#f8efdf" stroke-width="5" opacity=".8"/>
  </g>`;
}

function coffeeTable(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="30" rx="155" ry="25" fill="#5c4937" opacity=".12"/>
    <path d="M-105-95L98-95Q126-95 145-70L105 25H-108L-143-68Q-130-92-105-95Z" fill="url(#wood)"/>
    <path d="M-92 16L-78 82M91 16L77 82" stroke="#76553d" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="18" cy="-99" rx="45" ry="13" fill="#d6c2a2"/>
    <path d="M-21-116H56L49-91H-14Z" fill="#eee5d4"/>
    <path d="M28-117Q45-145 63-117" fill="none" stroke="#eee5d4" stroke-width="8"/>
  </g>`;
}

function backdrop(width, height, variant = 1, floorRatio = 0.67) {
  const floor = Math.round(height * floorRatio);
  const windowX = variant % 2 ? width * 0.7 : width * 0.08;
  const windowWidth = Math.min(width * 0.2, 280);
  const windowHeight = height * 0.43;
  const artX = variant % 2 ? width * 0.12 : width * 0.82;
  return `
  <rect width="${width}" height="${height}" fill="url(#wall)"/>
  <path d="M${width * 0.54} 0H${width}V${height * 0.66}L${width * 0.76} ${height * 0.22}Z" fill="#fff8e8" opacity=".22"/>
  <path d="M0 ${floor}H${width}V${height}H0Z" fill="url(#floor)"/>
  <path d="M0 ${floor}H${width}" stroke="#c4aa87" stroke-width="5" opacity=".7"/>
  <g opacity=".8">
    <rect x="${windowX}" y="${height * 0.07}" width="${windowWidth}" height="${windowHeight}" rx="${windowWidth / 2}" fill="url(#glass)" stroke="#f7f0e4" stroke-width="12"/>
    <path d="M${windowX + windowWidth / 2} ${height * 0.08}V${height * 0.5}M${windowX + 4} ${height * 0.31}H${windowX + windowWidth - 4}" stroke="#f7f0e4" stroke-width="8"/>
    <path d="M${windowX + 8} ${height * 0.45}Q${windowX + windowWidth * 0.35} ${height * 0.32} ${windowX + windowWidth * 0.62} ${height * 0.45}T${windowX + windowWidth - 4} ${height * 0.43}V${height * 0.49}H${windowX + 4}Z" fill="#a7b8a0" opacity=".6"/>
  </g>
  <g transform="translate(${artX} ${height * 0.18})" opacity=".75">
    <rect x="0" y="0" width="${Math.max(70, width * 0.085)}" height="${Math.max(95, height * 0.14)}" rx="3" fill="#a8835e"/>
    <rect x="8" y="8" width="${Math.max(54, width * 0.085 - 16)}" height="${Math.max(79, height * 0.14 - 16)}" fill="#f2e8d7"/>
    <path d="M18 ${Math.max(70, height * 0.11)}Q${Math.max(38, width * 0.04)} ${Math.max(25, height * 0.04)} ${Math.max(60, width * 0.07)} ${Math.max(60, height * 0.09)}" fill="none" stroke="#9a8267" stroke-width="5"/>
  </g>
  <ellipse cx="${width * 0.5}" cy="${floor + height * 0.14}" rx="${width * 0.36}" ry="${height * 0.055}" fill="#6c5139" opacity=".12" filter="url(#soft)"/>`;
}

function sofa(view = 1) {
  const alternate = view === 2;
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="700" rx="375" ry="31" fill="#624b38" opacity=".14"/>
    <path d="M300 626V690M900 626V690" stroke="#6f5039" stroke-width="22" stroke-linecap="round"/>
    <g transform="${alternate ? "translate(-8 5) skewY(-1)" : ""}">
      <rect x="270" y="292" width="660" height="302" rx="72" fill="url(#fabric)" stroke="#786b5c" stroke-opacity=".25" stroke-width="3"/>
      <path d="M315 350Q600 315 885 350" fill="none" stroke="#ffffff" stroke-opacity=".25" stroke-width="4"/>
      <rect x="220" y="425" width="112" height="229" rx="50" fill="url(#fabric-alt)"/>
      <rect x="868" y="425" width="112" height="229" rx="50" fill="url(#fabric)"/>
      <rect x="300" y="495" width="600" height="145" rx="35" fill="url(#fabric-alt)"/>
      <path d="M500 510V625M700 510V625" stroke="#6e6457" stroke-opacity=".25" stroke-width="3"/>
      <rect x="345" y="405" width="205" height="120" rx="28" fill="url(#fabric)" transform="rotate(-5 447 465)"/>
      <rect x="650" y="405" width="205" height="120" rx="28" fill="url(#fabric-alt)" transform="rotate(5 752 465)"/>
      <path d="M378 420L518 438M685 437L822 419" stroke="#fff" stroke-opacity=".16" stroke-width="3"/>
    </g>
  </g>`;
}

function sectional(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="712" rx="435" ry="34" fill="#624b38" opacity=".14"/>
    <path d="M290 630V696M885 630V696M220 652V696" stroke="#6f5039" stroke-width="20" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(12 -2) skewY(0.8)" : ""}">
      <rect x="310" y="280" width="650" height="310" rx="60" fill="url(#fabric)"/>
      <rect x="205" y="485" width="235" height="180" rx="42" fill="url(#fabric-alt)"/>
      <rect x="270" y="412" width="105" height="240" rx="45" fill="url(#fabric-alt)"/>
      <rect x="880" y="412" width="105" height="240" rx="45" fill="url(#fabric)"/>
      <rect x="360" y="495" width="545" height="150" rx="32" fill="url(#fabric-alt)"/>
      <path d="M545 510V635M725 510V635" stroke="#6e6457" stroke-opacity=".28" stroke-width="3"/>
      <rect x="405" y="390" width="170" height="118" rx="25" fill="url(#fabric)" transform="rotate(-4 490 450)"/>
      <rect x="720" y="390" width="170" height="118" rx="25" fill="url(#fabric-alt)" transform="rotate(4 805 450)"/>
    </g>
  </g>`;
}

function recliner(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="713" rx="238" ry="28" fill="#624b38" opacity=".14"/>
    <path d="M440 620V695M760 620V695" stroke="#5e4937" stroke-width="20" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(-35 18) rotate(-5 600 500)" : ""}">
      <rect x="390" y="250" width="420" height="350" rx="82" fill="url(#fabric)"/>
      <path d="M450 300Q600 265 750 300" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="4"/>
      <rect x="345" y="440" width="95" height="208" rx="40" fill="url(#fabric-alt)"/>
      <rect x="760" y="440" width="95" height="208" rx="40" fill="url(#fabric-alt)"/>
      <rect x="415" y="520" width="370" height="130" rx="35" fill="url(#fabric-alt)"/>
      <rect x="430" y="638" width="340" height="66" rx="22" fill="url(#fabric)"/>
      <path d="M445 659H755" stroke="#6e6457" stroke-opacity=".25" stroke-width="3"/>
      <circle cx="765" cy="528" r="13" fill="#4e514c"/><circle cx="765" cy="528" r="5" fill="#c9c4b8"/>
    </g>
  </g>`;
}

function accentChair(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="703" rx="230" ry="26" fill="#624b38" opacity=".14"/>
    <path d="M420 598L395 694M780 598L805 694" stroke="url(#wood)" stroke-width="24" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(18 0) skewY(-2)" : ""}">
      <path d="M365 445Q365 275 600 265Q835 275 835 445V555H365Z" fill="url(#fabric)" stroke="#7b6c5b" stroke-opacity=".3" stroke-width="3"/>
      <path d="M390 480Q390 330 600 320Q810 330 810 480" fill="none" stroke="#fff" stroke-opacity=".19" stroke-width="4"/>
      <rect x="365" y="475" width="470" height="145" rx="58" fill="url(#fabric-alt)"/>
      <path d="M340 500Q330 425 390 420M860 500Q870 425 810 420" fill="none" stroke="url(#fabric)" stroke-width="48" stroke-linecap="round"/>
      <path d="M600 496V605" stroke="#776957" stroke-opacity=".22" stroke-width="3"/>
    </g>
  </g>`;
}

function ottoman(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="692" rx="280" ry="30" fill="#624b38" opacity=".14"/>
    <path d="M365 620V684M835 620V684" stroke="#6f5039" stroke-width="20" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(0 14) skewY(-2)" : ""}">
      <rect x="315" y="475" width="570" height="190" rx="55" fill="url(#wood)"/>
      <rect x="285" y="425" width="630" height="125" rx="55" fill="url(#fabric)"/>
      <path d="M330 463Q600 425 870 463" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="4"/>
      <path d="M600 447V539" stroke="#716351" stroke-opacity=".25" stroke-width="3"/>
      <rect x="555" y="515" width="90" height="16" rx="8" fill="#b49a77"/>
    </g>
  </g>`;
}

function bed(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="711" rx="420" ry="32" fill="#624b38" opacity=".14"/>
    <path d="M285 620V695M915 620V695" stroke="#6d4f39" stroke-width="24" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(12 12) skewY(-1.5)" : ""}">
      <rect x="275" y="225" width="650" height="365" rx="42" fill="url(#wood)"/>
      <rect x="315" y="260" width="570" height="245" rx="28" fill="url(#fabric)"/>
      <path d="M360 300H840M360 355H840M360 410H840" stroke="#fff" stroke-opacity=".15" stroke-width="4"/>
      <rect x="250" y="525" width="700" height="155" rx="28" fill="url(#wood)"/>
      <rect x="225" y="455" width="750" height="170" rx="42" fill="#f4efe5" stroke="#d8cdbb" stroke-width="3"/>
      <path d="M265 495Q600 465 915 495" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/>
      <rect x="300" y="408" width="250" height="118" rx="35" fill="url(#fabric-alt)" transform="rotate(-3 425 467)"/>
      <rect x="650" y="408" width="250" height="118" rx="35" fill="url(#fabric)" transform="rotate(3 775 467)"/>
    </g>
  </g>`;
}

function dresser(view = 1, drawers = 6) {
  const rows = drawers >= 9 ? 3 : 2;
  const columns = drawers >= 9 ? 3 : 3;
  const rowHeight = rows === 3 ? 88 : 125;
  let fronts = "";
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = 310 + column * 200;
      const y = 305 + row * rowHeight;
      fronts += `<rect x="${x}" y="${y}" width="184" height="${rowHeight - 14}" rx="8" fill="${row % 2 ? "url(#fabric-alt)" : "url(#wood)"}" stroke="#70573f" stroke-opacity=".28" stroke-width="2"/><rect x="${x + 70}" y="${y + rowHeight / 2}" width="44" height="9" rx="4.5" fill="#6e5a45"/>`;
    }
  }
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="702" rx="350" ry="28" fill="#624b38" opacity=".14"/>
    <path d="M325 650V694M875 650V694" stroke="#6f5039" stroke-width="20" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(8 2) skewY(-1)" : ""}">
      <rect x="285" y="275" width="630" height="385" rx="12" fill="url(#wood)"/>
      <rect x="265" y="255" width="670" height="35" rx="12" fill="url(#wood)"/>
      ${fronts}
      <path d="M305 288H895" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>
    </g>
  </g>`;
}

function nightstand(view = 1, drawers = 2) {
  let fronts = "";
  for (let index = 0; index < drawers; index += 1) {
    const y = 410 + index * 75;
    fronts += `<rect x="405" y="${y}" width="390" height="64" rx="8" fill="url(#wood)" stroke="#70573f" stroke-opacity=".3" stroke-width="2"/><circle cx="600" cy="${y + 30}" r="8" fill="#6e5a45"/>`;
  }
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="697" rx="260" ry="25" fill="#624b38" opacity=".14"/>
    <path d="M415 630V690M785 630V690" stroke="#6f5039" stroke-width="20" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(12 6) skewY(-2)" : ""}">
      <rect x="380" y="375" width="440" height="275" rx="12" fill="url(#wood)"/>
      <rect x="360" y="355" width="480" height="30" rx="10" fill="url(#wood)"/>
      ${fronts}
      <path d="M425 385H775" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>
    </g>
  </g>`;
}

function diningTable(view = 1, round = false) {
  const top = round
    ? `<ellipse cx="600" cy="440" rx="410" ry="110" fill="url(#wood)"/><path d="M600 450V675" stroke="url(#wood)" stroke-width="55"/><ellipse cx="600" cy="680" rx="180" ry="28" fill="url(#wood)"/>`
    : `<path d="M205 405H995L1070 485H130Z" fill="url(#wood)" stroke="#74553d" stroke-width="3"/><path d="M600 420V475" stroke="#70523b" stroke-opacity=".45" stroke-width="3"/><path d="M245 480L220 685M955 480L980 685" stroke="url(#wood)" stroke-width="38" stroke-linecap="round"/>`;
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="702" rx="440" ry="30" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(0 14) skewY(-2)" : ""}">${top}</g>
  </g>`;
}

function diningChair(view = 1) {
  const spindles = [455, 515, 575, 635, 695, 755].map((x) => `<path d="M${x} 325V505" stroke="url(#wood)" stroke-width="15" stroke-linecap="round"/>`).join("");
  return `<g filter="url(#shadow)">
    <ellipse cx="605" cy="710" rx="225" ry="25" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(18 0) skewY(-2)" : ""}">
      <path d="M405 320Q605 275 805 320L775 405H435Z" fill="url(#wood)"/>
      ${spindles}
      <path d="M400 505H810L780 570H430Z" fill="url(#fabric-alt)" stroke="#7a6753" stroke-width="3"/>
      <path d="M440 560L415 695M770 560L795 695" stroke="url(#wood)" stroke-width="24" stroke-linecap="round"/>
      <path d="M455 610H755" stroke="url(#wood)" stroke-width="18"/>
    </g>
  </g>`;
}

function diningSet(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="710" rx="450" ry="32" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(0 10) skewY(-1.5)" : ""}">
      <g opacity=".9" transform="translate(0 -25) scale(.78) translate(153 128)">${diningChair(1)}</g>
      <g opacity=".9" transform="translate(0 -25) scale(.78) translate(447 128)">${diningChair(1)}</g>
      <path d="M220 445H980L1040 525H160Z" fill="url(#wood)"/>
      <path d="M275 525L250 690M925 525L950 690" stroke="url(#wood)" stroke-width="35" stroke-linecap="round"/>
      <g transform="translate(0 155) scale(.82) translate(108 -88)">${diningChair(1)}</g>
      <g transform="translate(0 155) scale(.82) translate(492 -88)">${diningChair(1)}</g>
    </g>
  </g>`;
}

function desk(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="710" rx="370" ry="28" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(10 6) skewY(-1)" : ""}">
      <path d="M190 420H1010L1060 495H140Z" fill="url(#wood)" stroke="#73543c" stroke-width="3"/>
      <rect x="745" y="485" width="205" height="160" rx="8" fill="url(#wood)"/>
      <path d="M850 500V635M765 565H930" stroke="#6e513a" stroke-opacity=".45" stroke-width="3"/>
      <circle cx="850" cy="535" r="6" fill="#665440"/><circle cx="850" cy="600" r="6" fill="#665440"/>
      <path d="M220 495V695M980 495V695" stroke="url(#wood)" stroke-width="34" stroke-linecap="round"/>
      <rect x="450" y="438" width="125" height="14" rx="7" fill="#594b3d"/>
      <path d="M350 415V365H560V415" fill="none" stroke="#4d5552" stroke-width="13"/>
      <rect x="365" y="338" width="180" height="112" rx="10" fill="#59615e" stroke="#343b38" stroke-width="5"/>
      <rect x="382" y="355" width="146" height="78" rx="4" fill="#b8c9c2"/>
    </g>
  </g>`;
}

function officeChair(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="724" rx="265" ry="26" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(20 0) skewY(-2)" : ""}">
      <path d="M420 260Q600 225 780 260L745 520H455Z" fill="url(#fabric)" stroke="#4f5853" stroke-width="8"/>
      <path d="M465 305H735M450 365H750M445 425H755" stroke="#e9eee8" stroke-opacity=".25" stroke-width="4"/>
      <rect x="405" y="495" width="390" height="120" rx="45" fill="url(#fabric-alt)"/>
      <path d="M360 465V555M840 465V555" stroke="url(#metal)" stroke-width="24" stroke-linecap="round"/>
      <path d="M600 605V675" stroke="url(#metal)" stroke-width="32"/>
      <g stroke="url(#metal)" stroke-width="18" stroke-linecap="round">
        <path d="M600 665L395 705M600 665L805 705M600 665L505 720M600 665L695 720M600 665V725"/>
      </g>
      <g fill="#353b38"><circle cx="395" cy="708" r="17"/><circle cx="805" cy="708" r="17"/><circle cx="505" cy="724" r="17"/><circle cx="695" cy="724" r="17"/><circle cx="600" cy="728" r="17"/></g>
    </g>
  </g>`;
}

function outdoorSeating(view = 1) {
  const slats = [365, 425, 485, 545, 605, 665, 725, 785].map((x) => `<path d="M${x} 330V455" stroke="#8e6747" stroke-width="8" opacity=".65"/>`).join("");
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="710" rx="390" ry="30" fill="#624b38" opacity=".14"/>
    <path d="M295 625V695M905 625V695" stroke="#8e6747" stroke-width="24" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(10 4) skewY(-1)" : ""}">
      <rect x="275" y="285" width="650" height="285" rx="24" fill="url(#wood)"/>
      ${slats}
      <rect x="235" y="425" width="100" height="225" rx="30" fill="url(#wood)"/>
      <rect x="865" y="425" width="100" height="225" rx="30" fill="url(#wood)"/>
      <rect x="315" y="490" width="570" height="145" rx="28" fill="url(#fabric-alt)"/>
      <path d="M500 505V625M700 505V625" stroke="#77634e" stroke-opacity=".25" stroke-width="3"/>
      <rect x="370" y="400" width="175" height="105" rx="24" fill="url(#fabric)" transform="rotate(-4 457 452)"/>
      <rect x="655" y="400" width="175" height="105" rx="24" fill="url(#fabric)" transform="rotate(4 742 452)"/>
    </g>
  </g>`;
}

function outdoorDining(view = 1) {
  const slats = Array.from({ length: 9 }, (_, index) => `<rect x="${235 + index * 83}" y="425" width="68" height="13" rx="4" fill="#9b704b" opacity=".7"/>`).join("");
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="720" rx="430" ry="30" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(0 8) skewY(-1.5)" : ""}">
      <g opacity=".8" transform="translate(0 -30) scale(.7) translate(180 190)">${diningChair(1)}</g>
      <g opacity=".8" transform="translate(0 -30) scale(.7) translate(420 190)">${diningChair(1)}</g>
      <path d="M205 420H995L1060 500H140Z" fill="url(#wood)"/>
      ${slats}
      <path d="M245 500L220 695M955 500L980 695" stroke="#59615b" stroke-width="30" stroke-linecap="round"/>
      <path d="M285 550H915M275 620H925" stroke="#59615b" stroke-width="16"/>
      <g transform="translate(0 180) scale(.78) translate(132 -135)">${diningChair(1)}</g>
      <g transform="translate(0 180) scale(.78) translate(468 -135)">${diningChair(1)}</g>
    </g>
  </g>`;
}

function mattress(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="704" rx="410" ry="30" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(0 25) skewY(-2)" : ""}">
      <rect x="225" y="570" width="750" height="95" rx="28" fill="#a99a85"/>
      <rect x="215" y="405" width="770" height="210" rx="48" fill="url(#fabric)" stroke="#d0c4b1" stroke-width="4"/>
      <path d="M255 447Q600 415 945 447" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5"/>
      <path d="M250 555Q600 585 950 555" fill="none" stroke="#7f7160" stroke-opacity=".25" stroke-width="4"/>
      <path d="M350 410V595M850 410V595" stroke="#fff" stroke-opacity=".2" stroke-width="4"/>
      <rect x="285" y="368" width="255" height="105" rx="35" fill="#f8f4eb" transform="rotate(-3 412 420)"/>
      <rect x="660" y="368" width="255" height="105" rx="35" fill="#f8f4eb" transform="rotate(3 787 420)"/>
    </g>
  </g>`;
}

function rug(view = 1) {
  const diamonds = Array.from({ length: 6 }, (_, index) => `<path d="M${310 + index * 112} 510L${366 + index * 112} 565L${310 + index * 112} 620L${254 + index * 112} 565Z" fill="none" stroke="#f0e5d2" stroke-width="8" opacity=".65"/>`).join("");
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="665" rx="440" ry="30" fill="#624b38" opacity=".12"/>
    <g transform="${view === 2 ? "translate(0 10) skewY(-2)" : ""}">
      <path d="M185 475L1015 475L1080 665L120 665Z" fill="url(#fabric-alt)" stroke="#7c6b57" stroke-opacity=".3" stroke-width="3"/>
      <path d="M220 500L980 500L1025 635L175 635Z" fill="none" stroke="#efe4d0" stroke-width="12" opacity=".8"/>
      <path d="M255 525L945 525L975 610L225 610Z" fill="none" stroke="#6f7565" stroke-width="5" opacity=".45"/>
      ${diamonds}
      <path d="M145 650L1060 650" stroke="#d7c7ae" stroke-width="5" stroke-dasharray="5 12"/>
    </g>
  </g>`;
}

function wallArt(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="700" rx="310" ry="24" fill="#624b38" opacity=".1"/>
    <g transform="${view === 2 ? "translate(18 -4) rotate(2 600 450)" : ""}">
      <rect x="325" y="210" width="550" height="430" rx="8" fill="url(#wood)"/>
      <rect x="350" y="235" width="500" height="380" fill="#f4ede0"/>
      <rect x="385" y="270" width="430" height="310" fill="#e4dac8"/>
      <circle cx="510" cy="405" r="95" fill="url(#fabric)"/>
      <circle cx="690" cy="470" r="105" fill="url(#fabric-alt)" opacity=".9"/>
      <path d="M405 555V435A115 115 0 0 1 635 435V555Z" fill="#efe6d5" opacity=".82"/>
      <path d="M455 555V450A65 65 0 0 1 585 450V555Z" fill="#a99475" opacity=".7"/>
      <path d="M420 300H780" stroke="#fff" stroke-opacity=".6" stroke-width="4"/>
    </g>
  </g>`;
}

function bookcase(view = 1) {
  const books = [
    [350, 390, 30, 105, "#8b5f49"], [385, 370, 35, 125, "#75826b"], [425, 400, 26, 95, "#c0a071"],
    [685, 380, 32, 115, "#718593"], [722, 365, 28, 130, "#a46750"], [755, 405, 38, 90, "#d0bb96"],
  ].map(([x, y, width, height, fill]) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="3" fill="${fill}"/><path d="M${x + 6} ${y + 15}H${x + width - 6}" stroke="#f5ead7" stroke-opacity=".5" stroke-width="3"/>`).join("");
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="712" rx="300" ry="27" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(10 0) skewY(-1)" : ""}">
      <rect x="300" y="235" width="600" height="440" rx="8" fill="url(#wood)"/>
      <rect x="335" y="270" width="530" height="370" fill="#d7c3a4"/>
      <path d="M335 360H865M335 460H865M335 560H865" stroke="url(#wood)" stroke-width="20"/>
      ${books}
      <path d="M565 315H635L625 355H575Z" fill="#b47b5c"/>
      <path d="M600 318Q575 275 555 295Q570 330 600 330Q630 275 645 295Q630 330 600 330" fill="#7c8b6d"/>
      <ellipse cx="725" cy="540" rx="58" ry="20" fill="#eee2cb"/>
      <path d="M680 535Q725 500 770 535" fill="none" stroke="#eee2cb" stroke-width="14"/>
    </g>
  </g>`;
}

function storagePiece(product, view = 1) {
  if (product.title.includes("Cube")) {
    return `<g filter="url(#shadow)"><ellipse cx="600" cy="700" rx="390" ry="28" fill="#624b38" opacity=".14"/><g transform="${view === 2 ? "skewY(-1)" : ""}"><rect x="225" y="300" width="750" height="350" rx="12" fill="url(#wood)"/>${[225, 375, 525, 675, 825].map((x) => `<rect x="${x}" y="325" width="150" height="300" fill="#ddc8a8" stroke="url(#wood)" stroke-width="18"/>`).join("")}<rect x="250" y="470" width="100" height="145" rx="10" fill="#9a8265"/><rect x="550" y="410" width="100" height="100" rx="12" fill="#7e896d"/></g></g>`;
  }
  if (product.title.includes("Media Console")) {
    return `<g filter="url(#shadow)"><ellipse cx="600" cy="700" rx="420" ry="28" fill="#624b38" opacity=".14"/><g transform="${view === 2 ? "skewY(-1)" : ""}"><rect x="205" y="410" width="790" height="220" rx="12" fill="url(#wood)"/><rect x="235" y="435" width="350" height="165" rx="7" fill="#d7c3a4"/><rect x="615" y="435" width="350" height="165" rx="7" fill="#d7c3a4"/><path d="M410 438V600M800 438V600" stroke="#70543d" stroke-width="4"/><circle cx="390" cy="515" r="7" fill="#66513e"/><circle cx="830" cy="515" r="7" fill="#66513e"/><path d="M270 630V690M930 630V690" stroke="#72543d" stroke-width="22"/></g></g>`;
  }
  if (product.title.includes("Bench")) return ottoman(view);
  if (product.title.includes("Ottoman")) return ottoman(view);
  const doors = product.title.includes("Cabinet") || product.title.includes("Marlow");
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="710" rx="350" ry="28" fill="#624b38" opacity=".14"/>
    <path d="M325 635V694M875 635V694" stroke="#6f5039" stroke-width="20" stroke-linecap="round"/>
    <g transform="${view === 2 ? "translate(8 2) skewY(-1)" : ""}">
      <rect x="285" y="265" width="630" height="385" rx="12" fill="url(#wood)"/>
      <rect x="265" y="245" width="670" height="32" rx="10" fill="url(#wood)"/>
      ${doors ? `<rect x="315" y="300" width="570" height="320" rx="6" fill="#d8c2a1" stroke="url(#wood)" stroke-width="18"/><path d="M600 305V615" stroke="url(#wood)" stroke-width="12"/><circle cx="570" cy="460" r="8" fill="#69533f"/><circle cx="630" cy="460" r="8" fill="#69533f"/>` : `<rect x="320" y="300" width="560" height="145" rx="8" fill="url(#wood)" stroke="#70573f" stroke-opacity=".3" stroke-width="3"/><rect x="320" y="465" width="560" height="150" rx="8" fill="url(#wood)" stroke="#70573f" stroke-opacity=".3" stroke-width="3"/><circle cx="600" cy="370" r="8" fill="#69533f"/><circle cx="600" cy="540" r="8" fill="#69533f"/>`}
    </g>
  </g>`;
}

function petBed(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="695" rx="325" ry="32" fill="#624b38" opacity=".14"/>
    <g transform="${view === 2 ? "translate(0 10) skewY(-2)" : ""}">
      <ellipse cx="600" cy="570" rx="335" ry="155" fill="url(#fabric-alt)"/>
      <ellipse cx="600" cy="545" rx="245" ry="105" fill="url(#fabric)"/>
      <ellipse cx="600" cy="535" rx="190" ry="72" fill="#e9dfcd" opacity=".7"/>
      <path d="M335 515Q600 430 865 515" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="5"/>
      <path d="M390 640Q600 700 810 640" fill="none" stroke="#6f6252" stroke-opacity=".2" stroke-width="4"/>
    </g>
  </g>`;
}

function petMat(view = 1) {
  return `<g filter="url(#shadow)">
    <ellipse cx="600" cy="675" rx="365" ry="30" fill="#624b38" opacity=".13"/>
    <g transform="${view === 2 ? "translate(0 8) skewY(-2)" : ""}">
      <path d="M220 420H980L1060 650H140Z" fill="url(#fabric)" stroke="#766858" stroke-opacity=".3" stroke-width="4"/>
      <path d="M255 450H945L1000 615H200Z" fill="none" stroke="#f2e7d5" stroke-width="8" stroke-dasharray="12 12" opacity=".7"/>
      <g fill="#eee3d0" opacity=".8">
        <ellipse cx="475" cy="510" rx="28" ry="35" transform="rotate(-20 475 510)"/>
        <ellipse cx="535" cy="485" rx="28" ry="35" transform="rotate(15 535 485)"/>
        <ellipse cx="600" cy="515" rx="28" ry="35" transform="rotate(-5 600 515)"/>
        <ellipse cx="660" cy="490" rx="28" ry="35" transform="rotate(20 660 490)"/>
        <ellipse cx="715" cy="515" rx="28" ry="35" transform="rotate(-15 715 515)"/>
        <path d="M535 570Q600 525 665 570Q630 620 600 600Q565 620 535 570Z"/>
      </g>
    </g>
  </g>`;
}

function furniture(kind, product, view = 1) {
  switch (kind) {
    case "sofas": return sofa(view);
    case "sectionals": return sectional(view);
    case "recliners": return recliner(view);
    case "accent-chairs": return accentChair(view);
    case "ottomans": return ottoman(view);
    case "beds": return bed(view);
    case "dressers": return dresser(view, product.title.includes("9-Drawer") ? 9 : 6);
    case "nightstands": return nightstand(view, product.title.includes("3-Drawer") ? 3 : 2);
    case "dining-tables": return diningTable(view, /Round|Oval|Bistro/.test(product.title));
    case "dining-chairs": return diningChair(view);
    case "dining-sets": return diningSet(view);
    case "desks": return desk(view);
    case "office-chairs": return officeChair(view);
    case "outdoor-seating": return outdoorSeating(view);
    case "outdoor-dining": return outdoorDining(view);
    case "mattresses": return mattress(view);
    case "rugs": return rug(view);
    case "wall-art": return wallArt(view);
    case "bookcases": return bookcase(view);
    case "storage": return storagePiece(product, view);
    case "pet-beds": return petBed(view);
    case "pet-mats": return petMat(view);
    default: throw new Error(`No artwork renderer for ${kind}`);
  }
}

function productSvg(product, view) {
  const titleLines = wrapTitle(product.title);
  const titleMarkup = titleLines.map((line, index) => `<text x="66" y="${838 + index * 39}" font-family="Georgia, 'Times New Roman', serif" font-size="32" fill="#342d26">${escapeXml(line)}</text>`).join("");
  const body = `
  ${backdrop(1200, 900, view, 0.66)}
  <g transform="${view === 3 ? "translate(-60 -76) scale(1.1)" : "translate(0 -8)"}">${furniture(product.category, product, view)}</g>
  <rect x="0" y="760" width="1200" height="140" fill="#f8f3ea"/>
  <path d="M0 760H1200" stroke="#ddceba" stroke-width="3"/>
  <text x="66" y="797" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="4" fill="#8a6e50">${escapeXml(product.id)}</text>
  ${titleMarkup}`;
  return svgDocument(1200, 900, `${product.title}, ${product.id}, view ${view}`, body, definitions(product.colors, view));
}

function categorySvg(category) {
  const kinds = categoryArtwork[category.slug];
  assert(kinds?.length, `Missing category artwork mapping for ${category.slug}`);
  const sample = products.find((product) => product.category === kinds[0]);
  const secondary = products.find((product) => product.category === kinds[1]);
  const mainArt = `<g transform="translate(400 438) scale(.64) translate(-600 -500)">${furniture(kinds[0], sample, 1)}</g>`;
  const secondaryArt = secondary
    ? `<g transform="translate(530 590) scale(.34) translate(-600 -500)">${furniture(kinds[1], secondary, 1)}</g>`
    : "";
  const body = `
  ${backdrop(800, 800, 1, 0.67)}
  <path d="M105 555V245A295 295 0 0 1 695 245V555Z" fill="#f4eadb" opacity=".34"/>
  ${mainArt}${secondaryArt}
  ${plant(110, 640, .72)}`;
  return svgDocument(800, 800, `${category.name} furniture illustration`, body, definitions(sample.colors, 1));
}

function roomScene(type, width, height) {
  const living = type === "living-room";
  const bedroom = type === "bedroom";
  const dining = type === "dining-room";
  const office = type === "home-office";
  const configs = {
    "living-room": { sample: products.find((product) => product.category === "sofas"), x: .61, y: .6, scale: 1.04 },
    bedroom: { sample: products.find((product) => product.category === "beds"), x: .52, y: .61, scale: 1.03 },
    "dining-room": { sample: products.find((product) => product.category === "dining-sets"), x: .51, y: .63, scale: .96 },
    "home-office": { sample: products.find((product) => product.category === "desks"), x: .52, y: .62, scale: .91 },
    outdoor: { sample: products.find((product) => product.category === "outdoor-dining"), x: .52, y: .62, scale: .92 },
  };
  const config = configs[type];
  assert(config?.sample, `Missing room artwork mapping for ${type}`);
  const kind = living ? "sofas" : bedroom ? "beds" : dining ? "dining-sets" : office ? "desks" : "outdoor-dining";
  const scale = config.scale * (width / 1500);
  const main = `<g transform="translate(${width * config.x} ${height * config.y}) scale(${scale}) translate(-600 -500)">${furniture(kind, config.sample, 1)}</g>`;
  const decor = living
    ? `<path d="M${width * .27} ${height * .79}H${width * .87}V${height * .9}H${width * .27}Z" fill="#d8c3a5" opacity=".55"/>${coffeeTable(width * .47, height * .83, width / 1700)}${floorLamp(width * .88, height * .84, width / 1500)}${plant(width * .12, height * .85, width / 1350)}`
    : bedroom
      ? `${plant(width * .84, height * .84, width / 1600)}<g transform="translate(${width * .23} ${height * .72}) scale(${width / 2100}) translate(-600 -500)">${furniture("nightstands", products.find((product) => product.category === "nightstands"), 1)}</g><g transform="translate(${width * .79} ${height * .72}) scale(${width / 2100}) translate(-600 -500)">${furniture("nightstands", products.find((product) => product.category === "nightstands"), 1)}</g><g stroke="#6f5b47" stroke-width="5"><path d="M${width * .35} 0V${height * .2}M${width * .65} 0V${height * .2}"/><path d="M${width * .29} ${height * .2}Q${width * .35} ${height * .12} ${width * .41} ${height * .2}Z" fill="#e6d3b3"/><path d="M${width * .59} ${height * .2}Q${width * .65} ${height * .12} ${width * .71} ${height * .2}Z" fill="#e6d3b3"/></g>`
      : dining
        ? `${plant(width * .89, height * .85, width / 1450)}<g transform="translate(${width * .85} ${height * .66}) scale(${width / 2600}) translate(-600 -500)">${furniture("storage", products.find((product) => product.id === "HO1059"), 1)}</g><g stroke="#6f5b47" stroke-width="5"><path d="M${width * .35} 0V${height * .22}M${width * .58} 0V${height * .22}"/><path d="M${width * .28} ${height * .22}Q${width * .35} ${height * .12} ${width * .42} ${height * .22}Z" fill="#e6d3b3"/><path d="M${width * .51} ${height * .22}Q${width * .58} ${height * .12} ${width * .65} ${height * .22}Z" fill="#e6d3b3"/></g>`
        : office
          ? `<g transform="translate(${width * .7} ${height * .77}) scale(${width / 2300}) translate(-600 -500)">${furniture("office-chairs", products.find((product) => product.category === "office-chairs"), 1)}</g>${plant(width * .12, height * .84, width / 1550)}`
          : `${plant(width * .12, height * .85, width / 1450)}<g transform="translate(${width * .84} ${height * .72}) scale(${width / 2600}) translate(-600 -500)">${furniture("outdoor-seating", products.find((product) => product.category === "outdoor-seating"), 1)}</g>`;
  const body = `${backdrop(width, height, living ? 1 : 2, .67)}${main}${decor}`;
  const roomName = type.replaceAll("-", " ").replace(/^\w/, (letter) => letter.toUpperCase());
  return svgDocument(width, height, `${roomName} interior illustration`, body, definitions(config.sample.colors, living ? 1 : 2));
}

function writeImage(relativePath, content) {
  const target = resolve(IMAGES, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, "utf8");
}

assert.equal(products.length, 72);
assert.equal(categories.length, 9);
let fileCount = 0;
for (const product of products) {
  assert(product.images.length >= 2 && product.images.length <= 3);
  product.images.forEach((image, index) => {
    const match = image.src.match(/^\/images\/products\/(HO\d{4})-(\d+)\.svg$/);
    assert(match && match[1] === product.id && Number(match[2]) === index + 1, `Invalid image path: ${image.src}`);
    writeImage(`products/${match[1]}-${match[2]}.svg`, productSvg(product, index + 1));
    fileCount += 1;
  });
}
for (const category of categories) {
  writeImage(`categories/${category.slug}.svg`, categorySvg(category));
  fileCount += 1;
}
for (const room of ["living-room", "bedroom", "dining-room", "home-office", "outdoor"]) {
  writeImage(`rooms/${room}.svg`, roomScene(room, 1000, 800));
  fileCount += 1;
}
for (const hero of ["living", "bedroom", "dining"]) {
  const room = hero === "bedroom" ? "bedroom" : `${hero}-room`;
  writeImage(`hero/hero-${hero}.svg`, roomScene(room, 1920, 820));
  fileCount += 1;
}
console.log(`Generated ${fileCount} self-contained SVG assets: ${products.reduce((sum, product) => sum + product.images.length, 0)} product, ${categories.length} category, 5 room, and 3 hero images.`);
