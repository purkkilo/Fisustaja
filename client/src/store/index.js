import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Vuex, basically localstorage but inside Vue
export default new Vuex.Store({
  state: {
    competition: null,
    competitions: null,
    results: null,
    logged_in: false,
    is_admin: false,
    isDark: false,
    lang: "fi",
  },
  // Get data from vuex
  getters: {
    getTheme: (state) => {
      return state.isDark;
    },
    getSigneesCount: (state) => {
      return state.competition.signees.length;
    },
    getSigneeByBoatNumber: (state) => (boat_number) => {
      return state.competition.signees.find(
        (signee) => signee.boat_number === boat_number
      );
    },
    getCompetition: (state) => {
      return state.competition;
    },
    getCompetitionId: (state) => {
      return state.competition._id;
    },
    getCompetitionSignees: (state) => {
      return state.competition.signees;
    },
    getStillOnWaterSignees: (state) => {
      return state.competition.signees.filter(
        (signee) => signee.returned == false
      );
    },
    getSignees: (state) => {
      return state.competition.signees.sort(function compare(a, b) {
        return parseInt(a.boat_number) - parseInt(b.boat_number);
      });
    },
    getFinishedSignees: (state) => {
      return state.competition.signees.filter(
        (signee) => signee.returned == true
      );
    },
    getResultSignees: (state) => {
      return state.competition.signees.sort(function compare(a, b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      });
    },
    getCompetitionFishes: (state) => {
      return state.competition.fishes;
    },
    getBiggestFishes: (state) => {
      return state.competition.biggest_fishes;
    },
    getBiggestAmounts: (state) => {
      return state.competition.biggest_amounts;
    },
    getTeams: (state) => {
      return state.competition.teams;
    },
    isTeamCompetition: (state) => {
      return state.competition.isTeamCompetition;
    },
    isLoggedIn: (state) => {
      return state.logged_in;
    },
    isAdmin: (state) => {
      return state.is_admin;
    },
  },
  // Call these if data needs to be changed
  mutations: {
    refreshSignees: (state, signees) => {
      Vue.set(state.competition, "signees", [...signees]);
    },
    sortSigneesByNumber: (state, signees) => {
      var temp_signees = signees.sort(function compare(a, b) {
        return parseInt(a.boat_number) - parseInt(b.boat_number);
      });
      Vue.set(state.competition, "signees", [...temp_signees]);
    },
    addSignee: (state, signee) => {
      state.competition.signees.push(signee);
    },
    removeSignee: (state, signee) => {
      state.competition.signees.splice(
        state.competition.signees.indexOf(signee),
        1
      );
    },
    addBiggestFish: (state, fish) => {
      if (state.competition.biggest_fishes) {
        if (state.competition.biggest_fishes[fish.name]) {
          let index = state.competition.biggest_fishes[fish.name].findIndex(
            (item) => {
              return parseInt(fish.boat_number) === parseInt(item.boat_number);
            }
          );
          //If there is already biggest fish from this boat
          if (index > -1) {
            state.competition.biggest_fishes[fish.name].splice(index, 1);
          }
          state.competition.biggest_fishes[fish.name].push({
            boat_number: fish.boat_number,
            captain_name: fish.captain_name,
            weight: fish.weight,
          });
        } else {
          state.competition.biggest_fishes[fish.name] = [
            {
              boat_number: fish.boat_number,
              captain_name: fish.captain_name,
              weight: fish.weight,
            },
          ];
        }
      } else {
        Vue.set(state.competition, "biggest_fishes", {});
        state.competition.biggest_fishes[fish.name] = [
          {
            boat_number: fish.boat_number,
            captain_name: fish.captain_name,
            weight: fish.weight,
          },
        ];
      }
    },
    addBiggestAmount: (state, fish) => {
      if (state.competition.biggest_amounts) {
        if (state.competition.biggest_amounts[fish.name]) {
          let index = state.competition.biggest_amounts[fish.name].findIndex(
            (item) => {
              return parseInt(fish.boat_number) === parseInt(item.boat_number);
            }
          );
          //If there is already biggest fish from this boat
          if (index > -1) {
            state.competition.biggest_amounts[fish.name].splice(index, 1);
          }

          state.competition.biggest_amounts[fish.name].push({
            boat_number: fish.boat_number,
            captain_name: fish.captain_name,
            weight: fish.weight,
          });
        } else {
          state.competition.biggest_amounts[fish.name] = [
            {
              boat_number: fish.boat_number,
              captain_name: fish.captain_name,
              weight: fish.weight,
            },
          ];
        }
      } else {
        Vue.set(state.competition, "biggest_amounts", {});
        state.competition.biggest_amounts[fish.name] = [
          {
            boat_number: fish.boat_number,
            captain_name: fish.captain_name,
            weight: fish.weight,
          },
        ];
      }
    },
    setTeams: (state, teams) => {
      Vue.set(state.competition, "teams", [...teams]);
    },
    replaceSignee: (state, found_signee) => {
      const index = state.competition.signees.findIndex((item) => {
        return parseInt(found_signee.id) === parseInt(item.id);
      });
      state.competition.signees.splice(index, 1, found_signee);
    },
    refreshCompetition: (state, competition) => {
      Vue.set(state, "competition", competition);
    },
    refreshCup: (state, cup) => {
      Vue.set(state, "cup", cup);
    },
  },
  // advanced functionalities
  actions: {},
  modules: {},
});
