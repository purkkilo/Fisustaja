import { nextTick, ref } from "vue";
import CompetitionService from "@/services/CompetitionService";
import CupService from "@/services/CupService";
import { useMainStore } from "@/store";
import {
  combineDateTime,
  competitionFieldErrors,
  cupFields,
} from "@/utils/competition";
import constants from "@/data/constants";

const copy = (value) => JSON.parse(JSON.stringify(value));

function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 * The competition settings page: shows the saved settings, lets them be
 * edited (same fields as when creating), and publishes/finishes/deletes.
 */
export function useCompetitionSettings() {
  const store = useMainStore();

  const competition = ref(null);
  const loading = ref(false);
  const updating = ref(false);
  const editing = ref(false);
  const errors = ref([]);
  const cups = ref([]);

  // form fields (filled from the competition when editing starts)
  const name = ref(null);
  const locality = ref(null);
  const isCupCompetition = ref(false);
  const isTeamCompetition = ref(false);
  const cup = ref(null);
  const participationPoints = ref(5);
  const pointsMultiplier = ref(1);
  const placementPoints = ref(copy(constants.placement_points));
  const startDate = ref(null);
  const endDate = ref(null);
  const startTime = ref(null);
  const endTime = ref(null);
  const fishes = ref([]); // [{ id, name, multiplier, minsize, weights, color }]

  function showError(error) {
    errors.value.push(error);
    nextTick(() => document.getElementById("error-list")?.scrollIntoView());
  }

  async function load(competitionId) {
    loading.value = true;
    try {
      const found = await CompetitionService.getById(competitionId);
      competition.value = found;
      store.refreshCompetition(found);
      resetForm();
      if (!cups.value.length) await loadCups();
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
    } finally {
      loading.value = false;
    }
  }

  async function loadCups() {
    try {
      const list = await CupService.list({ user_id: store.user?._id });
      for (const c of list) c.select = `${c.name} (${c.year})`;
      cups.value = list.sort((a, b) => String(a.name).localeCompare(b.name));
      cup.value =
        list.find((c) => c._id === competition.value?.cup_id) ?? cup.value;
    } catch (err) {
      console.error(err.message);
    }
  }

  // Form fields back to the saved values ("cancel")
  function resetForm() {
    const c = competition.value;
    errors.value = [];
    name.value = c.name;
    locality.value = c.locality;
    isCupCompetition.value = !!c.isCupCompetition;
    isTeamCompetition.value = !!c.isTeamCompetition;
    fishes.value = (c.fishes || []).map((fish, index) => ({
      id: index,
      name: fish.name,
      multiplier: Number(fish.multiplier),
      minsize: fish.minsize,
      weights: Number(fish.weights) || 0,
      color: fish.color,
    }));
    if (c.isCupCompetition) {
      const multiplier = Number(c.cup_points_multiplier) || 1;
      // saved points include the multiplier; the editor shows base points
      placementPoints.value = (c.cup_placement_points || []).map((p) => ({
        placement: p.placement,
        points: Math.round((p.points / multiplier) * 100) / 100,
      }));
      participationPoints.value = c.cup_participation_points;
      pointsMultiplier.value = multiplier;
      cup.value = cups.value.find((x) => x._id === c.cup_id) ?? cup.value;
    } else {
      placementPoints.value = copy(constants.placement_points);
      participationPoints.value = 5;
      pointsMultiplier.value = 1;
    }
    // Date objects in local time (ISO strings would shift the day near midnight)
    startDate.value = new Date(c.start_date);
    endDate.value = new Date(c.end_date);
    startTime.value = c.start_time;
    endTime.value = c.end_time;
  }

  function startEditing() {
    resetForm();
    editing.value = true;
  }

  function cancelEditing() {
    resetForm();
    editing.value = false;
  }

  function addFish() {
    fishes.value.push({
      // unique even after deleting rows (draggable uses it as the row key)
      id: Math.max(-1, ...fishes.value.map((f) => f.id)) + 1,
      name: "",
      multiplier: 1,
      minsize: "0",
      weights: 0,
      color: randomColor(),
    });
  }

  function removeFish(index) {
    fishes.value.splice(index, 1);
  }

  async function save(t) {
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
    for (const fish of fishes.value) {
      const label = fish.name || t("fish-genetive");
      if (!fish.name) showError("errors.missing-fish-name");
      if (!fish.multiplier)
        showError(`${label} ${t("errors.invalid-fish-multiplier")}`);
      if (fish.minsize === "" || fish.minsize == null)
        showError(`${label} ${t("errors.invalid-fish-minsize")}`);
    }
    if (errors.value.length) return false;

    const updated = {
      ...competition.value,
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
      fishes: fishes.value.map((f) => ({
        ...f,
        multiplier: Number(f.multiplier),
      })),
    };
    if (isCupCompetition.value) {
      Object.assign(updated, cupFields(fields));
    } else {
      for (const key of [
        "cup_id",
        "cup_name",
        "cup_points_multiplier",
        "cup_placement_points",
        "cup_participation_points",
        "teams",
      ])
        delete updated[key];
    }

    loading.value = true;
    try {
      await CompetitionService.updateCompetition(updated._id, updated);
      competition.value = updated;
      store.refreshCompetition(updated);
      editing.value = false;
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Saves single fields; `rollback` puts the old values back if saving fails
  async function saveValues(values, rollback) {
    updating.value = true;
    try {
      store.refreshCompetition(competition.value);
      await CompetitionService.updateValues(competition.value._id, {
        $set: values,
      });
      return true;
    } catch (err) {
      console.error(err.message);
      rollback();
      store.refreshCompetition(competition.value);
      return false;
    } finally {
      updating.value = false;
    }
  }

  function togglePublic() {
    const c = competition.value;
    const previous = c.isPublic;
    c.isPublic = !previous;
    return saveValues({ isPublic: c.isPublic }, () => (c.isPublic = previous));
  }

  function toggleFinished() {
    const c = competition.value;
    const previous = { isFinished: c.isFinished, state: c.state };
    c.isFinished = !c.isFinished;
    c.state = c.isFinished ? "ended" : "not-finished";
    return saveValues({ isFinished: c.isFinished, state: c.state }, () =>
      Object.assign(c, previous),
    );
  }

  async function remove() {
    updating.value = true;
    try {
      await CompetitionService.deleteCompetition(competition.value._id);
      store.competition = null;
      localStorage.removeItem("competition");
      return true;
    } catch (err) {
      console.error(err.message);
      return false;
    } finally {
      updating.value = false;
    }
  }

  return {
    competition,
    loading,
    updating,
    editing,
    errors,
    cups,
    name,
    locality,
    isCupCompetition,
    isTeamCompetition,
    cup,
    participationPoints,
    pointsMultiplier,
    placementPoints,
    startDate,
    endDate,
    startTime,
    endTime,
    fishes,
    load,
    startEditing,
    cancelEditing,
    addFish,
    removeFish,
    save,
    togglePublic,
    toggleFinished,
    remove,
  };
}
