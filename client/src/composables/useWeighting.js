import { computed, ref } from "vue";
import CompetitionService from "@/services/CompetitionService";
import ResultService from "@/services/ResultService";
import FishService from "@/services/FishService";
import { useMainStore } from "@/store";
import { rankByPoints } from "@/utils/results";

/**
 * State and actions of the weighing page: the competition's boats, the boat
 * being weighed, its catch per fish species and the biggest single fish.
 */
export function useWeighting() {
  const store = useMainStore();

  const competition = ref(null);
  const signees = ref([]);
  const loadingSite = ref(true); // first load
  const refreshing = ref(false);
  const saving = ref(false);
  const savingFish = ref(false);
  const notification = ref(null); // translation key of the last success message

  // the boat being weighed and the weights typed in for it
  const selectedBoat = ref(null);
  const searched = ref(false);
  const weights = ref([]); // [{ id, name, multiplier, value }]

  // biggest single fish of the boat
  const biggestFishName = ref(null);
  const biggestFishWeight = ref(null);
  // biggest single fishes saved so far in this competition
  const biggestFishes = ref([]);

  // ---- derived ----
  const boatsByNumber = computed(() =>
    [...signees.value].sort((a, b) => a.boat_number - b.boat_number),
  );
  const leaderboard = computed(() => rankByPoints(signees.value));
  const placements = computed(
    () => new Map(leaderboard.value.map((s) => [s.boat_number, s.placement])),
  );
  const stillOnWater = computed(() => signees.value.filter((s) => !s.returned));
  const returned = computed(() => signees.value.filter((s) => s.returned));
  const allReturned = computed(() => stillOnWater.value.length === 0);

  /** Heaviest saved single fish per species name. */
  const biggestByName = computed(() => {
    const best = {};
    for (const f of biggestFishes.value) {
      const w = Number(f.weight) || 0;
      if (!best[f.name] || w > best[f.name].weight) {
        best[f.name] = { weight: w, boat_number: f.boat_number };
      }
    }
    return best;
  });
  // the typed biggest fish beats the current leader of its species
  const isNewBiggest = computed(() => {
    const w = parseInt(biggestFishWeight.value) || 0;
    if (!biggestFishName.value || !w) return false;
    return w > (biggestByName.value[biggestFishName.value]?.weight ?? 0);
  });

  /**
   * Standings of the boats that have come back, with the boat being weighed
   * placed where its typed weights would put it (marked preview: true).
   */
  const liveStandings = computed(() => {
    const current = selectedBoat.value;
    const rows = signees.value
      .filter((s) => s.returned && s._id !== current?._id)
      .map((s) => ({ ...s, preview: false }));
    if (current && totalPoints.value > 0) {
      rows.push({ ...current, total_points: totalPoints.value, preview: true });
    }
    return rankByPoints(rows);
  });

  const totalWeight = computed(() =>
    weights.value.reduce((sum, w) => sum + (parseInt(w.value) || 0), 0),
  );
  const totalPoints = computed(() =>
    weights.value.reduce(
      (sum, w) => sum + (parseInt(w.value) || 0) * w.multiplier,
      0,
    ),
  );
  // Where the boat would place with the weights typed in so far
  const previewPlacement = computed(() => {
    const others = leaderboard.value.filter(
      (s) => s._id !== selectedBoat.value?._id,
    );
    const tie = others.find((s) => s.total_points === totalPoints.value);
    if (tie) return tie.placement;
    const index = others.findIndex((s) => totalPoints.value > s.total_points);
    return (index === -1 ? others.length : index) + 1;
  });

  function pointsOf(signee) {
    return signee.fishes.reduce((sum, f) => {
      const fish = competition.value.fishes.find((cf) => cf.id === f.id);
      return sum + (fish ? f.weights * fish.multiplier : 0);
    }, 0);
  }

  // ---- loading ----
  async function load(competitionId) {
    refreshing.value = true;
    try {
      const found = await CompetitionService.getById(competitionId);
      competition.value = found;
      const results = await ResultService.list({
        competition_id: found._id,
      });
      for (const s of results) s.total_points = pointsOf(s);
      signees.value = results;
      // one object shared with the store (also after state changes), so the
      // competition header's boat counts stay live
      found.signees = results;
      store.refreshCompetition(found);
      weights.value = found.fishes.map((fish) => ({
        id: fish.id,
        name: fish.name,
        multiplier: fish.multiplier,
        minsize: fish.minsize,
        value: null,
      }));
      biggestFishes.value = await FishService.list({
        competition_id: found._id,
      });
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
    } finally {
      loadingSite.value = false;
      refreshing.value = false;
    }
  }

  // ---- selecting a boat ----
  function selectBoat(boat) {
    if (!boat || boat.boat_number === -1) {
      clear();
      return;
    }
    searched.value = true;
    notification.value = null;
    // always work on the boat object from the list, not a copy
    selectedBoat.value =
      signees.value.find((s) => s.boat_number === boat.boat_number) || null;
    for (const w of weights.value) {
      const caught = selectedBoat.value?.fishes.find((f) => f.id === w.id);
      w.value = caught ? caught.weights : null;
    }
  }

  function clear() {
    for (const w of weights.value) w.value = null;
    selectedBoat.value = null;
    biggestFishName.value = null;
    biggestFishWeight.value = null;
    searched.value = false;
  }

  // ---- saving ----
  async function saveBiggestFish() {
    const boat = selectedBoat.value;
    if (!biggestFishName.value || !boat || !biggestFishWeight.value)
      return false;
    const compFish = competition.value.fishes.find(
      (cf) => cf.name === biggestFishName.value,
    );
    savingFish.value = true;
    try {
      const existing = await FishService.list({
        boat_number: boat.boat_number,
        competition_id: boat.competition_id,
        fish_id: compFish.id,
      });
      if (existing.length) {
        await FishService.updateFish(existing[0]._id, {
          ...existing[0],
          weight: biggestFishWeight.value,
        });
      } else {
        await FishService.insertFishes([
          {
            fish_id: compFish.id,
            boat_number: boat.boat_number,
            captain_name: boat.captain_name,
            name: biggestFishName.value,
            weight: biggestFishWeight.value,
            competition_id: boat.competition_id,
            cup_id: boat.cup_id,
          },
        ]);
      }
      notification.value = "notification.updated";
      biggestFishes.value = [
        ...biggestFishes.value.filter(
          (f) =>
            !(f.boat_number === boat.boat_number && f.fish_id === compFish.id),
        ),
        {
          fish_id: compFish.id,
          name: compFish.name,
          boat_number: boat.boat_number,
          weight: biggestFishWeight.value,
        },
      ];
      biggestFishName.value = null;
      biggestFishWeight.value = null;
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    } finally {
      savingFish.value = false;
    }
  }

  // Saves the typed weights (or clears them with reset = true)
  async function saveCatch({ reset = false } = {}) {
    const boat = selectedBoat.value;
    if (!boat) return;
    // a biggest fish typed in but not saved yet is saved too
    if (biggestFishName.value && biggestFishWeight.value) {
      await saveBiggestFish();
    }

    const fishes = reset
      ? []
      : weights.value
          .map((w) => ({ id: w.id, weights: parseInt(w.value) || 0 }))
          .filter((f) => f.weights);
    boat.returned = !reset;
    boat.fishes = fishes;
    boat.total_points = pointsOf(boat);

    saving.value = true;
    try {
      await ResultService.updateResult(boat._id, boat);
      const state = stillOnWater.value.length ? "weighting" : "all-finished";
      if (competition.value.state !== state) {
        competition.value.state = state;
        store.refreshCompetition(competition.value);
        await CompetitionService.updateValues(competition.value._id, {
          $set: { state },
        });
      }
      clear();
      notification.value = "notification.updated";
    } catch (err) {
      console.log(err.message);
    } finally {
      saving.value = false;
    }
  }

  function selectBoatByNumber(number) {
    const boat = signees.value.find(
      (s) => Number(s.boat_number) === Number(number),
    );
    if (boat) selectBoat(boat);
    return !!boat;
  }

  // The boat came back without fish: returned, no catch
  function returnWithoutCatch() {
    for (const w of weights.value) w.value = null;
    return saveCatch();
  }

  // "Set all boats as returned"
  async function markAllReturned() {
    const boats = stillOnWater.value;
    saving.value = true;
    try {
      await ResultService.updateManyResults(
        boats.map((b) => b._id),
        { $set: { returned: true } },
      );
      boats.forEach((b) => (b.returned = true));
      return true;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    competition,
    signees,
    loadingSite,
    refreshing,
    saving,
    savingFish,
    notification,
    selectedBoat,
    searched,
    weights,
    biggestFishName,
    biggestFishWeight,
    biggestFishes,
    biggestByName,
    isNewBiggest,
    liveStandings,
    boatsByNumber,
    leaderboard,
    placements,
    stillOnWater,
    returned,
    allReturned,
    totalWeight,
    totalPoints,
    previewPlacement,
    load,
    selectBoat,
    selectBoatByNumber,
    returnWithoutCatch,
    clear,
    saveBiggestFish,
    saveCatch,
    markAllReturned,
  };
}
