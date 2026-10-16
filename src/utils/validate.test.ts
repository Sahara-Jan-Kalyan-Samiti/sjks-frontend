import { describe, expect, it } from "vitest";
import { checkField, isValidEmail, isValidPhone, isValidPhoneStrict } from "./validate";

describe("isValidEmail", () => {
  it("accepts normal addresses", () => expect(isValidEmail("info@saharangosag.com")).toBe(true));
  it("rejects missing domain and double dots", () => {
    expect(isValidEmail("name@")).toBe(false);
    expect(isValidEmail("a..b@example.com")).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("accepts Indian mobiles with or without +91", () => {
    expect(isValidPhone("98765 43210")).toBe(true);
    expect(isValidPhone("+91 98765 43210")).toBe(true);
  });
  it("rejects numbers that do not start with 6-9", () => expect(isValidPhone("5876543210")).toBe(false));
});

describe("isValidPhoneStrict", () => {
  it("needs 10 digits, or 12 with a leading +", () => {
    expect(isValidPhoneStrict("9876543210")).toBe(true);
    expect(isValidPhoneStrict("+919876543210")).toBe(true);
    expect(isValidPhoneStrict("+98765432")).toBe(false);
  });
});

describe("checkField", () => {
  it("allows an empty optional value but not an empty required one", () => {
    expect(checkField("email", "")).toBe("");
    expect(checkField("email", "", true)).not.toBe("");
  });
});
