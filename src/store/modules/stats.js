import { createStore } from 'vuex'

const today = new Date()
const date = new Date(today).toDateString()

const state = {
  // averageGuesses: 0,
  winPercentage: 100,
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
    const stats = state
    if (stats.lastPlayed !== date) {
      commit('INCREMENT_GAMES_PLAYED')
      commit('UPDATE_LAST_PLAYED', date)
    }
    if (wonGame && stats.lastWon !== date) {
      commit('INCREMENT_GAMES_WON')
      commit('INCREMENT_CURRENT_STREAK')
      commit('UPDATE_LAST_WON', date)
      if (stats.currentStreak >= stats.maxStreak)
        commit('UPDATE_MAX_STREAK', stats.currentStreak)
    }
    if (lostGame) {
      commit('RESET_STREAK')
    }
    if ((wonGame || lostGame) && stats.lastCompleted !== date)
      dispatch('updateLastCompleted', currentGuessIndex)

    dispatch('calculateWinPercentage')
    // dispatch('calculateAverageGuesses')
    
    // push stats
    dispatch('pushStats')
  },
  updateLastCompleted ({ commit }, currentGuessIndex) {
    commit('UPDATE_RESULT_INDEX_COUNT', currentGuessIndex)
    commit('UPDATE_LAST_COMPLETED', date)
  },
  calculateWinPercentage ({commit, state}) {
    const value = (state.gamesWon / state.gamesPlayed) * 100
    commit('UPDATE_WIN_PERCENTAGE', value)
  },
  // calculateAverageGuesses ( {commit, state}) {
  //   let guesses = state.guesses
  //   delete guesses.fail
  //   const sum = guesses.reduce((a, b) => a + b, 0)
  //   const avg = (sum / guesses.length) || 0 
  // }
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
  },
  INCREMENT_CURRENT_STREAK: (state) => {
    state.currentStreak++
  },
  UPDATE_MAX_STREAK: (state, value) => {
    state.maxStreak = value
  },
  RESET_STREAK: (state) => {
    state.currentStreak = 0
  },
  UPDATE_WIN_PERCENTAGE: (state, value) => {
    state.winPercentage = value
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