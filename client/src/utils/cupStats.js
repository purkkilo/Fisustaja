// Numbers behind the cup statistics charts. Pure functions.
import { calculateCupStandings } from "./cupResults";

/**
 * How the cup standings developed: each top boat's cup points after every
 * competition, counted with the same "best N" rule as the final standings.
 * @param {Array} competitions  counted competitions, in date order
 * @returns {{ labels: string[], boats: Array<{ label, data: number[] }> }}
 */
export function standingsProgress(
  competitions,
  results,
  cupSignees,
  limit,
  top = 8,
) {
  const comps = competitions || [];
  if (!comps.length) return { labels: [], boats: [] };

  const final = calculateCupStandings(comps, results, cupSignees, limit);
  const leaders = final.standings.slice(0, top);

  // standings after the first 1, 2, ... competitions
  const totals = comps.map((_, i) => {
    const prefix = comps.slice(0, i + 1);
    const { standings } = calculateCupStandings(
      prefix,
      results,
      cupSignees,
      Math.min(limit || prefix.length, prefix.length),
    );
    return new Map(
      standings.map((s) => [Number(s.boat_number), s.final_cup_points]),
    );
  });

  return {
    labels: comps.map((c) => c.locality || c.name),
    boats: leaders.map((entry) => ({
      label: `${entry.captain_name} (${entry.boat_number})`,
      data: totals.map((t) => t.get(Number(entry.boat_number)) ?? 0),
    })),
  };
}

/**
 * Kilograms caught in each competition, split by species (matched by name,
 * so the same species stacks the same way in every competition).
 * @returns {{ labels: string[], species: Array<{ name, color, data: number[] }> }}
 */
export function catchByCompetition(competitions, results) {
  const comps = competitions || [];
  const species = new Map(); // name -> { name, color, data }

  comps.forEach((competition, index) => {
    const own = (results || []).filter(
      (r) => r.competition_id === competition._id,
    );
    for (const fish of competition.fishes || []) {
      if (!species.has(fish.name)) {
        species.set(fish.name, {
          name: fish.name,
          color: fish.color,
          data: comps.map(() => 0),
        });
      }
      let grams = 0;
      for (const r of own) {
        const caught = (r.fishes || []).find((f) =>
          f.id != null && fish.id != null
            ? f.id === fish.id
            : f.name === fish.name,
        );
        grams += Number(caught?.weights) || 0;
      }
      species.get(fish.name).data[index] += Math.round(grams / 10) / 100;
    }
  });

  return {
    labels: comps.map((c) => c.locality || c.name),
    species: [...species.values()].filter((s) => s.data.some((v) => v > 0)),
  };
}
