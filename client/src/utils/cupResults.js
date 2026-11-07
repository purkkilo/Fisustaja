// Cup standings: points from every competition of a cup added up per boat.
// Pure functions: the inputs are never modified, so they can be re-run freely.

const weightOf = (f) => Number(f.weights) || 0;

/** Total points of one result (catch weights x fish multipliers). */
export function resultPoints(result, competition) {
  return (result.fishes || []).reduce((sum, f) => {
    const fish = competition.fishes.find((cf) => cf.id === f.id);
    return sum + (fish ? weightOf(f) * fish.multiplier : 0);
  }, 0);
}

/**
 * Cup points of each returned boat in one competition.
 * cup_placement_points are stored with the cup multiplier already applied.
 */
export function competitionCupPoints(competition, results) {
  const placementPoints = competition.cup_placement_points || [];
  const participation = Number(competition.cup_participation_points) || 0;
  const ranked = results
    .filter((r) => r.returned)
    .map((r) => ({ ...r, total_points: resultPoints(r, competition) }))
    .sort((a, b) => b.total_points - a.total_points);

  let lastPoints = null;
  let lastPlacement = 0;
  return ranked.map((r, index) => {
    if (r.total_points !== lastPoints) {
      lastPlacement = index + 1;
      lastPoints = r.total_points;
    }
    const entry = placementPoints.find((p) => p.placement === lastPlacement);
    const placementCupPoints =
      entry && r.total_points > 0 ? Number(entry.points) : 0;
    return {
      placement: lastPlacement,
      boat_number: r.boat_number,
      captain_name: r.captain_name,
      temp_captain_name: r.temp_captain_name,
      locality: r.locality,
      total_points: r.total_points,
      cup_placement_points: placementCupPoints,
      cup_participation_points: participation,
      cup_points_total: placementCupPoints + participation,
    };
  });
}

/**
 * Overall cup standings.
 * @param competitions competitions to count, each with a `key_name` (1, 2, ...)
 * @param results all results (signees) of the cup's competitions
 * @param cupSignees the cup's signee list (names and localities)
 * @param limit how many best results count; the rest give participation points
 * @returns { standings, missing } where missing lists boats not in cupSignees
 */
export function calculateCupStandings(
  competitions,
  results,
  cupSignees,
  limit,
) {
  const byBoat = new Map();
  const missing = [];

  for (const competition of competitions) {
    const compResults = results.filter(
      (r) => r.competition_id === competition._id,
    );
    for (const row of competitionCupPoints(competition, compResults)) {
      let entry = byBoat.get(Number(row.boat_number));
      if (!entry) {
        const signee = cupSignees.find(
          (s) => Number(s.boat_number) === Number(row.boat_number),
        );
        if (!signee) missing.push(`(${row.boat_number}) - ${row.captain_name}`);
        entry = {
          ...row,
          captain_name: signee?.captain_name ?? row.captain_name,
          temp_captain_name: signee?.temp_captain_name ?? row.temp_captain_name,
          locality: signee?.locality ?? row.locality,
          cup_results: [],
        };
        byBoat.set(Number(row.boat_number), entry);
      }
      entry.cup_results[competition.key_name] = {
        competition: competition._id,
        key_name: competition.key_name,
        points: row.cup_points_total,
        placement: row.placement,
      };
    }
  }

  const count = Math.min(limit || competitions.length, competitions.length);
  const standings = [...byBoat.values()].map((entry) => {
    // best `count` results count fully, the others only give participation points
    const sorted = entry.cup_results
      .filter(Boolean)
      .sort((a, b) => b.points - a.points);
    let total = 0;
    sorted.forEach((r, index) => {
      if (index < count) {
        total += r.points;
      } else {
        const comp = competitions.find((c) => c._id === r.competition);
        const participation = Number(comp?.cup_participation_points) || 0;
        entry.cup_results[r.key_name] = { ...r, points: participation };
        total += participation;
      }
    });
    entry.cup_results.total = total;
    entry.final_cup_points = total;
    return entry;
  });

  standings.sort((a, b) => b.final_cup_points - a.final_cup_points);
  let lastPoints = null;
  let lastPlacement = 0;
  standings.forEach((entry, index) => {
    if (entry.final_cup_points !== lastPoints) {
      lastPlacement = index + 1;
      lastPoints = entry.final_cup_points;
    }
    entry.final_placement = lastPlacement;
  });
  return { standings, missing };
}

/**
 * Table headers for the standings: one column per competition, labelled by
 * locality (numbered if repeated) or by competition name.
 */
export function cupHeaders(competitions, labelBy = "locality") {
  const fixed = (title, key) => ({
    title,
    key,
    align: "center",
    translate: true,
    highlight: false,
    isFinished: true,
  });
  const headers = [
    fixed("placement", "final_placement"),
    fixed("boat-number", "boat_number"),
    fixed("captain-name", "captain_name"),
    fixed("locality", "locality"),
  ];
  const seen = {};
  for (const competition of competitions) {
    let title = competition.name;
    if (labelBy === "locality") {
      seen[competition.locality] = (seen[competition.locality] || 0) + 1;
      title =
        seen[competition.locality] > 1
          ? `${competition.locality} #${seen[competition.locality]}`
          : competition.locality;
    }
    headers.push({
      title,
      key: `cup_results[${competition.key_name}].points`,
      align: "center",
      translate: false,
      highlight: true,
      isFinished: competition.isFinished,
    });
  }
  headers.push(fixed("total-big", "final_cup_points"));
  return headers;
}

/** Total catch per competition and per fish species (for the statistics tab). */
export function withCatchTotals(competitions, results) {
  return competitions.map((competition) => {
    const fishes = competition.fishes.map((f) => ({ ...f, weights: 0 }));
    let total = 0;
    for (const r of results) {
      if (r.competition_id !== competition._id) continue;
      for (const f of r.fishes || []) {
        const fish = fishes.find((cf) => cf.id === f.id);
        if (fish) {
          fish.weights += weightOf(f);
          total += weightOf(f);
        }
      }
    }
    return { ...competition, fishes, total_weights: total };
  });
}
