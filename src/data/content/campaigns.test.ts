import { describe, expect, it } from "vitest";
import { campaignStats, daysLeft, toCampaign } from "./campaigns";

describe("campaignStats", () => {
  it("works out what is still needed from the goal and the amount raised", () => {
    expect(campaignStats({ goal: 100000, raised: 20000 })).toEqual({ goal: 100000, raised: 20000, left: 80000, pct: 20, reached: false });
  });
  it("never goes below zero or above 100%", () => {
    expect(campaignStats({ goal: 50000, raised: 70000 })).toMatchObject({ left: 0, pct: 100, reached: true });
    expect(campaignStats({ goal: 0, raised: 0 })).toMatchObject({ left: 0, pct: 0, reached: false });
  });
});

describe("daysLeft", () => {
  const now = new Date(2026, 10, 14, 15, 30);
  it("counts whole days to the last day to give", () => {
    expect(daysLeft("2026-11-24", now)).toBe(10);
    expect(daysLeft("2026-11-14", now)).toBe(0);
    expect(daysLeft("2026-11-13", now)).toBe(-1);
  });
  it("has no answer without a deadline", () => expect(daysLeft(null, now)).toBeNull());
});

describe("toCampaign", () => {
  it("reads a row from before the campaign-page migration", () => {
    const c = toCampaign({
      id: 1,
      slug: "gau-seva",
      title: "Cow shelter",
      goal_amount: "100000.00",
      raised_offset: "20000.00",
      published: true
    });
    expect(c).toMatchObject({
      slug: "gau-seva",
      goal: 100000,
      raised: 20000,
      story: "",
      cover: null,
      gallery: [],
      documents: [],
      updates: [],
      endDate: null
    });
  });
  it("keeps only safe links and puts the newest update first", () => {
    const c = toCampaign({
      slug: "a",
      title: "A",
      goal_amount: 10,
      cover_url: "javascript:alert(1)",
      gallery: [{ url: "https://x.test/a.jpg", caption: "One" }, { url: "http://x.test/b.jpg" }],
      documents: [{ url: "https://x.test/plan.pdf", name: "Plan" }],
      updates: [
        { date: "2026-10-01", title: "Old", text: "" },
        { date: "2026-11-01", title: "New", text: "" }
      ]
    });
    expect(c.cover).toBeNull();
    expect(c.gallery).toEqual([{ url: "https://x.test/a.jpg", caption: "One" }]);
    expect(c.documents).toEqual([{ url: "https://x.test/plan.pdf", name: "Plan" }]);
    expect(c.updates.map((u) => u.title)).toEqual(["New", "Old"]);
  });
});
