import { describe, expect, it } from "vitest";
import { competitionSummary, formatKg } from "./overview";

const competition = {
  fishes: [
    { id: 0, name: "Ahven", multiplier: 1, minsize: "0", color: "#111" },
    { id: 1, name: "Hauki", multiplier: 0.5, minsize: "40", color: "#222" },
    { id: 2, name: "Kuha", multiplier: 2, minsize: "42", color: "#333" },
  ],
};
const results = [
  {
    returned: true,
    fishes: [
      { id: 0, weights: 1500 },
      { id: 1, weights: 3000 },
    ],
  },
  { returned: true, fishes: [{ id: 0, weights: 0 }] },
  { returned: false, fishes: [] },
  { returned: true, fishes: [{ id: 0, weights: 500 }] },
];

describe("competitionSummary", () => {
  const s = competitionSummary(competition, results);

  it("counts boats, returns and boats with fish", () => {
    expect(s.boats).toBe(4);
    expect(s.returned).toBe(3);
    expect(s.onWater).toBe(1);
    expect(s.returnedPct).toBe(75);
    expect(s.withFish).toBe(2);
    expect(s.withFishPct).toBe(50);
  });

  it("sums the catch per species by id, biggest first", () => {
    expect(s.totalWeight).toBe(5000);
    expect(s.species.map((f) => f.name)).toEqual(["Hauki", "Ahven", "Kuha"]);
    expect(s.species[0]).toMatchObject({
      weight: 3000,
      points: 1500,
      share: 60,
    });
    expect(s.species[2]).toMatchObject({ weight: 0, share: 0 });
  });

  it("falls back to matching by name for legacy catch rows", () => {
    const legacy = competitionSummary(competition, [
      {
        returned: true,
        fishes: [
          { name: "Ahven", weights: 1000 },
          { name: "Hauki", weights: 2000 },
        ],
      },
    ]);
    expect(legacy.totalWeight).toBe(3000);
    expect(legacy.species[0]).toMatchObject({ name: "Hauki", weight: 2000 });
  });

  it("handles a competition without results", () => {
    const empty = competitionSummary(competition, null);
    expect(empty.boats).toBe(0);
    expect(empty.withFishPct).toBe(0);
    expect(empty.species).toHaveLength(3);
  });
});

describe("formatKg", () => {
  it("shows kilograms with at most two decimals", () => {
    expect(formatKg(12345, "en-GB")).toBe("12.35");
    expect(formatKg(0, "en-GB")).toBe("0");
  });
});
