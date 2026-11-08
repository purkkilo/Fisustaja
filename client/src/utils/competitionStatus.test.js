import { describe, expect, it } from "vitest";
import {
  competitionClock,
  competitionPhase,
  competitionStatus,
  formatRemaining,
  nextCompetition,
  pickTodaysCompetition,
} from "./competitionStatus";

// Saturday 13.6.2026, 12:18 local time
const now = new Date(2026, 5, 13, 12, 18);
const comp = (overrides = {}) => ({
  _id: "c",
  start_date: new Date(2026, 5, 13, 8, 0),
  end_date: new Date(2026, 5, 13, 14, 0),
  state: "signing",
  isFinished: false,
  ...overrides,
});

describe("competitionPhase", () => {
  it("is before, running or ended by the clock", () => {
    expect(competitionPhase(comp(), new Date(2026, 5, 13, 7, 0))).toBe(
      "before",
    );
    expect(competitionPhase(comp(), now)).toBe("running");
    expect(competitionPhase(comp(), new Date(2026, 5, 13, 15, 0))).toBe(
      "ended",
    );
  });
});

describe("competitionStatus", () => {
  const key = (c, at = now) => competitionStatus(c, at).key;

  it("follows the stored state first", () => {
    expect(key(comp({ isFinished: true }))).toBe("finished");
    expect(key(comp({ state: "ended" }))).toBe("finished");
    expect(key(comp({ state: "weighting" }))).toBe("weighing");
    expect(key(comp({ state: "all-finished" }))).toBe("all-returned");
    expect(key(comp({ state: "not-finished" }))).toBe("unfinished");
  });

  it("falls back to the clock for a signing competition", () => {
    expect(key(comp(), new Date(2026, 5, 12))).toBe("upcoming");
    expect(key(comp())).toBe("running");
    expect(key(comp(), new Date(2026, 5, 14))).toBe("unfinished");
  });

  it("uses the step colours", () => {
    expect(competitionStatus(comp({ state: "weighting" }), now)).toEqual({
      key: "weighing",
      label: "comp-status.weighing",
      color: "weighing",
    });
    expect(competitionStatus(comp({ isFinished: true }), now).color).toBe(
      "results",
    );
  });
});

describe("pickTodaysCompetition", () => {
  it("prefers a running competition", () => {
    const morning = comp({
      _id: "later",
      start_date: new Date(2026, 5, 13, 16, 0),
      end_date: new Date(2026, 5, 13, 20, 0),
    });
    expect(pickTodaysCompetition([morning, comp()], now)._id).toBe("c");
  });

  it("keeps a competition being weighed after its end time", () => {
    const afternoon = new Date(2026, 5, 13, 15, 30);
    expect(
      pickTodaysCompetition([comp({ state: "weighting" })], afternoon)._id,
    ).toBe("c");
  });

  it("ignores finished and other days' competitions", () => {
    expect(
      pickTodaysCompetition(
        [
          comp({ isFinished: true }),
          comp({
            start_date: new Date(2026, 5, 20, 8),
            end_date: new Date(2026, 5, 20, 14),
          }),
        ],
        now,
      ),
    ).toBeNull();
  });
});

describe("nextCompetition", () => {
  it("is the soonest one that hasn't started", () => {
    const soon = comp({ _id: "soon", start_date: new Date(2026, 5, 20, 8) });
    const later = comp({ _id: "later", start_date: new Date(2026, 6, 11, 8) });
    expect(nextCompetition([later, comp(), soon], now)._id).toBe("soon");
    expect(nextCompetition([comp()], now)).toBeNull();
  });
});

describe("formatRemaining", () => {
  it("shows hours and minutes, rounding up", () => {
    expect(formatRemaining((1 * 60 + 41) * 60000 + 1000)).toBe("1:42");
    expect(formatRemaining(5 * 60000)).toBe("0:05");
    expect(formatRemaining(-1000)).toBe("0:00");
  });

  it("adds days when over 24 hours", () => {
    expect(formatRemaining((26 * 60 + 5) * 60000, "d")).toBe("1 d 2:05");
  });
});

describe("competitionClock", () => {
  it("counts to the start, then to the end, then stops", () => {
    expect(competitionClock(comp(), new Date(2026, 5, 13, 7, 30))).toEqual({
      phase: "before",
      labelKey: "timer.to-start",
      text: "0:30",
    });
    expect(competitionClock(comp(), now).text).toBe("1:42");
    expect(competitionClock(comp(), new Date(2026, 5, 13, 15)).text).toBe("");
  });
});
