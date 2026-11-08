import { describe, expect, it } from "vitest";
import {
  calculateCupStandings,
  competitionCupPoints,
  cupHeaders,
  resultPoints,
  withCatchTotals,
} from "./cupResults";

const fishes = [
  { id: 1, name: "Ahven", multiplier: 1 },
  { id: 2, name: "Hauki", multiplier: 2 },
];

// Placement points are stored with the cup multiplier already applied
// (base 20/15/10 with multiplier 2 -> 40/30/20).
const competition = (overrides = {}) => ({
  _id: "c1",
  key_name: 1,
  name: "Kisa 1",
  locality: "Lahti",
  isFinished: true,
  fishes,
  cup_points_multiplier: 2,
  cup_participation_points: 2,
  cup_placement_points: [
    { placement: 1, points: 40 },
    { placement: 2, points: 30 },
    { placement: 3, points: 20 },
  ],
  ...overrides,
});

const result = (boat, catches, overrides = {}) => ({
  competition_id: "c1",
  boat_number: boat,
  captain_name: `Captain ${boat}`,
  returned: true,
  fishes: catches.map(([id, weights]) => ({ id, weights })),
  ...overrides,
});

describe("resultPoints", () => {
  it("multiplies each catch by its fish multiplier", () => {
    expect(
      resultPoints(
        result(1, [
          [1, 300],
          [2, 100],
        ]),
        competition(),
      ),
    ).toBe(500);
  });

  it("ignores fish that are not in the competition and bad weights", () => {
    expect(
      resultPoints(
        result(1, [
          [9, 1000],
          [1, "abc"],
          [2, "50"],
        ]),
        competition(),
      ),
    ).toBe(100);
  });
});

describe("competitionCupPoints", () => {
  const rows = competitionCupPoints(competition(), [
    result(1, [[1, 500]]), // 500
    result(2, [[2, 250]]), // 500, tie with boat 1
    result(3, [[1, 100]]), // 100
    result(4, []), // returned without fish
    result(5, [[1, 900]], { returned: false }), // still on the water
  ]);
  const byBoat = Object.fromEntries(rows.map((r) => [r.boat_number, r]));

  it("only counts returned boats", () => {
    expect(rows.map((r) => r.boat_number).sort()).toEqual([1, 2, 3, 4]);
  });

  it("gives tied boats the same placement and skips the next one", () => {
    expect(byBoat[1].placement).toBe(1);
    expect(byBoat[2].placement).toBe(1);
    expect(byBoat[3].placement).toBe(3);
  });

  it("does not apply the cup multiplier a second time", () => {
    expect(byBoat[1].cup_placement_points).toBe(40);
    expect(byBoat[1].cup_points_total).toBe(42);
    expect(byBoat[3].cup_placement_points).toBe(20);
  });

  it("gives only participation points without a catch", () => {
    expect(byBoat[4].cup_placement_points).toBe(0);
    expect(byBoat[4].cup_points_total).toBe(2);
  });

  it("gives no placement points beyond the listed placements", () => {
    const [, , third, fourth] = competitionCupPoints(
      competition({ cup_placement_points: [{ placement: 1, points: 10 }] }),
      [
        result(1, [[1, 4]]),
        result(2, [[1, 3]]),
        result(3, [[1, 2]]),
        result(4, [[1, 1]]),
      ],
    );
    expect(third.cup_placement_points).toBe(0);
    expect(fourth.cup_points_total).toBe(2);
  });
});

describe("calculateCupStandings", () => {
  const c1 = competition();
  const c2 = competition({ _id: "c2", key_name: 2, name: "Kisa 2" });
  const c3 = competition({ _id: "c3", key_name: 3, name: "Kisa 3" });
  const at = (id, boat, weight) =>
    result(boat, [[1, weight]], { competition_id: id });
  const results = [
    at("c1", 1, 500),
    at("c1", 2, 400),
    at("c1", 3, 300),
    at("c2", 1, 100),
    at("c2", 2, 500),
    at("c2", 3, 300),
    at("c3", 1, 500),
    at("c3", 2, 100),
  ];
  const signees = [
    { boat_number: "1", captain_name: "Matti", locality: "Lahti" },
    { boat_number: "2", captain_name: "Liisa", locality: "Heinola" },
  ];

  it("adds up every competition when there is no limit", () => {
    const { standings } = calculateCupStandings([c1, c2, c3], results, signees);
    const boat1 = standings.find((s) => s.boat_number === 1);
    // 42 + 22 (3rd) + 42
    expect(boat1.final_cup_points).toBe(106);
    expect(boat1.cup_results[2]).toMatchObject({ points: 22, placement: 3 });
  });

  it("counts only the best N results; the rest give participation points", () => {
    const { standings } = calculateCupStandings(
      [c1, c2, c3],
      results,
      signees,
      2,
    );
    const boat1 = standings.find((s) => s.boat_number === 1);
    expect(boat1.final_cup_points).toBe(42 + 42 + 2);
    expect(boat1.cup_results[2].points).toBe(2);
    expect(boat1.cup_results[2].placement).toBe(3);
  });

  it("ranks boats and shares placements on equal totals", () => {
    const { standings } = calculateCupStandings(
      [c1],
      [at("c1", 1, 200), at("c1", 2, 200), at("c1", 3, 100)],
      signees,
    );
    expect(standings.map((s) => [s.boat_number, s.final_placement])).toEqual([
      [1, 1],
      [2, 1],
      [3, 3],
    ]);
  });

  it("uses names from the cup signee list and reports boats missing from it", () => {
    const { standings, missing } = calculateCupStandings(
      [c1],
      results,
      signees,
    );
    expect(standings.find((s) => s.boat_number === 2).captain_name).toBe(
      "Liisa",
    );
    expect(missing).toEqual(["(3) - Captain 3"]);
  });

  it("does not modify its inputs", () => {
    const before = JSON.stringify({ c1, results, signees });
    calculateCupStandings([c1, c2, c3], results, signees, 1);
    expect(JSON.stringify({ c1, results, signees })).toBe(before);
  });
});

describe("cupHeaders", () => {
  it("numbers repeated localities and keys columns by competition", () => {
    const headers = cupHeaders([
      competition({ key_name: 1, locality: "Lahti" }),
      competition({ key_name: 2, locality: "Lahti", isFinished: false }),
      competition({ key_name: 3, locality: "Heinola" }),
    ]);
    const columns = headers.filter((h) => h.highlight);
    expect(columns.map((h) => h.title)).toEqual([
      "Lahti",
      "Lahti #2",
      "Heinola",
    ]);
    expect(columns[1]).toMatchObject({
      key: "cup_results[2].points",
      isFinished: false,
    });
    expect(headers.at(-1).key).toBe("final_cup_points");
  });

  it("can label columns by competition name", () => {
    const [column] = cupHeaders([competition()], "name").filter(
      (h) => h.highlight,
    );
    expect(column.title).toBe("Kisa 1");
  });
});

describe("withCatchTotals", () => {
  it("totals catches per species for each competition", () => {
    const [c] = withCatchTotals(
      [competition()],
      [
        result(1, [
          [1, 300],
          [2, 100],
        ]),
        result(2, [[1, 50]]),
        result(3, [[1, 999]], { competition_id: "other" }),
      ],
    );
    expect(c.total_weights).toBe(450);
    expect(c.fishes.map((f) => f.weights)).toEqual([350, 100]);
  });
});
