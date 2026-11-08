// Data side of the dashboard: the user's competitions and cups, today's
// competition with its boats, and opening a competition or cup.
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/store";
import CompetitionService from "@/services/CompetitionService";
import CupService from "@/services/CupService";
import ResultService from "@/services/ResultService";
import {
  nextCompetition,
  pickTodaysCompetition,
} from "@/utils/competitionStatus";

export function useDashboard() {
  const store = useMainStore();
  const router = useRouter();

  const loading = ref(false);
  const savingCup = ref(false);
  const error = ref(null);
  const competitions = ref([]);
  const cups = ref([]);
  const todaySignees = ref(null);

  const today = computed(() => pickTodaysCompetition(competitions.value));
  const upcoming = computed(() => nextCompetition(competitions.value));

  /** Competitions per cup: { total, finished } by cup id. */
  const cupProgress = computed(() => {
    const progress = {};
    for (const c of competitions.value) {
      if (!c.isCupCompetition || !c.cup_id) continue;
      const entry = (progress[c.cup_id] ??= { total: 0, finished: 0 });
      entry.total += 1;
      if (c.isFinished) entry.finished += 1;
    }
    return progress;
  });

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const [comps, cupList] = await Promise.all([
        CompetitionService.list({ user_id: store.user?._id }),
        CupService.list({ user_id: store.user?._id }),
      ]);
      competitions.value = comps
        .map((c) => ({
          ...c,
          start_date: new Date(c.start_date),
          end_date: new Date(c.end_date),
        }))
        .sort((a, b) => b.start_date - a.start_date);
      cups.value = cupList.sort((a, b) => Number(b.year) - Number(a.year));
      if (today.value) {
        todaySignees.value = await ResultService.list({
          competition_id: today.value._id,
        });
      }
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.error || "errors.something-wrong";
    } finally {
      loading.value = false;
    }
  }

  /** Make `competition` the one the app works on, then go to `path`. */
  function openCompetition(competition, path = "/overview") {
    store.refreshCompetition(competition);
    localStorage.setItem(
      "competition",
      JSON.stringify({
        _id: competition._id,
        start_date: competition.start_date,
        end_date: competition.end_date,
      }),
    );
    router.push({ path });
  }

  function openCup(cup) {
    localStorage.setItem("cup", cup._id);
    router.push({ path: "/cup-overview" });
  }

  /**
   * @param form { name, year, limit } where limit is the number of
   *   counted competitions, or null for all of them
   */
  async function createCup(form) {
    savingCup.value = true;
    try {
      const created = await CupService.insertCup([
        {
          name: form.name.trim(),
          year: String(form.year),
          meaningful_competitions: form.limit ? Number(form.limit) : -1,
        },
      ]);
      cups.value = [created, ...cups.value].sort(
        (a, b) => Number(b.year) - Number(a.year),
      );
      return created;
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.error || "errors.in-saving";
      return null;
    } finally {
      savingCup.value = false;
    }
  }

  return {
    loading,
    savingCup,
    error,
    competitions,
    cups,
    today,
    upcoming,
    todaySignees,
    cupProgress,
    load,
    openCompetition,
    openCup,
    createCup,
  };
}
