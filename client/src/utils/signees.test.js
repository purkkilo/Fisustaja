import { describe, expect, it } from "vitest";
import {
  boatNumberClash,
  nextBoatNumber,
  normalizeSignee,
  signeeToForm,
  TEAM_MAX_LENGTH,
} from "./signees";

describe("normalizeSignee", () => {
  it("trims, capitalizes and fills optional fields with '-'", () => {
    const { errors, signee } = normalizeSignee({
      boat_number: "7",
      captain_name: "  matti meikäläinen ",
      temp_captain_name: "",
      locality: "lahti",
      starting_place: " ",
      team: "",
    });
    expect(errors).toEqual([]);
    expect(signee).toEqual({
      boat_number: 7,
      captain_name: "Matti Meikäläinen",
      temp_captain_name: "-",
      locality: "Lahti",
      starting_place: "-",
      team: "-",
    });
  });

  it("reports every missing required field", () => {
    expect(normalizeSignee({ boat_number: "0" }).errors).toEqual([
      "errors.missing-number",
      "errors.missing-captain",
      "errors.missing-locality",
    ]);
  });

  it("shortens a too long team name and reports it", () => {
    const { errors, signee } = normalizeSignee({
      boat_number: 1,
      captain_name: "a",
      locality: "b",
      team: "x".repeat(TEAM_MAX_LENGTH + 5),
    });
    expect(errors).toEqual(["errors.team-too-long"]);
    expect(signee.team).toHaveLength(TEAM_MAX_LENGTH);
  });
});

describe("boatNumberClash", () => {
  const signees = [
    { _id: "a", boat_number: "1", captain_name: "Matti" },
    { _id: "b", boat_number: 2, captain_name: "Liisa" },
  ];

  it("is free when no boat has the number", () => {
    expect(boatNumberClash(signees, 3)).toEqual({
      status: "free",
      clash: null,
    });
  });

  it("asks before overwriting when a new boat takes a used number", () => {
    // "1" (string) and 1 (number) are the same boat number
    const { status, clash } = boatNumberClash(signees, 1);
    expect(status).toBe("confirm-replace");
    expect(clash._id).toBe("a");
  });

  it("blocks editing a boat onto another boat's number", () => {
    expect(boatNumberClash(signees, "2", "a").status).toBe("blocked");
  });

  it("lets a boat keep its own number when edited", () => {
    expect(boatNumberClash(signees, 1, "a").status).toBe("free");
  });
});

describe("nextBoatNumber", () => {
  it("is one past the highest number in use", () => {
    expect(nextBoatNumber([{ boat_number: "3" }, { boat_number: 12 }])).toBe(
      13,
    );
  });

  it("starts from 1", () => {
    expect(nextBoatNumber([])).toBe(1);
    expect(nextBoatNumber(undefined)).toBe(1);
  });
});

describe("signeeToForm", () => {
  it("copies only the form fields, with empty defaults", () => {
    expect(
      signeeToForm({ _id: "x", boat_number: 5, captain_name: "A" }),
    ).toEqual({
      boat_number: 5,
      captain_name: "A",
      temp_captain_name: "",
      locality: "",
      starting_place: "",
      team: "",
    });
  });
});
