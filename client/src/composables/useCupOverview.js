import { ref } from "vue";
import CupService from "@/services/CupService";
import CompetitionService from "@/services/CompetitionService";
import { useMainStore } from "@/store";
import { capitalize_words } from "@/utils/format";
import { useCupStandings } from "./useCupStandings";

/**
 * Cup overview for the cup's owner: everything from useCupStandings plus
 * editing the cup, its signee list and its competitions' public/finished state.
 */
export function useCupOverview() {
  const store = useMainStore();
  const standings = useCupStandings();
  const { cup, signees, notify } = standings;

  const saving = ref(false);
  const updating = ref(false);
  const signeeError = ref("");

  // ---- the cup itself ----
  async function saveCupDetails(name, year) {
    if (!name || !year) return notify("errors.missing-cup-name-or-year");
    if (name === cup.value.name && String(year) === String(cup.value.year))
      return notify("errors.no-changes-made");
    saving.value = true;
    try {
      await CupService.updateValues(cup.value._id, { $set: { name, year } });
      cup.value.name = name;
      cup.value.year = year;
      store.refreshCup(cup.value);
      notify("notification.updated");
    } catch (err) {
      console.error(err.message);
      notify("errors.in-saving");
    } finally {
      saving.value = false;
    }
  }

  async function toggleCupPublic() {
    const previous = cup.value.isPublic;
    cup.value.isPublic = !previous;
    saving.value = true;
    try {
      store.refreshCup(cup.value);
      await CupService.updateValues(cup.value._id, {
        $set: { isPublic: cup.value.isPublic },
      });
    } catch (err) {
      console.error(err.message);
      cup.value.isPublic = previous;
      store.refreshCup(cup.value);
      notify("errors.in-saving");
    } finally {
      saving.value = false;
    }
  }

  // ---- competitions ----
  async function updateCompetition(competition, values, rollback) {
    updating.value = true;
    try {
      await CompetitionService.updateValues(competition._id, { $set: values });
    } catch (err) {
      console.error(err.message);
      if (rollback) rollback();
      notify("errors.in-saving");
    } finally {
      updating.value = false;
    }
  }

  function toggleCompetitionPublic(competition) {
    const previous = competition.isPublic;
    competition.isPublic = !previous;
    return updateCompetition(
      competition,
      { isPublic: competition.isPublic },
      () => {
        competition.isPublic = previous;
      },
    );
  }

  function toggleCompetitionFinished(competition) {
    const previousFinished = competition.isFinished;
    const previousState = competition.state;
    competition.isFinished = !previousFinished;
    competition.state = competition.isFinished ? "ended" : "not-finished";
    return updateCompetition(
      competition,
      {
        isFinished: competition.isFinished,
        state: competition.state,
      },
      () => {
        competition.isFinished = previousFinished;
        competition.state = previousState;
      },
    );
  }

  // ---- signees ----
  async function saveSignees(list) {
    saving.value = true;
    try {
      await CupService.updateValues(cup.value._id, { $set: { signees: list } });
      cup.value.signees = list;
      store.refreshCup(cup.value);
      notify("notification.updated");
      return true;
    } catch (err) {
      console.log(err);
      notify("errors.in-saving");
      return false;
    } finally {
      saving.value = false;
    }
  }

  const nextBoatNumber = () =>
    Math.max(0, ...signees.value.map((s) => Number(s.boat_number) || 0)) + 1;

  async function addSignee(form) {
    signeeError.value = "";
    const number = Number(form.boat_number);
    if (!number || number < 1) signeeError.value = "errors.missing-number";
    else if (!form.captain_name?.trim())
      signeeError.value = "errors.missing-captain";
    else if (signees.value.some((s) => Number(s.boat_number) === number))
      signeeError.value = "errors.number-used";
    if (signeeError.value) return false;

    const ok = await saveSignees([
      ...signees.value,
      {
        boat_number: number,
        captain_name: capitalize_words(form.captain_name.trim()),
        temp_captain_name: form.temp_captain_name?.trim()
          ? capitalize_words(form.temp_captain_name.trim())
          : "-",
        locality: form.locality?.trim()
          ? capitalize_words(form.locality.trim())
          : "-",
        starting_place: "-",
      },
    ]);
    if (ok) standings.setCompetitionData();
    return ok;
  }

  async function editSignee(signee, form) {
    signeeError.value = "";
    if (!form.captain_name?.trim())
      signeeError.value = "errors.missing-captain";
    else if (!form.locality?.trim())
      signeeError.value = "errors.missing-locality";
    if (signeeError.value) return false;

    const updated = {
      ...signee,
      captain_name: capitalize_words(form.captain_name.trim()),
      temp_captain_name: form.temp_captain_name?.trim()
        ? capitalize_words(form.temp_captain_name.trim())
        : "-",
      locality: capitalize_words(form.locality.trim()),
    };
    const ok = await saveSignees(
      signees.value.map((s) =>
        Number(s.boat_number) === Number(signee.boat_number) ? updated : s,
      ),
    );
    if (ok) standings.setCompetitionData();
    return ok;
  }

  async function deleteSignee(signee) {
    const ok = await saveSignees(
      signees.value.filter(
        (s) => Number(s.boat_number) !== Number(signee.boat_number),
      ),
    );
    if (ok) standings.setCompetitionData();
    return ok;
  }

  return {
    ...standings,
    saving,
    updating,
    signeeError,
    saveCupDetails,
    toggleCupPublic,
    toggleCompetitionPublic,
    toggleCompetitionFinished,
    nextBoatNumber,
    addSignee,
    editSignee,
    deleteSignee,
  };
}
