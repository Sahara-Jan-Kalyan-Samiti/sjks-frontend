import { describe, expect, it } from "vitest";
import { publicStorageUrl, restHeaders, restUrl } from "./supabaseRest";

const base = "https://abc.supabase.co";

describe("restUrl", () => {
  it("builds a PostgREST query with filters, embedded tables and ordering", () => {
    const u = new URL(
      restUrl(
        "events",
        { select: "id,title,event_images(storage_path,position)", published: "eq.true", order: "sort_order,created_at.desc" },
        base
      )
    );
    expect(u.origin + u.pathname).toBe(`${base}/rest/v1/events`);
    expect(u.searchParams.get("select")).toBe("id,title,event_images(storage_path,position)");
    expect(u.searchParams.get("published")).toBe("eq.true");
    expect(u.searchParams.get("order")).toBe("sort_order,created_at.desc");
  });
});

describe("restHeaders", () => {
  it("sends a legacy JWT key as apikey and bearer token", () =>
    expect(restHeaders("eyJhbGciOi.x.y")).toEqual({ apikey: "eyJhbGciOi.x.y", Authorization: "Bearer eyJhbGciOi.x.y" }));
  it("sends a publishable key only as apikey", () => expect(restHeaders("sb_publishable_abc")).toEqual({ apikey: "sb_publishable_abc" }));
});

describe("publicStorageUrl", () => {
  it("matches supabase-js getPublicUrl", () =>
    expect(publicStorageUrl("event-images", "/2026/camp photo.jpg", base)).toBe(
      `${base}/storage/v1/object/public/event-images/2026/camp%20photo.jpg`
    ));
});
