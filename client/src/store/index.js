import { defineStore } from "pinia";

const byBoatNumber = (a, b) =>
  parseInt(a.boat_number) - parseInt(b.boat_number);
const byPointsDesc = (a, b) =>
  parseInt(b.total_points) - parseInt(a.total_points);

function addToFishMap(map, fish) {
  const entry = {
    boat_number: fish.boat_number,
    captain_name: fish.captain_name,
    weight: fish.weight,
  };
  if (!map[fish.name]) {
    map[fish.name] = [entry];
    return;
  }
  // Only one entry per boat
  const index = map[fish.name].findIndex(
    (item) => parseInt(fish.boat_number) === parseInt(item.boat_number),
  );
  if (index > -1) {
    map[fish.name].splice(index, 1);
  }
  map[fish.name].push(entry);
}

// App-wide state (was Vuex). In components:
//   const store = useMainStore();
//   store.getCompetition, store.refreshCompetition(competition)
export const useMainStore = defineStore("main", {
  state: () => ({
    competition: null,
    competitions: null,
    cup: null,
    results: null,
    logged_in: false,
    is_admin: false,
    isDark: false,
    lang: "fi",
  }),

  getters: {
    getTheme: (state) => state.isDark,
    getSigneesCount: (state) => state.competition?.signees?.length ?? 0,
    getSigneeByBoatNumber: (state) => (boat_number) =>
      state.competition?.signees?.find(
        (signee) => Number(signee.boat_number) === Number(boat_number),
      ),
    getCompetition: (state) => state.competition,
    getCompetitionId: (state) => state.competition?._id ?? null,
    getCompetitionSignees: (state) => state.competition?.signees ?? [],
    getStillOnWaterSignees: (state) =>
      (state.competition?.signees ?? []).filter(
        (signee) => signee.returned == false,
      ),
    // Sorted copies: getters should not reorder the stored array
    getSignees: (state) =>
      [...(state.competition?.signees ?? [])].sort(byBoatNumber),
    getFinishedSignees: (state) =>
      (state.competition?.signees ?? []).filter(
        (signee) => signee.returned == true,
      ),
    getResultSignees: (state) =>
      [...(state.competition?.signees ?? [])].sort(byPointsDesc),
    getCompetitionFishes: (state) => state.competition?.fishes ?? [],
    getBiggestFishes: (state) => state.competition?.biggest_fishes ?? {},
    getBiggestAmounts: (state) => state.competition?.biggest_amounts ?? {},
    getTeams: (state) => state.competition?.teams ?? [],
    isTeamCompetition: (state) => !!state.competition?.isTeamCompetition,
    isLoggedIn: (state) => state.logged_in,
    isAdmin: (state) => state.is_admin,
  },

  // Former Vuex mutations
  actions: {
    refreshSignees(signees) {
      if (!this.competition) return;
      this.competition.signees = [...signees];
    },
    sortSigneesByNumber(signees) {
      if (!this.competition) return;
      this.competition.signees = [...signees].sort(byBoatNumber);
    },
    addSignee(signee) {
      if (!this.competition) return;
      this.competition.signees.push(signee);
    },
    removeSignee(signee) {
      if (!this.competition?.signees) return;
      const index = this.competition.signees.findIndex(
        (item) => item === signee || (signee._id && item._id === signee._id),
      );
      if (index > -1) {
        this.competition.signees.splice(index, 1);
      }
    },
    addBiggestFish(fish) {
      if (!this.competition) return;
      if (!this.competition.biggest_fishes) {
        this.competition.biggest_fishes = {};
      }
      addToFishMap(this.competition.biggest_fishes, fish);
    },
    addBiggestAmount(fish) {
      if (!this.competition) return;
      if (!this.competition.biggest_amounts) {
        this.competition.biggest_amounts = {};
      }
      addToFishMap(this.competition.biggest_amounts, fish);
    },
    setTeams(teams) {
      if (!this.competition) return;
      this.competition.teams = [...teams];
    },
    replaceSignee(found_signee) {
      if (!this.competition?.signees) return;
      // results have a Mongo `_id`; an `id` match was never found, so the
      // last signee used to be replaced instead
      const index = this.competition.signees.findIndex(
        (item) => item._id === found_signee._id,
      );
      if (index > -1) this.competition.signees.splice(index, 1, found_signee);
      else this.competition.signees.push(found_signee);
    },
    refreshCompetition(competition) {
      this.competition = competition;
    },
    refreshCup(cup) {
      this.cup = cup;
    },
  },
});
