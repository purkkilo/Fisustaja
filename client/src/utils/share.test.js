import { describe, expect, it } from "vitest";
import { absoluteUrl, prefersShareSheet } from "./share";

describe("absoluteUrl", () => {
  it("turns a router href into a full address", () => {
    expect(absoluteUrl("/public-results/abc", "https://fisustaja.fi")).toBe(
      "https://fisustaja.fi/public-results/abc",
    );
  });

  it("keeps a base path in the href", () => {
    expect(absoluteUrl("/app/public-cups/1", "http://localhost:8080")).toBe(
      "http://localhost:8080/app/public-cups/1",
    );
  });
});

describe("prefersShareSheet", () => {
  const touch = { matchMedia: () => ({ matches: true }) };
  const mouse = { matchMedia: () => ({ matches: false }) };
  const canShare = { share: () => {} };

  it("uses the share sheet only on touch devices that have one", () => {
    expect(prefersShareSheet(canShare, touch)).toBe(true);
    expect(prefersShareSheet(canShare, mouse)).toBe(false);
    expect(prefersShareSheet({}, touch)).toBe(false);
  });
});
