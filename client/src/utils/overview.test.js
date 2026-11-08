import { describe, expect, it } from "vitest";
import { competitionSummary, formatKg } from "./overview";

const competition = {
  fishes: [
    { name: "Ahven", multiplier: 1, minsize: "0", color: "#111" },
    { name: "Hauki", multiplier: 0.5, minsize: "40", color: "#222" },
    { name: "Kuha", multiplier: 2, minsize: "42", color: "#333" },
  ],
};
const results = [
  {
    returned: true,
    fishes: [
      { name: "Ahven", weights: 1500 },
      { name: "Hauki", weights: 3000 },
    ],
  },
  { returned: true, fishes: [{ name: "Ahven", weights: 0 }] },
  { returned: false, fishes: [] },
  { returned: true, fishes: [{ name: "Ahven", weights: 500 }] },
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

  it("sums the catch per species, biggest first", () => {
    expect(s.totalWeight).toBe(5000);
    expect(s.species.map((f) => f.name)).toEqual(["Hauki", "Ahven", "Kuha"]);
    expect(s.species[0]).toMatchObject({
      weight: 3000,
      points: 1500,
      share: 60,
    });
    expect(s.species[2]).toMatchObject({ weight: 0, share: 0 });
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
