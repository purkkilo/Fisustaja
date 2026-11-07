import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import CompetitionService from "@/services/CompetitionService";
import CupService from "@/services/CupService";
import { getRandomColors } from "@/utils/colors";
import { validateTime } from "@/utils/format";
import constants from "@/data/constants";

const copy = (value) => JSON.parse(JSON.stringify(value));

/** Date + "HH:mm" -> Date */
function combine(date, time) {
  const d = new Date(date);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * The "create competition" wizard: basic info -> fish species ->
 * multipliers and minimum sizes -> summary. Each step is validated and then
 * locked; "modify" unlocks it again.
 */
export function useCompetitionForm() {
  const { t } = useI18n();

  const tab = ref("basic-info");
  const errors = ref([]);
  const loading = ref(false);
  const saving = ref(false);

  // which steps are validated (and locked)
  const locked = ref({ basic: false, species: false, specs: false });

  // ---- step 1: basic info ----
  const name = ref(null);
  const locality = ref(null);
  const isCupCompetition = ref(true);
  const isTeamCompetition = ref(false);
  const cups = ref([]);
  const cup = ref(null);
  const participationPoints = ref(5);
  const pointsMultiplier = ref(1);
  const placementPoints = ref(copy(constants.placement_points));
  const startDate = ref(new Date());
  const endDate = ref(new Date());
  const startTime = ref(null);
  const endTime = ref(null);
  const basicInfo = ref(null); // what will be saved, built when step 1 is validated

  // ---- step 2 and 3: fish species and their multipliers/min sizes ----
  const species = ref([]); // [{ text, color, id }]
  const fishSpecs = ref([]); // [{ name, multiplier, minsize }]
  const completedFishSpecs = ref([]);

  const canSubmit = computed(
    () => locked.value.basic && locked.value.species && locked.value.specs,
  );

  function showError(error) {
    errors.value.push(error);
    nextTick(() => document.getElementById("error-list")?.scrollIntoView());
  }

  async function loadCups(preferredCupId) {
    const user = JSON.parse(localStorage.getItem("user"));
    loading.value = true;
    try {
      const list = await CupService.getCups({ user_id: user._id });
      for (const c of list) c.select = `${c.name} (${c.year})`;
      cups.value = list.sort((a, b) => String(a.name).localeCompare(b.name));
      cup.value =
        list.find((c) => c._id === preferredCupId) ?? list.at(-1) ?? null;
      // nothing to choose from: default to a competition outside cups
      if (!list.length) isCupCompetition.value = false;
    } catch (err) {
      showError(err.message);
    } finally {
      loading.value = false;
    }
  }

  function unlock(step) {
    locked.value[step] = false;
  }

  // ---- step 1 ----
  function validateBasicInfo() {
    errors.value = [];
    if (!name.value) showError("errors.missing-comp-name");
    if (!locality.value) showError("errors.missing-comp-locality");
    if (isCupCompetition.value) {
      if (!cup.value?._id) showError("errors.cup-not-selected");
      if (!placementPoints.value.length)
        showError("errors.missing-placement-points");
      if (participationPoints.value === "" || participationPoints.value == null)
        showError("errors.missing-participation-points");
      if (!pointsMultiplier.value) showError("errors.missing-multiplier");
      else if (pointsMultiplier.value < 0.1)
        showError("errors.invalid-multiplier");
    }
    if (!startTime.value) showError("errors.missing-start-time");
    else if (!validateTime(startTime.value)) showError("errors.invalid-time");
    if (!endTime.value) showError("errors.missing-end-time");
    else if (!validateTime(endTime.value)) showError("errors.invalid-time");
    if (!startDate.value || isNaN(new Date(startDate.value)))
      showError("errors.missing-start-date");
    if (!endDate.value || isNaN(new Date(endDate.value)))
      showError("errors.missing-end-date");
    if (errors.value.length) return;

    const start = combine(startDate.value, startTime.value);
    const end = combine(endDate.value, endTime.value);
    if (end < start) {
      showError("errors.invalid-times");
      return;
    }

    basicInfo.value = {
      name: name.value,
      locality: locality.value,
      isTeamCompetition: isTeamCompetition.value,
      isCupCompetition: isCupCompetition.value,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      start_time: startTime.value,
      end_time: endTime.value,
    };
    if (isCupCompetition.value) {
      const multiplier = Number(pointsMultiplier.value);
      Object.assign(basicInfo.value, {
        cup_id: cup.value._id,
        cup_name: cup.value.name,
        cup_participation_points: Number(participationPoints.value),
        cup_placement_points: placementPoints.value.map((p, i) => ({
          placement: i + 1,
          points: Number(p.points) * multiplier,
        })),
        cup_points_multiplier: multiplier,
      });
    }
    locked.value.basic = true;
    tab.value = "fishes";
  }

  // ---- step 2 ----
  function validateSpecies() {
    errors.value = [];
    if (!species.value.length) {
      showError("errors.missing-fishes");
      return;
    }
    // one multiplier/min size row per species; keep values already typed in
    fishSpecs.value = species.value.map((s) => {
      const nameText = s.text.slice(0, 40);
      const old = fishSpecs.value.find((f) => f.name === nameText);
      return old ?? { name: nameText, multiplier: 1, minsize: "0" };
    });
    locked.value.species = true;
    tab.value = "points";
  }

  // ---- step 3 ----
  function validateSpecs() {
    errors.value = [];
    const colors = getRandomColors(fishSpecs.value.length);
    const specs = [];
    fishSpecs.value.forEach((f, i) => {
      const multiplier = Number(f.multiplier);
      if (
        !multiplier ||
        multiplier < 1 ||
        f.minsize === "" ||
        Number(f.minsize) < 0
      ) {
        showError(
          `${t("input-fish-genetive")} '${f.name} ${t("all-correct-info")}! (${t(
            "multiplier",
          )} > 0, ${t("min-size")} >= 0 )`,
        );
        return;
      }
      specs.push({
        id: i,
        name: f.name,
        multiplier,
        minsize: f.minsize,
        weights: 0,
        color: colors[i],
      });
    });
    if (errors.value.length) return;
    if (!locked.value.basic) showError("errors.check-basic-info");
    if (!locked.value.species) showError("errors.check-fish-info");
    if (errors.value.length) return;

    completedFishSpecs.value = specs;
    locked.value.specs = true;
    tab.value = "summary";
  }

  // ---- submit ----
  async function submit() {
    if (!canSubmit.value) return false;
    const user = JSON.parse(localStorage.getItem("user"));
    saving.value = true;
    try {
      await CompetitionService.insertCompetitions([
        {
          user_id: user._id,
          ...basicInfo.value,
          fishes: completedFishSpecs.value,
          state: "signing",
        },
      ]);
      return true;
    } catch (err) {
      errors.value.push(err.message);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    tab,
    errors,
    loading,
    saving,
    locked,
    name,
    locality,
    isCupCompetition,
    isTeamCompetition,
    cups,
    cup,
    participationPoints,
    pointsMultiplier,
    placementPoints,
    startDate,
    endDate,
    startTime,
    endTime,
    basicInfo,
    species,
    fishSpecs,
    completedFishSpecs,
    canSubmit,
    loadCups,
    unlock,
    validateBasicInfo,
    validateSpecies,
    validateSpecs,
    submit,
  };
}
