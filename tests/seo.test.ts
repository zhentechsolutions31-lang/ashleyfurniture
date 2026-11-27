import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { colorHex } from "@/lib/catalog";

const originalDemo = process.env.NEXT_PUBLIC_SITE_DEMO;

afterEach(() => {
  if (originalDemo === undefined) delete process.env.NEXT_PUBLIC_SITE_DEMO;
  else process.env.NEXT_PUBLIC_SITE_DEMO = originalDemo;
});

describe("demo crawler metadata", () => {
  it("keeps the default demo out of search and omits its sitemap", () => {
    delete process.env.NEXT_PUBLIC_SITE_DEMO;
    expect(sitemap()).toEqual([]);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("includes every supported colour when indexing is enabled", () => {
    process.env.NEXT_PUBLIC_SITE_DEMO = "false";
    const urls = sitemap().map((entry) => entry.url);
    Object.keys(colorHex).forEach((color) => {
      expect(urls).toContain(`http://localhost:3000/color/${color}`);
    });
    expect(robots().sitemap).toBe("http://localhost:3000/sitemap.xml");
  });
});
