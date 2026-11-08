import { describe, expect, it } from "vitest";
import {
  biggestFishBySpecies,
  catchTimeline,
  chartRows,
  statsSummary,
  niceStep,
  pointsHistogram,
  speciesPoints,
  topBoatsBySpecies,
} from "./competitionStats";

const competition = {
  fishes: [
    { id: 1, name: "Ahven", multiplier: 1, color: "#a00" },
    { id: 2, name: "Hauki", multiplier: 0.5, color: "#0a0" },
    { id: 3, name: "Kuha", multiplier: 2, color: "#00a" },
  ],
};
const boat = (n, placement, catches, extra = {}) => {
  const fishes = catches.map(([id, weights]) => ({ id, weights }));
  const mult = { 1: 1, 2: 0.5, 3: 2 };
  return {
    boat_number: n,
    captain_name: `Kippari ${n}`,
    placement,
    fishes,
    total_points: fishes.reduce((s, f) => s + f.weights * mult[f.id], 0),
    ...extra,
  };
};
const results = [
  boat(1, 1, [
    [1, 1000],
    [3, 600],
  ]), // 2200
  boat(2, 2, [[2, 4000]]), // 2000
  boat(3, 3, [[1, 300]]), // 300
  boat(4, 4, []), // 0
];

describe("speciesPoints", () => {
  it("ranks species by points, with weight and multiplier", () => {
    const s = speciesPoints(competition, results);
    expect(s.map((f) => f.name)).toEqual(["Hauki", "Ahven", "Kuha"]);
    expect(s[0]).toMatchObject({ weight: 4000, points: 2000, multiplier: 0.5 });
    expect(s[2]).toMatchObject({ weight: 600, points: 1200 });
  });
});

describe("topBoatsBySpecies", () => {
  it("splits each top boat's points by species and skips empty boats", () => {
    const { boats, species } = topBoatsBySpecies(competition, results, 10);
    expect(boats.map((b) => b.label)).toEqual([
      "1. Kippari 1 (1)",
      "2. Kippari 2 (2)",
      "3. Kippari 3 (3)",
    ]);
    const kuha = species.find((s) => s.name === "Kuha");
    expect(kuha.data).toEqual([1200, 0, 0]);
    // each boat's segments add up to its total
    boats.forEach((b, i) =>
      expect(species.reduce((sum, s) => sum + s.data[i], 0)).toBe(b.total),
    );
  });

  it("leaves out species nobody in the top caught", () => {
    const { species } = topBoatsBySpecies(competition, results, 1);
    expect(species.map((s) => s.name)).toEqual(["Ahven", "Kuha"]);
  });
});

describe("pointsHistogram", () => {
  it("rounds the step to 1/2/5 × 10^n", () => {
    expect(niceStep(340)).toBe(500);
    expect(niceStep(180)).toBe(200);
    expect(niceStep(100)).toBe(100);
    expect(niceStep(0)).toBe(1);
  });

  it("keeps boats without a catch in their own bar", () => {
    const bins = pointsHistogram([0, 0, 120, 480, 500, 2200], 5);
    expect(bins[0]).toEqual({ from: 0, to: 0, count: 2 });
    expect(bins[1]).toEqual({ from: 1, to: 500, count: 3 });
    expect(bins.at(-1)).toEqual({ from: 2001, to: 2500, count: 1 });
    expect(bins.reduce((s, b) => s + b.count, 0)).toBe(6);
  });

  it("handles no boats and only empty boats", () => {
    expect(pointsHistogram([])).toEqual([]);
    expect(pointsHistogram([0, 0])).toEqual([{ from: 0, to: 0, count: 2 }]);
  });
});

describe("biggestFishBySpecies", () => {
  it("groups weights by species in competition order and marks the record", () => {
    const groups = biggestFishBySpecies(competition, [
      { name: "Hauki", weight: 3100, boat_number: 2, captain_name: "B" },
      { name: "Ahven", weight: 420, boat_number: 1, captain_name: "A" },
      { name: "Hauki", weight: 5200, boat_number: 5, captain_name: "E" },
      { name: "Hauki", weight: 0, boat_number: 6, captain_name: "F" },
    ]);
    expect(groups.map((g) => g.name)).toEqual(["Ahven", "Hauki"]);
    const hauki = groups[1];
    expect(hauki.color).toBe("#0a0");
    expect(hauki.record.weight).toBe(5200);
    expect(hauki.fishes.map((f) => f.record)).toEqual([true, false]);
  });
});

describe("catchTimeline", () => {
  it("adds up kilograms in weighing order and skips boats without a time", () => {
    const line = catchTimeline([
      { weighed_at: "2026-06-01T15:30:00Z", fishes: [{ weights: 500 }] },
      { weighed_at: "2026-06-01T15:00:00Z", fishes: [{ weights: 1250 }] },
      { fishes: [{ weights: 9999 }] },
      { weighed_at: "nonsense", fishes: [{ weights: 1 }] },
    ]);
    expect(line.map((p) => p.kg)).toEqual([1.25, 1.75]);
    expect(line.map((p) => p.boats)).toEqual([1, 2]);
    expect(line[0].time.toISOString()).toBe("2026-06-01T15:00:00.000Z");
  });
});

describe("statsSummary", () => {
  it("gives the tiles with values formatted for the language", () => {
    const tiles = statsSummary(
      { total_weights: 50, isCupCompetition: true, cup_points_multiplier: 1.5 },
      [{}, {}, {}, {}],
      3,
      "fi-FI",
    );
    expect(tiles.map((t) => t.key)).toEqual([
      "boats",
      "got-fish",
      "total",
      "cup",
    ]);
    expect(tiles[1]).toMatchObject({
      value: "75",
      progress: 75,
      note: "3 / 4",
    });
    expect(tiles[2].value).toBe("0,05");
    expect(tiles[3].value).toBe("× 1,5");
  });

  it("leaves the cup tile out when not in a cup, and copes with no boats", () => {
    const tiles = statsSummary({ total_weights: 0 }, [], 0, "en-GB");
    expect(tiles).toHaveLength(3);
    expect(tiles[1].value).toBe("0");
  });
});

describe("chartRows", () => {
  it("pairs normal charts and gives wide ones their own row", () => {
    const rows = chartRows([
      { id: "a" },
      { id: "b" },
      { id: "c" },
      { id: "wide", wide: true },
      { id: "d" },
    ]);
    expect(rows.map((r) => r.map((c) => c.id))).toEqual([
      ["a", "b"],
      ["c"],
      ["wide"],
      ["d"],
    ]);
  });
});
