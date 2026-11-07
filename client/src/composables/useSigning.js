// Data side of the signing view: loading the competition, saving and
// deleting signees, and keeping the cup's signee list in sync.
import { computed, ref } from "vue";
import { useMainStore } from "@/store";
import CompetitionService from "@/services/CompetitionService";
import ResultService from "@/services/ResultService";
import CupService from "@/services/CupService";
import { nextBoatNumber } from "@/utils/signees";

export function useSigning() {
  const store = useMainStore();

  const loadingSite = ref(false);
  const refreshing = ref(false);
  const saving = ref(false);
  const competitionId = ref(null);
  const cup = ref(null);

  const competition = computed(() => store.getCompetition);
  const signees = computed(() =>
    competition.value?.signees ? store.getSignees : [],
  );
  const teams = computed(() =>
    (competition.value?.teams ?? []).filter((t) => t && t !== "-"),
  );
  const isTeamCompetition = computed(
    () => !!competition.value?.isTeamCompetition,
  );

  const sameNumber = (a, b) => Number(a) === Number(b);

  async function load(id = competitionId.value) {
    if (!id) return;
    competitionId.value = id;
    refreshing.value = true;
    try {
      const comp = await CompetitionService.getCompetitions({ _id: id });
      if (!comp) {
        console.warn("No competition found in the database");
        return;
      }
      const results = await ResultService.getResults({
        competition_id: comp._id,
      });
      comp.signees = Array.isArray(results) ? results : [];
      store.refreshCompetition(comp);
      cup.value = comp.isCupCompetition
        ? await CupService.getCups({ _id: comp.cup_id })
        : null;
    } catch (err) {
      console.error(err.message);
    } finally {
      loadingSite.value = false;
      refreshing.value = false;
    }
  }

  const nextNumber = () => nextBoatNumber(signees.value);

  /** Signee with this boat number, ignoring the one with `exceptId`. */
  function findByBoatNumber(boatNumber, exceptId = null) {
    return signees.value.find(
      (s) => sameNumber(s.boat_number, boatNumber) && s._id !== exceptId,
    );
  }

  const findById = (id) => signees.value.find((s) => s._id === id);

  function findFromCup(boatNumber) {
    return cup.value?.signees?.find((s) =>
      sameNumber(s.boat_number, boatNumber),
    );
  }

  function rememberTeam(team) {
    if (!team || team === "-") return;
    const all = competition.value.teams ?? [];
    if (!all.includes(team)) store.setTeams([...all, team]);
  }

  // A boat's details live in the cup list too. New boats are added there;
  // details are updated only from the competition where the boat first signed.
  async function syncCupSignee(signee) {
    const comp = competition.value;
    if (!comp.isCupCompetition || !cup.value) return;
    const list = [...(cup.value.signees ?? [])];
    const index = list.findIndex((s) =>
      sameNumber(s.boat_number, signee.boat_number),
    );
    const entry = {
      boat_number: signee.boat_number,
      captain_name: signee.captain_name,
      temp_captain_name: signee.temp_captain_name,
      locality: signee.locality,
      competition_id: comp._id,
    };
    if (index === -1) list.push(entry);
    else if (list[index].competition_id === comp._id) list[index] = entry;
    else return;
    cup.value.signees = list;
    await CupService.updateValues(comp.cup_id, { $set: { signees: list } });
  }

  /**
   * Insert a new signee, or update `existing` with the given details.
   * @returns the saved signee, or null on failure
   */
  async function saveSignee(details, existing = null) {
    const comp = competition.value;
    saving.value = true;
    try {
      const signee = {
        ...(existing ?? { returned: false }),
        ...details,
        competition_id: comp._id,
        cup_id: comp.cup_id,
      };
      if (existing) {
        await ResultService.updateResult(existing._id, signee);
        store.replaceSignee(signee);
      } else {
        const res = await ResultService.insertResults([signee]);
        signee._id = res.data.id;
        store.addSignee(signee);
      }
      rememberTeam(signee.team);
      await syncCupSignee(signee);
      if (!comp.state) {
        comp.state = "signing";
        await CompetitionService.updateValues(comp._id, { state: comp.state });
      }
      return signee;
    } catch (err) {
      console.error(err.message);
      return null;
    } finally {
      saving.value = false;
    }
  }

  async function deleteSignee(signee) {
    saving.value = true;
    try {
      await ResultService.deleteResult(signee._id);
      store.removeSignee(signee);
      return true;
    } catch (err) {
      console.error(err.message);
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    loadingSite,
    refreshing,
    saving,
    competitionId,
    cup,
    signees,
    teams,
    isTeamCompetition,
    load,
    nextNumber,
    findByBoatNumber,
    findById,
    findFromCup,
    saveSignee,
    deleteSignee,
  };
}
