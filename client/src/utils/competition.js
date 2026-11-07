import { validateTime } from "./format";

/** Date + "HH:mm" -> Date (local time) */
export function combineDateTime(date, time) {
  const d = new Date(date);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Checks the basic fields shared by "create competition" and "competition
 * settings". Returns translation keys of the problems found (empty = valid).
 */
export function competitionFieldErrors(f) {
  const errors = [];
  if (!f.name) errors.push("errors.missing-comp-name");
  if (!f.locality) errors.push("errors.missing-comp-locality");
  if (f.isCupCompetition) {
    if (!f.cup?._id) errors.push("errors.cup-not-selected");
    if (!f.placementPoints?.length)
      errors.push("errors.missing-placement-points");
    if (f.participationPoints === "" || f.participationPoints == null)
      errors.push("errors.missing-participation-points");
    if (!f.pointsMultiplier) errors.push("errors.missing-multiplier");
    else if (f.pointsMultiplier < 0.1) errors.push("errors.invalid-multiplier");
  }
  if (!f.startTime) errors.push("errors.missing-start-time");
  else if (!validateTime(f.startTime)) errors.push("errors.invalid-time");
  if (!f.endTime) errors.push("errors.missing-end-time");
  else if (!validateTime(f.endTime)) errors.push("errors.invalid-time");
  if (!f.startDate || isNaN(new Date(f.startDate)))
    errors.push("errors.missing-start-date");
  if (!f.endDate || isNaN(new Date(f.endDate)))
    errors.push("errors.missing-end-date");
  if (!errors.length) {
    const start = combineDateTime(f.startDate, f.startTime);
    const end = combineDateTime(f.endDate, f.endTime);
    if (end < start) errors.push("errors.invalid-times");
  }
  return errors;
}

/** The cup fields saved on a competition (placement points include the multiplier). */
export function cupFields(f) {
  const multiplier = Number(f.pointsMultiplier);
  return {
    cup_id: f.cup._id,
    cup_name: f.cup.name,
    cup_participation_points: Number(f.participationPoints),
    cup_placement_points: f.placementPoints.map((p, i) => ({
      placement: i + 1,
      points: Number(p.points) * multiplier,
    })),
    cup_points_multiplier: multiplier,
  };
}
