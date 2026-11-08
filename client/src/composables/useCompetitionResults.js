import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import CompetitionService from "@/services/CompetitionService";
import ResultService from "@/services/ResultService";
import FishService from "@/services/FishService";
import { useMainStore } from "@/store";
import { useTheme } from "vuetify";
import {
  calculateBiggestAmounts,
  calculateBiggestFishes,
  calculateNormalResults,
} from "@/utils/results";
import { getPdfInkSaver, setPdfInkSaver } from "@/utils/pdfPreferences";

// jsPDF, its fonts and chart.js load only when a PDF is made
const loadPdf = () => import("@/pdf");
const loadLiveCharts = () => import("@/utils/charts");

const NORMAL_HEADERS = [
  { title: "placement", key: "placement" },
  { title: "boat-number", key: "boat_number" },
  { title: "captain-name", key: "captain_name" },
  { title: "temp-captain-name", key: "temp_captain_name" },
  { title: "locality", key: "locality" },
  { title: "points", key: "total_points" },
  { title: "results-page.behind", key: "points_behind", align: "end" },
];
const CUP_HEADERS = [
  ...NORMAL_HEADERS,
  { title: "cup.normal", key: "cup_points_total" },
];
const TEAM_HEADERS = [
  { title: "placement", key: "placement" },
  { title: "team", key: "name" },
  { title: "name", key: "captain_name_1" },
  { title: "name", key: "captain_name_2" },
  { title: "name", key: "captain_name_3" },
  { title: "points", key: "points" },
];
const SIGNEE_HEADERS = [
  { title: "boat-number", key: "boat_number" },
  { title: "captain-name", key: "captain_name" },
  { title: "temp-captain-name", key: "temp_captain_name" },
  { title: "locality", key: "locality" },
  { title: "starting-place", key: "starting_place" },
];

/** Equal results share a placement (1, 2, 2, 4...). */
function assignPlacements(items, key) {
  let placement = 1;
  let lastValue = null;
  let lastPlacement = null;
  for (const item of items) {
    if (item[key] === lastValue) {
      item.placement = lastPlacement;
    } else {
      item.placement = lastPlacement = placement;
      lastValue = item[key];
    }
    placement++;
  }
}

/**
 * Loads one competition with its signees and catches, and calculates every
 * results table, chart and PDF export shown on the Results/PublicResults pages.
 */
export function useCompetitionResults({ publicOnly = false } = {}) {
  const store = useMainStore();
  const { t } = useI18n();
  const theme = useTheme();

  const loading = ref(false);
  const lastUpdated = ref(null); // when the results were last loaded
  const competition = ref(null);
  const signees = ref([]);
  const hasGottenFishCount = ref(0);
  const tab = ref("normal-competition");

  // select options: fish names plus "all"/"winners"
  const fish_names = ref([]);
  const fish_amount_names = ref([]);
  const table_fish_names = ref([]); // only fish names

  // normal competition
  const normal_options = ["fishes", "points", "signees-signed"];
  const selected_normal = ref("fishes");
  const normal_points = ref([]);
  const normal_weights = ref([]);
  const results = ref([]);
  const headers = ref([]);
  const weight_headers = ref([]);
  const signee_headers = ref([]);

  // team competition
  const team_results = ref([]);
  const team_headers = TEAM_HEADERS;
  const isTeamCompetition = computed(
    () => !!competition.value?.isTeamCompetition,
  );

  // biggest fishes / biggest amounts
  const biggest_fishes = ref([]);
  const biggest_fishes_results = ref([]);
  const biggest_fishes_headers = ref([]);
  const selected_biggest_fish = ref(null);
  const biggest_amounts = ref({});
  const biggest_amounts_results = ref([]);
  const biggest_amounts_headers = ref([]);
  const selected_biggest_amount = ref(null);

  // notifications
  const snackbar = ref(false);
  const text = ref("");
  function notify(message) {
    text.value = message;
    snackbar.value = false;
    nextTick(() => (snackbar.value = true));
  }

  const hasResults = computed(
    () =>
      normal_points.value.length > 0 ||
      team_results.value.length > 0 ||
      biggest_fishes_results.value.length > 0 ||
      biggest_amounts_results.value.length > 0,
  );

  function resetFishLists(fishes) {
    table_fish_names.value = fishes.map((fish) => fish.name);
    fish_names.value = ["all", ...table_fish_names.value, "winners"];
    fish_amount_names.value = [...fish_names.value];
    weight_headers.value = [
      { title: "placement", key: "placement" },
      { title: "boat-number", key: "boat_number" },
      { title: "captain-name", key: "captain_name" },
      ...fishes.map((fish) => ({ title: fish.name, key: String(fish.id) })),
      { title: "points", key: "total_points" },
    ];
  }

  // Adds up every signee's catch, the biggest amounts per fish and the totals
  function processResults(rawResults) {
    const comp = competition.value;
    comp.total_weights = 0;
    hasGottenFishCount.value = 0;
    const amounts = {};

    for (const result of rawResults) {
      result.total_points = 0;
      for (const fish of comp.fishes) {
        const found = result.fishes.find((rf) => rf.id === fish.id);
        if (found) {
          result.total_points += found.weights * fish.multiplier;
          comp.total_weights += found.weights;
          fish.weights += found.weights;
          (amounts[fish.name] ||= []).push({
            boat_number: result.boat_number,
            captain_name: result.captain_name,
            weight: found.weights,
          });
        } else {
          // "-" placeholder so every PDF row has a cell for every fish
          result.fishes.push({ id: fish.id, name: fish.name, weights: "-" });
        }
      }
      if (result.total_points > 0) hasGottenFishCount.value++;
    }
    biggest_amounts.value = amounts;
    signees.value = rawResults;
  }

  // quiet: an automatic refresh. No loading bars, and if it fails the
  // results already on screen stay there.
  async function load(competitionId, { quiet = false } = {}) {
    if (!competitionId) return;
    if (!quiet) loading.value = true;
    try {
      // Logged-out visitors may only read public competitions
      const visibility = publicOnly ? { isPublic: true } : {};
      const found = await CompetitionService.getById(competitionId, visibility);
      const [rawResults, fishes] = await Promise.all([
        ResultService.list({ competition_id: found._id, ...visibility }),
        FishService.list({ competition_id: found._id, ...visibility }),
      ]);
      // everything fetched: only now replace what is on screen
      competition.value = found;
      found.fishes.forEach((fish) => (fish.weights = 0));
      resetFishLists(found.fishes);
      processResults(rawResults);
      biggest_fishes.value = fishes;

      signee_headers.value = found.isTeamCompetition
        ? [...SIGNEE_HEADERS, { title: "team", key: "team" }]
        : [...SIGNEE_HEADERS];
      team_results.value = found.isTeamCompetition
        ? found.team_results || []
        : [];
      assignPlacements(team_results.value, "points");

      calculateAll();
      // a public visitor's page must not change the organizer's current competition
      if (!publicOnly) store.refreshCompetition(found);

      lastUpdated.value = new Date();
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
      if (quiet) return;
      competition.value = null;
      signees.value = [];
      biggest_fishes.value = [];
      biggest_amounts.value = {};
    } finally {
      if (!quiet) loading.value = false;
    }
  }

  function clear() {
    competition.value = null;
    signees.value = [];
    normal_points.value = [];
    normal_weights.value = [];
    results.value = [];
    team_results.value = [];
    biggest_fishes.value = [];
    biggest_fishes_results.value = [];
    biggest_amounts.value = {};
    biggest_amounts_results.value = [];
    tab.value = "normal-competition";
  }

  function calculateAll() {
    const calculated = calculateNormalResults(competition.value, signees.value);
    signees.value = calculated.signees.sort(
      (a, b) => a.boat_number - b.boat_number,
    );
    normal_points.value = calculated.normal_points;
    normal_weights.value = calculated.normal_weights;
    switchNormalResults();
    switchBiggestFishes();
    switchBiggestAmounts();
  }

  // Table contents for the "normal competition" select
  function switchNormalResults() {
    if (!selected_normal.value) selected_normal.value = "fishes";
    if (selected_normal.value === "points") {
      results.value = normal_points.value;
      headers.value = competition.value.isCupCompetition
        ? CUP_HEADERS
        : NORMAL_HEADERS;
    } else if (selected_normal.value === "fishes") {
      results.value = normal_weights.value;
      headers.value = weight_headers.value;
    } else {
      results.value = signees.value;
      headers.value = signee_headers.value;
    }
  }

  function switchBiggestFishes() {
    const r = calculateBiggestFishes(
      biggest_fishes.value,
      table_fish_names.value,
      selected_biggest_fish.value,
    );
    selected_biggest_fish.value = r.selected_fish;
    biggest_fishes_headers.value = r.header;
    biggest_fishes_results.value = r.results;
  }

  function switchBiggestAmounts() {
    const r = calculateBiggestAmounts(
      biggest_amounts.value,
      selected_biggest_amount.value,
      table_fish_names.value,
    );
    selected_biggest_amount.value = r.selected_amount;
    biggest_amounts_headers.value = r.header;
    biggest_amounts_results.value = r.results;
  }

  // "all"/"winners" are translation keys, fish names are shown as is
  const optionLabel = (item) =>
    item === "all" || item === "winners" ? t(item) : item;

  // ---- PDF ----
  const pdf = ref(null); // which table to export
  const isLandscape = ref(false);
  const inkSaver = ref(getPdfInkSaver());
  const selected_print = ref([]);
  const orientation = () => (isLandscape.value ? "landscape" : "portrait");

  watch(inkSaver, (value) => setPdfInkSaver(value));

  async function restoreChartsAfterPdf() {
    const { applyChartThemeColors, setChartsResponsive } =
      await loadLiveCharts();
    applyChartThemeColors(theme.current.value.dark);
    setChartsResponsive();
  }

  /** Mount the stats tab and wait until Chart.js canvases exist. */
  async function ensureStatsChartsMounted() {
    const previous = tab.value;
    if (previous !== "stats") {
      tab.value = "stats";
      await nextTick();
    }
    // Wait until both canvases exist (the stats view and chart.js load
    // on demand, so the first time can take a moment) or time out
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      const species = document.getElementById("species_chart");
      const topBoats = document.getElementById("top_boats_chart");
      if (species && topBoats) break;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    // One more paint so Chart.js finishes its first layout
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    return previous;
  }

  async function savePdf() {
    setPdfInkSaver(inkSaver.value);
    const { saveAsPDF, saveStatsAsPDF } = await loadPdf();
    if (pdf.value === "Tilastoja") {
      const previous = await ensureStatsChartsMounted();
      try {
        await saveStatsAsPDF(
          pdf.value,
          orientation(),
          competition.value,
          signees.value,
          hasGottenFishCount.value,
        );
      } finally {
        await restoreChartsAfterPdf();
        tab.value = previous;
      }
      return;
    }
    const titles = {
      "#normal-table": () =>
        `${t("normal-results")} (${t(selected_normal.value)})`,
      "#team-table": () => t("team-results"),
      "#biggest-fishes-table": () =>
        `${t("biggest-fishes")} (${optionLabel(selected_biggest_fish.value)})`,
      "#biggest-amounts-table": () =>
        `${t("biggest-amounts")} (${optionLabel(selected_biggest_amount.value)})`,
    };
    await saveAsPDF(
      titles[pdf.value]?.() ?? "",
      pdf.value,
      orientation(),
      competition.value,
      signees.value,
      selected_normal.value,
      selected_biggest_fish.value,
      selected_biggest_amount.value,
      normal_points.value,
      normal_weights.value,
      biggest_fishes_results.value,
      biggest_amounts_results.value,
      team_results.value,
      table_fish_names.value,
    );
  }

  async function saveSelectedPdfs() {
    if (!selected_print.value.length) return;
    setPdfInkSaver(inkSaver.value);
    const { saveAllAsPDF } = await loadPdf();
    const previous = selected_print.value.includes("stats")
      ? await ensureStatsChartsMounted()
      : tab.value;

    let r = null;
    try {
      r = await saveAllAsPDF(
        previous,
        orientation(),
        text.value,
        snackbar.value,
        selected_biggest_fish.value,
        selected_biggest_amount.value,
        selected_print.value,
        competition.value,
        signees.value,
        hasGottenFishCount.value,
        biggest_fishes.value,
        biggest_amounts.value,
        normal_points.value,
        normal_weights.value,
        team_results.value,
        table_fish_names.value,
      );
    } finally {
      await restoreChartsAfterPdf();
      tab.value = r?.tab || previous;
    }
    text.value = r.text;
    snackbar.value = r.snackbar;
  }

  return {
    // state
    loading,
    competition,
    signees,
    hasGottenFishCount,
    tab,
    hasResults,
    isTeamCompetition,
    fish_names,
    fish_amount_names,
    table_fish_names,
    normal_options,
    selected_normal,
    normal_points,
    results,
    headers,
    team_results,
    team_headers,
    biggest_fishes,
    biggest_fishes_results,
    biggest_fishes_headers,
    selected_biggest_fish,
    biggest_amounts_results,
    biggest_amounts_headers,
    selected_biggest_amount,
    snackbar,
    text,
    pdf,
    isLandscape,
    inkSaver,
    selected_print,
    lastUpdated,
    // actions
    load,
    clear,
    notify,
    switchNormalResults,
    switchBiggestFishes,
    switchBiggestAmounts,
    optionLabel,
    savePdf,
    saveSelectedPdfs,
  };
}
