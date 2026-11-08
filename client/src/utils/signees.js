// Signee (boat) form helpers shared by the signing views.
import { capitalize_words } from "./format";

export const TEAM_MAX_LENGTH = 40;

export const emptySigneeForm = () => ({
  boat_number: null,
  captain_name: "",
  temp_captain_name: "",
  locality: "",
  starting_place: "",
  team: "",
});

const clean = (v) => String(v ?? "").trim();

/**
 * Validate and normalise a signee form.
 * @returns {{ errors: string[], signee: object }} errors are i18n keys
 */
export function normalizeSignee(form) {
  const errors = [];
  const boatNumber = parseInt(form.boat_number);
  if (!(boatNumber > 0)) errors.push("errors.missing-number");

  const captain = clean(form.captain_name);
  if (!captain) errors.push("errors.missing-captain");

  const locality = clean(form.locality);
  if (!locality) errors.push("errors.missing-locality");

  let team = clean(form.team);
  if (team.length > TEAM_MAX_LENGTH) {
    team = team.slice(0, TEAM_MAX_LENGTH);
    errors.push("errors.team-too-long");
  }

  return {
    errors,
    signee: {
      boat_number: boatNumber,
      captain_name: capitalize_words(captain),
      temp_captain_name: capitalize_words(clean(form.temp_captain_name)) || "-",
      locality: capitalize_words(locality),
      starting_place: clean(form.starting_place) || "-",
      team: team || "-",
    },
  };
}

/** Copy the editable fields of a signee into a form object. */
export function signeeToForm(signee) {
  const form = emptySigneeForm();
  for (const key of Object.keys(form)) form[key] = signee?.[key] ?? form[key];
  return form;
}

/**
 * What saving `boatNumber` means when `editingId` is the signee being edited
 * (null when adding a new boat):
 * - "free": no other boat has the number
 * - "blocked": editing a boat onto another boat's number (never allowed)
 * - "confirm-replace": adding a boat whose number is taken; ask whether to
 *   overwrite the existing boat's details
 * @returns {{ status: "free" | "blocked" | "confirm-replace", clash: object | null }}
 */
export function boatNumberClash(signees, boatNumber, editingId = null) {
  const clash =
    (signees || []).find(
      (s) =>
        Number(s.boat_number) === Number(boatNumber) && s._id !== editingId,
    ) ?? null;
  if (!clash) return { status: "free", clash: null };
  return { status: editingId ? "blocked" : "confirm-replace", clash };
}

/** First free boat number after the highest one in use. */
export function nextBoatNumber(signees) {
  const numbers = (signees || []).map((s) => Number(s.boat_number) || 0);
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}
