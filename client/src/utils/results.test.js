import { describe, expect, it } from "vitest";
import {
  calculateNormalResults,
  calculateTeamResults,
  rankByPoints,
} from "./results";

const competition = {
  cup_participation_points: 2,
  // stored with the cup multiplier (2) already applied
  cup_points_multiplier: 2,
  cup_placement_points: [
    { placement: 1, points: 40 },
    { placement: 2, points: 30 },
  ],
};

const signee = (boat, total_points, extra = {}) => ({
  boat_number: boat,
  captain_name: `Captain ${boat}`,
  total_points,
  fishes: [{ id: 1, weights: total_points }],
  ...extra,
});

describe("calculateNormalResults", () => {
  const { normal_points, normal_weights } = calculateNormalResults(
    competition,
    [signee(3, 100), signee(1, 500), signee(2, 500), signee(4, 0)],
  );
  const byBoat = Object.fromEntries(
    normal_points.map((r) => [r.boat_number, r]),
  );

  it("sorts by points and shares placements on ties", () => {
    expect(normal_points.map((r) => [r.boat_number, r.placement])).toEqual([
      [1, 1],
      [2, 1],
      [3, 3],
      [4, 4],
    ]);
  });

  it("uses the stored placement points as they are (no second multiplier)", () => {
    expect(byBoat[1].cup_placement_points).toBe(40);
    expect(byBoat[1].cup_points_total).toBe(42);
  });

  it("gives only participation points beyond the list or without a catch", () => {
    expect(byBoat[3].cup_points_total).toBe(2);
    expect(byBoat[4].cup_placement_points).toBe(0);
    expect(byBoat[4].cup_points_total).toBe(2);
  });

  it("shows each boat's gap to the boat directly above", () => {
    expect(normal_points.map((r) => r.points_behind)).toEqual([
      null,
      0,
      400,
      100,
    ]);
  });

  it("adds per-fish columns for the weights table", () => {
    expect(normal_weights[0][1]).toBe(500);
    expect(normal_weights[0].placement).toBe(1);
  });
});

describe("rankByPoints", () => {
  it("ranks a copy without changing the input", () => {
    const input = [signee(1, 10), signee(2, 30), signee(3, 30)];
    const ranked = rankByPoints(input);
    expect(ranked.map((s) => [s.boat_number, s.placement])).toEqual([
      [2, 1],
      [3, 1],
      [1, 3],
    ]);
    expect(input[0].placement).toBeUndefined();
  });
});

describe("calculateTeamResults", () => {
  it("sums members' points per team and pads teams to three names", () => {
    const teams = calculateTeamResults({
      signees: [
        signee(1, 100, { team: "Hauet" }),
        signee(2, 50, { team: "Hauet" }),
        signee(3, 70, { team: "Ahvenet" }),
        signee(4, 999, { team: "-" }),
      ],
    });
    expect(teams).toEqual([
      {
        name: "Hauet",
        captain_name_1: "Captain 1",
        captain_name_2: "Captain 2",
        captain_name_3: "-",
        points: (150).toLocaleString(),
      },
      {
        name: "Ahvenet",
        captain_name_1: "Captain 3",
        captain_name_2: "-",
        captain_name_3: "-",
        points: (70).toLocaleString(),
      },
    ]);
  });
});
