// Data side of the admin view: users, cups and competitions of everyone.
import { computed, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/store";
import CompetitionService from "@/services/CompetitionService";
import UserService from "@/services/UserService";
import CupService from "@/services/CupService";
import { copyText } from "@/utils/clipboard";

export function useAdmin() {
  const store = useMainStore();
  const router = useRouter();

  const users = ref([]);
  const cups = ref([]);
  const competitions = ref([]);
  const loadingUsers = ref(false);
  const loadingCups = ref(false);
  const loadingCompetitions = ref(false);
  const deleting = ref(false);
  const userId = ref(null);
  const snackbar = ref(false);
  const text = ref("");

  const ownCups = computed(() =>
    cups.value.filter((c) => c.user_id === userId.value),
  );
  const ownCompetitions = computed(() =>
    competitions.value.filter((c) => c.user_id === userId.value),
  );

  function notify(message) {
    text.value = message;
    snackbar.value = false;
    nextTick(() => (snackbar.value = true));
  }

  async function logoutExpired() {
    notify("notification.login-again");
    try {
      await UserService.logoutUser();
    } catch (err) {
      console.error(err);
    }
    store.clearSession();
    router.push({ path: "/login" });
  }

  async function load() {
    userId.value = store.user?._id;
    loadingUsers.value = loadingCups.value = loadingCompetitions.value = true;
    try {
      // Users first: an expired token logs the user out
      users.value = (await UserService.getUsers()).map((u) => ({
        ...u,
        menu: false,
      }));
      loadingUsers.value = false;

      cups.value = (await CupService.list())
        .map((c) => ({ ...c, select: `${c.name} (${c.year})` }))
        .sort((a, b) => a.select.localeCompare(b.select));
      loadingCups.value = false;

      const cupNames = new Map(cups.value.map((c) => [c._id, c.select]));
      const userNames = new Map(users.value.map((u) => [u._id, u.name]));
      competitions.value = (await CompetitionService.list())
        .map((c) => ({
          ...c,
          // the cup or user may have been deleted since
          cup_name: c.isCupCompetition ? (cupNames.get(c.cup_id) ?? "-") : "",
          username: userNames.get(c.user_id) ?? "-",
          start_date: new Date(c.start_date),
          end_date: new Date(c.end_date),
        }))
        .sort((a, b) => b.start_date - a.start_date);
    } catch (err) {
      if (err.response?.status === 401) await logoutExpired();
      else console.error(err.message);
    } finally {
      loadingUsers.value =
        loadingCups.value =
        loadingCompetitions.value =
          false;
    }
  }

  function openCompetition(competition) {
    store.refreshCompetition(competition);
    localStorage.setItem(
      "competition",
      JSON.stringify({
        _id: competition._id,
        start_date: competition.start_date,
        end_date: competition.end_date,
      }),
    );
    router.push({ path: "/overview" });
  }

  async function deleteCompetition(competition) {
    deleting.value = true;
    notify("notification.deleting");
    try {
      await CompetitionService.deleteCompetition(competition._id);
      competitions.value = competitions.value.filter(
        (c) => c._id !== competition._id,
      );
    } catch (err) {
      console.error(err.message);
      notify("errors.something-wrong");
    } finally {
      deleting.value = false;
    }
  }

  async function copy(value) {
    const ok = await copyText(String(value));
    notify(
      ok ? "notification.copied-to-clipboard" : "notification.copying-failed",
    );
  }

  return {
    users,
    cups,
    competitions,
    ownCups,
    ownCompetitions,
    loadingUsers,
    loadingCups,
    loadingCompetitions,
    deleting,
    snackbar,
    text,
    load,
    openCompetition,
    deleteCompetition,
    copy,
  };
}
