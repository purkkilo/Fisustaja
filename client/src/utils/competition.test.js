import { describe, expect, it } from "vitest";
import {
  combineDateTime,
  competitionFieldErrors,
  cupFields,
  fromDateInput,
  toDateInput,
} from "./competition";

const valid = {
  name: "Kisa",
  locality: "Lahti",
  isCupCompetition: false,
  startDate: "2026-06-01",
  endDate: "2026-06-01",
  startTime: "08:00",
  endTime: "14:00",
};

describe("combineDateTime", () => {
  it("sets the local time on the date", () => {
    const d = combineDateTime("2026-06-01", "08:30");
    expect([d.getHours(), d.getMinutes()]).toEqual([8, 30]);
  });
});

describe("competitionFieldErrors", () => {
  it("accepts a complete competition", () => {
    expect(competitionFieldErrors(valid)).toEqual([]);
  });

  it("rejects an end before the start", () => {
    expect(competitionFieldErrors({ ...valid, endTime: "07:00" })).toEqual([
      "errors.invalid-times",
    ]);
  });

  it("requires the cup fields for cup competitions", () => {
    expect(
      competitionFieldErrors({ ...valid, isCupCompetition: true }),
    ).toEqual([
      "errors.cup-not-selected",
      "errors.missing-placement-points",
      "errors.missing-participation-points",
      "errors.missing-multiplier",
    ]);
  });

  it("rejects a multiplier below 0.1 but accepts 0 participation points", () => {
    expect(
      competitionFieldErrors({
        ...valid,
        isCupCompetition: true,
        cup: { _id: "c" },
        placementPoints: [{ points: 10 }],
        participationPoints: 0,
        pointsMultiplier: 0.05,
      }),
    ).toEqual(["errors.invalid-multiplier"]);
  });
});

describe("cupFields", () => {
  it("stores placement points with the multiplier applied once", () => {
    const fields = cupFields({
      cup: { _id: "c1", name: "Cup" },
      participationPoints: "2",
      pointsMultiplier: "1.5",
      placementPoints: [{ points: 20 }, { points: "10" }],
    });
    expect(fields).toEqual({
      cup_id: "c1",
      cup_name: "Cup",
      cup_participation_points: 2,
      cup_placement_points: [
        { placement: 1, points: 30 },
        { placement: 2, points: 15 },
      ],
      cup_points_multiplier: 1.5,
    });
  });
});

describe("date input helpers", () => {
  it("formats a Date as a local YYYY-MM-DD", () => {
    expect(toDateInput(new Date(2026, 5, 1, 23, 30))).toBe("2026-06-01");
    expect(toDateInput(null)).toBe("");
    expect(toDateInput("nonsense")).toBe("");
  });

  it("parses YYYY-MM-DD to local midnight", () => {
    const d = fromDateInput("2026-06-01");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(1);
    expect(d.getHours()).toBe(0);
    expect(fromDateInput("")).toBeNull();
    expect(fromDateInput("1.6.2026")).toBeNull();
  });

  it("round-trips", () => {
    expect(toDateInput(fromDateInput("2026-12-31"))).toBe("2026-12-31");
  });
});
