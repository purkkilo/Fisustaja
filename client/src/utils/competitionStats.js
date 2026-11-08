// Numbers behind the competition statistics charts. Pure functions: pass the
// competition and its results (signees with fishes), get plain data back.

const toNumber = (value) => Number(value) || 0;

/** Catch of one species in a signee's fishes, matched by id (name as fallback). */
function caughtWeight(signee, fish) {
  const found = (signee.fishes || []).find((f) =>
    f.id != null && fish.id != null ? f.id === fish.id : f.name === fish.name,
  );
  return toNumber(found?.weights);
}

/**
 * Points and weight per species, most points first.
 * Points (weight × multiplier) decide the competition, so they are the bar;
 * the weight goes in the label.
 */
export function speciesPoints(competition, results) {
  return (competition?.fishes || [])
    .map((fish) => {
      const weight = (results || []).reduce(
        (sum, s) => sum + caughtWeight(s, fish),
        0,
      );
      const multiplier = toNumber(fish.multiplier) || 1;
      return {
        name: fish.name,
        color: fish.color,
        multiplier,
        weight,
        points: Math.round(weight * multiplier),
      };
    })
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

/**
 * Top boats with their points split by species: how each boat got its score.
 * @returns {{ boats: Array<{ label, total }>, species: Array<{ name, color, data }> }}
 */
export function topBoatsBySpecies(competition, results, top = 10) {
  const fishes = competition?.fishes || [];
  const boats = [...(results || [])]
    .filter((s) => toNumber(s.total_points) > 0)
    .sort((a, b) => toNumber(b.total_points) - toNumber(a.total_points))
    .slice(0, top);

  const species = fishes
    .map((fish) => {
      const multiplier = toNumber(fish.multiplier) || 1;
      return {
        name: fish.name,
        color: fish.color,
        data: boats.map((s) => Math.round(caughtWeight(s, fish) * multiplier)),
      };
    })
    // a species nobody in the top caught only clutters the legend
    .filter((s) => s.data.some((v) => v > 0));

  return {
    boats: boats.map((s) => ({
      label: `${s.placement ?? ""}${s.placement ? ". " : ""}${s.captain_name} (${s.boat_number})`,
      total: toNumber(s.total_points),
    })),
    species,
  };
}

/** 1, 2 or 5 × 10^n, the smallest such step that is >= raw. */
export function niceStep(raw) {
  if (!(raw > 0)) return 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 5, 10]) {
    if (m * power >= raw) return m * power;
  }
  return 10 * power;
}

/**
 * How many boats scored how much. Boats without a catch get their own "0"
 * bar, so they don't hide inside the lowest range.
 * @returns {Array<{ from, to, count }>} from = to = 0 for the zero bar
 */
export function pointsHistogram(points, targetBins = 6) {
  const values = (points || []).map(toNumber);
  if (!values.length) return [];
  const zero = values.filter((v) => v <= 0).length;
  const positive = values.filter((v) => v > 0);
  const bins = [{ from: 0, to: 0, count: zero }];
  if (!positive.length) return bins;

  const step = niceStep(Math.max(...positive) / targetBins);
  const count = Math.ceil(Math.max(...positive) / step);
  for (let i = 0; i < count; i++) {
    bins.push({ from: i * step + 1, to: (i + 1) * step, count: 0 });
  }
  for (const v of positive) {
    const index = Math.min(Math.ceil(v / step), count); // (0, step] -> 1
    bins[index].count++;
  }
  return bins;
}

/**
 * Every recorded biggest-fish weight, grouped by species, with the record of
 * each species marked.
 * @param {Array} fishes  biggest fish entries: { name, weight, boat_number, captain_name }
 */
export function biggestFishBySpecies(competition, fishes) {
  const order = (competition?.fishes || []).map((f) => f.name);
  const groups = new Map(order.map((name) => [name, []]));
  for (const fish of fishes || []) {
    if (!(toNumber(fish.weight) > 0)) continue;
    if (!groups.has(fish.name)) groups.set(fish.name, []);
    groups.get(fish.name).push(fish);
  }
  const colorOf = (name) =>
    (competition?.fishes || []).find((f) => f.name === name)?.color;

  return [...groups.entries()]
    .filter(([, list]) => list.length)
    .map(([name, list]) => {
      const sorted = [...list].sort(
        (a, b) => toNumber(b.weight) - toNumber(a.weight),
      );
      return {
        name,
        color: colorOf(name),
        record: sorted[0],
        fishes: sorted.map((f, i) => ({
          weight: toNumber(f.weight),
          boat_number: f.boat_number,
          captain_name: f.captain_name,
          record: i === 0,
        })),
      };
    });
}

/**
 * Catch arriving over the day: cumulative kilograms after each weighed boat.
 * Needs weighed_at on the results (saved since race day); boats without it
 * are left out.
 * @returns {Array<{ time: Date, kg, boats }>}
 */
export function catchTimeline(results) {
  const weighed = (results || [])
    .filter((s) => s.weighed_at && !isNaN(new Date(s.weighed_at)))
    .map((s) => ({
      time: new Date(s.weighed_at),
      grams: (s.fishes || []).reduce((sum, f) => sum + toNumber(f.weights), 0),
    }))
    .sort((a, b) => a.time - b.time);

  let grams = 0;
  return weighed.map((w, i) => {
    grams += w.grams;
    return { time: w.time, kg: Math.round(grams / 10) / 100, boats: i + 1 };
  });
}

/**
 * The key numbers shown as tiles on the statistics page and in its PDF.
 * Labels are translation keys; values are formatted for `lang`.
 */
export function statsSummary(
  competition,
  signees,
  hasGottenFishCount,
  lang = "fi-FI",
) {
  const boats = (signees || []).length;
  const pct = boats ? Math.round((hasGottenFishCount / boats) * 100) : 0;
  const kg = toNumber(competition?.total_weights) / 1000;
  const tiles = [
    {
      key: "boats",
      label: "total-signees",
      value: boats.toLocaleString(lang),
      tone: "signing",
    },
    {
      key: "got-fish",
      label: "comp-overview.gotten-fish",
      value: pct.toLocaleString(lang),
      unit: "%",
      progress: pct,
      note: `${hasGottenFishCount} / ${boats}`,
      tone: "weighing",
    },
    {
      key: "total",
      label: "total-amount",
      value: kg.toLocaleString(lang, { maximumFractionDigits: 2 }),
      unit: "kg",
      tone: "results",
    },
  ];
  if (competition?.isCupCompetition) {
    tiles.push({
      key: "cup",
      label: "overview-page.cup-multiplier",
      value: `× ${toNumber(competition.cup_points_multiplier).toLocaleString(lang)}`,
      tone: "plain",
    });
  }
  return tiles;
}

/**
 * Charts for the PDF in rows: wide charts get a row of their own, the others
 * go two to a row in the given order.
 * @param {Array<{ id, wide?: boolean }>} charts
 * @returns {Array<Array>} rows
 */
export function chartRows(charts) {
  const rows = [];
  let pending = null;
  for (const chart of charts) {
    if (chart.wide) {
      if (pending) rows.push([pending]);
      pending = null;
      rows.push([chart]);
    } else if (pending) {
      rows.push([pending, chart]);
      pending = null;
    } else {
      pending = chart;
    }
  }
  if (pending) rows.push([pending]);
  return rows;
}
