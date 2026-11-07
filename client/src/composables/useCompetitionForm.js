import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import CompetitionService from "@/services/CompetitionService";
import CupService from "@/services/CupService";
import { getRandomColors } from "@/utils/colors";
import {
  combineDateTime,
  competitionFieldErrors,
  cupFields,
} from "@/utils/competition";
import constants from "@/data/constants";

const copy = (value) => JSON.parse(JSON.stringify(value));

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
    const fields = {
      name: name.value,
      locality: locality.value,
      isCupCompetition: isCupCompetition.value,
      cup: cup.value,
      placementPoints: placementPoints.value,
      participationPoints: participationPoints.value,
      pointsMultiplier: pointsMultiplier.value,
      startDate: startDate.value,
      endDate: endDate.value,
      startTime: startTime.value,
      endTime: endTime.value,
    };
    competitionFieldErrors(fields).forEach(showError);
    if (errors.value.length) return;

    basicInfo.value = {
      name: name.value,
      locality: locality.value,
      isTeamCompetition: isTeamCompetition.value,
      isCupCompetition: isCupCompetition.value,
      start_date: combineDateTime(
        startDate.value,
        startTime.value,
      ).toISOString(),
      end_date: combineDateTime(endDate.value, endTime.value).toISOString(),
      start_time: startTime.value,
      end_time: endTime.value,
      ...(isCupCompetition.value ? cupFields(fields) : {}),
    };
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
