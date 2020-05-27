import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    competition: {
      signees: []
    },
    signees: [],
    competitions: [],
    results: []
  },
  getters: {
    getSignees: state => {
      return state.signees
    },
    getSigneesCount: state => {
      return state.signees.length
    },
    getSigneeById: (state) => (id) => {
      return state.signees.find(signee => signee.id === id)
    },
    getSigneeByBoatNumber: (state) => (boat_number) => {
      return state.signees.find(signee => signee.boat_number === boat_number)
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
      return state.competition.signees
    },
    getCompetitionFishes: state => {
      return state.competition.fishes
    },
  },
  mutations: {
    refreshSignees: (state, signees) => {
      Vue.set(state, 'signees', [...signees]);
    },
    addSignee: (state, signee) => {
      state.signees.push(signee);
    },
    replaceSignee: (state, found_signee) => {
        // note - findIndex might be replaced with some(), filter(), forEach() 
      const index = state.signees.findIndex(item => {
          return (parseInt(found_signee.id) === parseInt(item.id));
      })
      state.signees.splice(index, 1, found_signee);
    },
    refreshCompetition: (state, competition) => {
      Vue.set(state, 'competition', competition);
    },
    refreshSigneesFromCompetition: (state) => {
      Vue.set(state, 'signees', [...state.competition.signees]);
    }
  },
  actions: {
  },
  modules: {
  }
})
