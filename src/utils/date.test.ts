import { describe, expect, it } from "vitest";
import { fmtDate } from "./date";

describe("fmtDate", () => {
  it("formats an ISO date for India", () => expect(fmtDate("2026-07-22")).toBe("22 July 2026"));
});
