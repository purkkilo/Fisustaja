import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    competition: null,
    competitions: null,
    results: null,
    logged_in: false,
    is_admin: false,
  },
  getters: {
    getSigneesCount: state => {
      return state.competition.signees.length
    },
    getSigneeById: (state) => (id) => {
      return state.competition.signees.find(signee => signee.id === id)
    },
    getSigneeByBoatNumber: (state) => (boat_number) => {
      return state.competition.signees.find(signee => signee.boat_number === boat_number)
    },
    getCompetition: state => {
      return state.competition
    },
    getCompetitionId: state => {
      return state.competition._id
    },
    getCreatedCompetitionID: state => {
      return state.competition.competition_id
    },
    getCompetitionSignees: state => {
      return state.competition.signees;
    },
    getCompetitionTotalWeights: state => {
      return state.competition.total_weights
    },
    getStillOnWaterSignees: state => {
      return state.competition.signees.filter(signee => signee.returned == false)
    },
    getFinishedSignees: state => {
      return state.competition.signees.filter(signee => signee.returned == true)
    },
    getPointSignees: state => {
      return state.competition.signees.filter(signee => signee.total_points > 0)
    },
    getResultSignees: state => {
      return state.competition.signees.sort(function compare(a,b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      })
    },
    getCompetitionFishes: state => {
      return state.competition.fishes
    },
    getBiggestFishes: state => {
      return state.competition.biggest_fishes
    },
    getBiggestAmounts: state => {
      return state.competition.biggest_amounts
    },
    getTeams: state => {
      return state.competition.teams;
    },
    isTeamCompetition: state => {
      return state.competition.team_competition;
    },
    isLoggedIn: state => {
      return state.logged_in;
    },
    isAdmin: state => {
      return state.is_admin;
    }
  },
  mutations: {
    refreshSignees: (state, signees) => {
      Vue.set(state.competition, 'signees', [...signees]);
    },
    sortSigneesByNumber: (state, signees) => {
      var temp_signees = signees.sort(function compare(a,b) {
        return parseInt(a.boat_number) - parseInt(b.boat_number);
      })
      Vue.set(state.competition, 'signees', [...temp_signees])
    },
    addSignee: (state, signee) => {
      state.competition.signees.push(signee);
    },
    removeSignee: (state, signee) => {
      state.competition.signees.splice(state.competition.signees.indexOf(signee), 1);
    },
    addBiggestFish: (state, fish) => {
      if(state.competition.biggest_fishes[fish.name]){
        state.competition.biggest_fishes[fish.name].push({boat_number: fish.boat_number, captain_name:fish.captain_name , weight: fish.weight});
      }
      else {
        state.competition.biggest_fishes[fish.name] = [{boat_number: fish.boat_number, captain_name:fish.captain_name , weight: fish.weight}];
      }
    },
    addBiggestAmount: (state, fish) => {
      if(state.competition.biggest_amounts[fish.name]){
        state.competition.biggest_amounts[fish.name].push({boat_number: fish.boat_number, captain_name:fish.captain_name , weight: fish.weight});
      }
      else {
        state.competition.biggest_amounts[fish.name] = [{boat_number: fish.boat_number, captain_name:fish.captain_name , weight: fish.weight}];
      }
    },
    setTeams: (state, teams) => {
      Vue.set(state.competition, 'teams', [...teams]);
    },
    replaceSignee: (state, found_signee) => { 
      const index = state.competition.signees.findIndex(item => {
          return (parseInt(found_signee.id) === parseInt(item.id));
      })
      state.competition.signees.splice(index, 1, found_signee);
    },
    refreshCompetition: (state, competition) => {
      Vue.set(state, 'competition', competition);
    },
  },
  actions: {
  },
  modules: {
  }
})
