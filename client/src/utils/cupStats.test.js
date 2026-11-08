import { describe, expect, it } from "vitest";
import { catchByCompetition, standingsProgress } from "./cupStats";

const fishes = [
  { id: 1, name: "Ahven", multiplier: 1, color: "#a00" },
  { id: 2, name: "Hauki", multiplier: 1, color: "#0a0" },
];
const comp = (id, key, locality) => ({
  _id: id,
  key_name: key,
  name: `Kisa ${key}`,
  locality,
  isFinished: true,
  fishes,
  cup_participation_points: 2,
  cup_placement_points: [
    { placement: 1, points: 30 },
    { placement: 2, points: 20 },
    { placement: 3, points: 10 },
  ],
});
const res = (competition_id, boat, catches) => ({
  competition_id,
  boat_number: boat,
  captain_name: `Kippari ${boat}`,
  returned: true,
  fishes: catches.map(([id, weights]) => ({ id, weights })),
});
const competitions = [
  comp("a", 1, "Lahti"),
  comp("b", 2, "Hollola"),
  comp("c", 3, "Asikkala"),
];
const signees = [1, 2, 3].map((n) => ({
  boat_number: n,
  captain_name: `Kippari ${n}`,
}));
const results = [
  res("a", 1, [[1, 900]]), // 1st: 32
  res("a", 2, [[1, 500]]), // 2nd: 22
  res("b", 2, [[2, 800]]), // 1st: 32
  res("b", 1, [[1, 100]]), // 2nd: 22
  res("c", 3, [[2, 700]]), // 1st: 32
  res("c", 2, [[1, 200]]), // 2nd: 22
];

describe("standingsProgress", () => {
  it("gives each top boat's running cup points after every competition", () => {
    const p = standingsProgress(competitions, results, signees, 3, 8);
    expect(p.labels).toEqual(["Lahti", "Hollola", "Asikkala"]);
    const boat2 = p.boats.find((b) => b.label === "Kippari 2 (2)");
    expect(boat2.data).toEqual([22, 54, 76]);
    const boat3 = p.boats.find((b) => b.label === "Kippari 3 (3)");
    expect(boat3.data).toEqual([0, 0, 32]);
    // the leader comes first, as in the final standings
    expect(p.boats[0].label).toBe("Kippari 2 (2)");
  });

  it("uses the best-N rule like the final standings", () => {
    // only the best result counts fully, the rest give participation points
    const p = standingsProgress(competitions, results, signees, 1, 8);
    const boat2 = p.boats.find((b) => b.label === "Kippari 2 (2)");
    expect(boat2.data).toEqual([22, 34, 36]);
  });

  it("limits the number of boats", () => {
    expect(
      standingsProgress(competitions, results, signees, 3, 2).boats,
    ).toHaveLength(2);
    expect(standingsProgress([], results, signees, 3)).toEqual({
      labels: [],
      boats: [],
    });
  });
});

describe("catchByCompetition", () => {
  it("stacks kilograms per species for each competition", () => {
    const c = catchByCompetition(competitions, results);
    expect(c.labels).toEqual(["Lahti", "Hollola", "Asikkala"]);
    expect(c.species.find((s) => s.name === "Ahven").data).toEqual([
      1.4, 0.1, 0.2,
    ]);
    expect(c.species.find((s) => s.name === "Hauki").data).toEqual([
      0, 0.8, 0.7,
    ]);
  });
});
