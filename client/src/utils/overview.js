// Numbers for the competition overview page. Pure: pass the competition
// and its results (signees with their fishes).

const round = (value, decimals = 0) => {
  const f = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * f) / f;
};

/**
 * @param {object} competition  with fishes [{ name, multiplier, minsize, color }]
 * @param {Array} results       signees: { returned, fishes: [{ name, weights }] }
 */
export function competitionSummary(competition, results) {
  const list = results || [];
  const boats = list.length;
  const returned = list.filter((s) => s.returned).length;
  const withFish = list.filter((s) =>
    (s.fishes || []).some((f) => Number(f.weights) > 0),
  ).length;

  const weights = new Map();
  for (const signee of list) {
    for (const fish of signee.fishes || []) {
      weights.set(
        fish.name,
        (weights.get(fish.name) || 0) + (Number(fish.weights) || 0),
      );
    }
  }
  const totalWeight = [...weights.values()].reduce((a, b) => a + b, 0);

  const species = (competition?.fishes || []).map((fish) => {
    const weight = weights.get(fish.name) || 0;
    return {
      name: fish.name,
      multiplier: Number(fish.multiplier) || 1,
      minsize: fish.minsize,
      color: fish.color,
      weight,
      points: round(weight * (Number(fish.multiplier) || 1)),
      share: totalWeight ? round((weight / totalWeight) * 100, 1) : 0,
    };
  });
  species.sort((a, b) => b.weight - a.weight);

  return {
    boats,
    returned,
    onWater: boats - returned,
    returnedPct: boats ? round((returned / boats) * 100) : 0,
    withFish,
    withFishPct: boats ? round((withFish / boats) * 100) : 0,
    totalWeight,
    species,
  };
}

/** Grams as "12,3 kg" style text in the given locale. */
export function formatKg(grams, lang = "fi-FI") {
  return (grams / 1000).toLocaleString(lang, { maximumFractionDigits: 2 });
}
