import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { bareHost, buildRedirects, legacyPages, siteHost } from "../../redirects.mjs";

const appDir = join(process.cwd(), "src", "app");
const pageExists = (path: string) => existsSync(join(appDir, path === "/" ? "" : path, "page.tsx"));

describe("redirects", () => {
  const list = buildRedirects();

  it("sends the bare domain to www first, permanently, keeping the path", () => {
    expect(list[0]).toMatchObject({
      source: "/:path*",
      destination: `https://${siteHost}/:path*`,
      permanent: true,
      has: [{ type: "host", value: bareHost }]
    });
  });

  it("every old address lands on a page that exists in the new site", () => {
    const missing = Object.values(legacyPages).filter((to) => !pageExists(to));
    expect(missing).toEqual([]);
  });

  it("has no duplicate sources and no loops", () => {
    const sources = Object.keys(legacyPages);
    expect(new Set(sources).size).toBe(sources.length);
    for (const [from, to] of Object.entries(legacyPages)) {
      expect(to).not.toBe(from);
      expect(sources).not.toContain(to);
    }
  });

  it("never redirects a page that the new site already serves", () => {
    const shadowed = Object.keys(legacyPages).filter((from) => pageExists(from));
    expect(shadowed).toEqual([]);
  });

  it("makes every redirect permanent", () => {
    expect(list.every((r) => r.permanent)).toBe(true);
  });

  it("keeps the main old pages mapped", () => {
    expect(legacyPages["/about-us"]).toBe("/about");
    expect(legacyPages["/contact-us"]).toBe("/contact");
    expect(legacyPages["/annual-reports"]).toBe("/transparency/annual-reports");
  });
});
