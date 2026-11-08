import { nextTick, ref } from "vue";
import CupService from "@/services/CupService";
import CompetitionService from "@/services/CompetitionService";
import ResultService from "@/services/ResultService";
import FishService from "@/services/FishService";
import { useMainStore } from "@/store";
import { alert } from "@/plugins/alerts";
import { calculateCupStandings, cupHeaders } from "@/utils/cupResults";
import { sortBy } from "@/utils/format";
import { saveCupAsPDF } from "@/pdf";

/**
 * Loads a cup with its competitions, results and catches, and calculates the
 * cup standings. Shared by the cup overview (admin) and public cups pages.
 * @param publicOnly only count public competitions
 */
export function useCupStandings({ publicOnly = false } = {}) {
  const store = useMainStore();

  const loading = ref(false);
  const cup = ref(null);
  const allCompetitions = ref([]); // every competition of the cup, by date
  const competitions = ref([]); // the ones counted in the standings
  const allResults = ref([]); // results (signees) of all competitions
  const signees = ref([]); // the cup's signee list, by boat number
  const biggestFishes = ref([]);
  const biggestAmounts = ref([]);

  const standings = ref([]);
  const headers = ref([]);
  const isResults = ref(false);
  const selectNumbers = ref([]);
  const selectedCompetitions = ref(0);
  const showUnfinishedCompetitions = ref(false);
  const headerLabel = ref("locality");

  const snackbar = ref(false);
  const text = ref("");
  function notify(message) {
    text.value = message;
    snackbar.value = false;
    nextTick(() => (snackbar.value = true));
  }

  async function load(cupOrId) {
    loading.value = true;
    try {
      const found =
        typeof cupOrId === "string"
          ? await CupService.getById(
              cupOrId,
              publicOnly ? { isPublic: true } : {},
            )
          : cupOrId;
      cup.value = found;
      store.refreshCup(found);

      const query = {
        cup_id: found._id,
        ...(publicOnly ? { isPublic: true } : {}),
      };
      const [comps, fishes, results] = await Promise.all([
        CompetitionService.list(query),
        FishService.list(query),
        ResultService.list(query),
      ]);
      allCompetitions.value = comps
        .map((c) => ({
          ...c,
          start_date: new Date(c.start_date),
          end_date: new Date(c.end_date),
        }))
        .sort((a, b) => a.start_date - b.start_date)
        .map((c, i) => ({ ...c, key_name: i + 1 }));
      biggestFishes.value = [...fishes].sort((a, b) => b.weight - a.weight);
      allResults.value = results.filter((r) =>
        allCompetitions.value.some((c) => c._id === r.competition_id),
      );
      biggestAmounts.value = collectAmounts(allResults.value);
      setCompetitionData();
    } catch (err) {
      cup.value = null;
      console.error(err.response?.data?.error || err.message);
    } finally {
      loading.value = false;
    }
  }

  // Every catch of every boat per fish species, biggest first
  function collectAmounts(results) {
    const amounts = [];
    for (const r of results) {
      const comp = allCompetitions.value.find(
        (c) => c._id === r.competition_id,
      );
      for (const f of r.fishes || []) {
        const fish = comp?.fishes.find((cf) => cf.id === f.id);
        if (!fish) continue;
        amounts.push({
          id: fish.id,
          competition_id: comp._id,
          competition_name: comp.name,
          boat_number: r.boat_number,
          captain_name: r.captain_name,
          name: fish.name,
          weight: f.weights,
        });
      }
    }
    return amounts.sort((a, b) => b.weight - a.weight);
  }

  // Which competitions count, and how many of them (cup setting)
  function setCompetitionData() {
    signees.value = [...(cup.value.signees || [])].sort(
      sortBy("boat_number", true),
    );
    competitions.value = showUnfinishedCompetitions.value
      ? [...allCompetitions.value]
      : allCompetitions.value.filter((c) => c.isFinished);
    selectNumbers.value = competitions.value.map((_, i) => i + 1);
    selectedCompetitions.value =
      cup.value.meaningful_competitions > 0
        ? cup.value.meaningful_competitions
        : competitions.value.length;
    recalculate();
  }

  function recalculate(limit = selectedCompetitions.value) {
    selectedCompetitions.value = limit;
    const result = calculateCupStandings(
      competitions.value,
      allResults.value,
      signees.value,
      limit,
    );
    standings.value = result.standings;
    isResults.value = result.standings.length > 0;
    headers.value = cupHeaders(competitions.value, headerLabel.value);
    if (result.missing.length) {
      alert(`${result.missing.join(", ")}: not found in the cup's signees`);
    }
  }

  function setHeaderLabel(label) {
    headerLabel.value = label;
    headers.value = cupHeaders(competitions.value, label);
  }

  function setShowUnfinished(show) {
    showUnfinishedCompetitions.value = show;
    setCompetitionData();
  }

  // tableTitle "Tulokset" = standings, anything else = signee list
  async function savePdf(
    tableTitle,
    { isLandscape = false, showInfoInPdf = false } = {},
  ) {
    await saveCupAsPDF(
      tableTitle,
      isLandscape,
      cup.value,
      competitions.value,
      showUnfinishedCompetitions.value,
      showInfoInPdf,
      selectedCompetitions.value,
      headers.value,
      standings.value,
      signees.value,
    );
  }

  function clear() {
    cup.value = null;
    allCompetitions.value = [];
    competitions.value = [];
    standings.value = [];
  }

  return {
    loading,
    cup,
    allCompetitions,
    competitions,
    allResults,
    signees,
    biggestFishes,
    biggestAmounts,
    standings,
    headers,
    isResults,
    selectNumbers,
    selectedCompetitions,
    showUnfinishedCompetitions,
    snackbar,
    text,
    notify,
    load,
    setCompetitionData,
    recalculate,
    setHeaderLabel,
    setShowUnfinished,
    savePdf,
    clear,
  };
}
