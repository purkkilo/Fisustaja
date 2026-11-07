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
    getSigneesCount: (state) => state.competition.signees.length,
    getSigneeByBoatNumber: (state) => (boat_number) =>
      state.competition.signees.find(
        (signee) => signee.boat_number === boat_number,
      ),
    getCompetition: (state) => state.competition,
    getCompetitionId: (state) => state.competition._id,
    getCompetitionSignees: (state) => state.competition.signees,
    getStillOnWaterSignees: (state) =>
      state.competition.signees.filter((signee) => signee.returned == false),
    // Sorted copies: getters should not reorder the stored array
    getSignees: (state) => [...state.competition.signees].sort(byBoatNumber),
    getFinishedSignees: (state) =>
      state.competition.signees.filter((signee) => signee.returned == true),
    getResultSignees: (state) =>
      [...state.competition.signees].sort(byPointsDesc),
    getCompetitionFishes: (state) => state.competition.fishes,
    getBiggestFishes: (state) => state.competition.biggest_fishes,
    getBiggestAmounts: (state) => state.competition.biggest_amounts,
    getTeams: (state) => state.competition.teams,
    isTeamCompetition: (state) => state.competition.isTeamCompetition,
    isLoggedIn: (state) => state.logged_in,
    isAdmin: (state) => state.is_admin,
  },

  // Former Vuex mutations
  actions: {
    refreshSignees(signees) {
      this.competition.signees = [...signees];
    },
    sortSigneesByNumber(signees) {
      this.competition.signees = [...signees].sort(byBoatNumber);
    },
    addSignee(signee) {
      this.competition.signees.push(signee);
    },
    removeSignee(signee) {
      const index = this.competition.signees.indexOf(signee);
      if (index > -1) {
        this.competition.signees.splice(index, 1);
      }
    },
    addBiggestFish(fish) {
      if (!this.competition.biggest_fishes) {
        this.competition.biggest_fishes = {};
      }
      addToFishMap(this.competition.biggest_fishes, fish);
    },
    addBiggestAmount(fish) {
      if (!this.competition.biggest_amounts) {
        this.competition.biggest_amounts = {};
      }
      addToFishMap(this.competition.biggest_amounts, fish);
    },
    setTeams(teams) {
      this.competition.teams = [...teams];
    },
    replaceSignee(found_signee) {
      const index = this.competition.signees.findIndex(
        (item) => parseInt(found_signee.id) === parseInt(item.id),
      );
      this.competition.signees.splice(index, 1, found_signee);
    },
    refreshCompetition(competition) {
      this.competition = competition;
    },
    refreshCup(cup) {
      this.cup = cup;
    },
  },
});
