import { createStore } from 'vuex'

const today = new Date()
const date = new Date(today).toDateString()

const state = {
  averageGuesses: 0,
  currentStreak: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  guesses: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0, 
    fail: 0,
  },
  maxStreak: 0,
  lastPlayed: '',
  lastWon: '',
  lastCompleted: ''
}

const actions = {
  fetchStats({state, commit}) {
    const stats = JSON.parse(localStorage.getItem("meldle-stats"))
    if (!stats) {
      const newStats = JSON.stringify({ ...state })
      window.localStorage.setItem("meldle-stats", newStats)
    } else {
      commit('UPDATE_STATS', stats)
    }
  },
  pushStats({state}) {
    const x = {...state}
    const stats = JSON.stringify({...x})
    window.localStorage.setItem("meldle-stats", stats)
  },
  updateAndFetchStats({state, commit, dispatch}, {wonGame, lostGame, currentGuessIndex}) {
    const stats = {...state}
    if (stats.lastPlayed !== date) {
      commit('INCREMENT_GAMES_PLAYED')
      commit('UPDATE_LAST_PLAYED', date)
    }
    if (wonGame && stats.lastWon !== date) {
      commit('INCREMENT_GAMES_WON')
      commit('UPDATE_LAST_WON', date)
    }
    if ((wonGame || lostGame) && stats.lastCompleted !== date)
      dispatch('updateLastCompleted', currentGuessIndex)
    
    // push stats
    dispatch('pushStats')
  },
  updateLastCompleted ({ commit }, currentGuessIndex) {
    commit('UPDATE_RESULT_INDEX_COUNT', currentGuessIndex)
    commit('UPDATE_LAST_COMPLETED', date)
  }
}

const mutations = {
  UPDATE_STATS: (state, value) => {
    Object.assign(state, value)
  },
  INCREMENT_GAMES_WON: (state) => {
    state.gamesWon++
  },
  INCREMENT_GAMES_PLAYED: (state) => {
    state.gamesPlayed++
  },
  UPDATE_LAST_WON: (state, value) => {
    state.lastWon = value
  },
  UPDATE_LAST_PLAYED: (state, value) => {
    state.lastPlayed = value
  },
  UPDATE_LAST_COMPLETED: (state, value) => {
    state.lastCompleted = value
  },
  UPDATE_RESULT_INDEX_COUNT: (state, index) => {
    state.guesses[index]++
  }
}

const getters = {

}

export default { 
  namespaced: true,
  state,
  actions,
  mutations,
  getters  
}