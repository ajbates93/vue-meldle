import { createStore } from 'vuex'
import { getWordOfTheDay } from '../utils/index.js'

import stats from './modules/stats'
import settings from './modules/settings'

const today = new Date()
const date = new Date(today).toDateString()

const solution = await getWordOfTheDay(date)

interface State {
  solution: any,
  guesses: string[],
  coloursGrid: [][],
  invalidGuess: boolean,
  currentGuessIndex: number,
  guessedLetters: {
    miss: any[],
    found: any[],
    hint: any[]
  },
  sharedData: boolean
}

const store = createStore<State>({
  state() {
    return {
      solution: solution,
      guesses: ["", "", "", "", "", ""],
      coloursGrid: [[],[],[],[],[],[]],
      invalidGuess: false,
      currentGuessIndex: 0,
      guessedLetters: {
        miss: [],
        found: [],
        hint: []
      },
      sharedData: false
    }
  },
  getters: {

  },
  mutations: {
    INCREMENT_CURRENT_GUESS_INDEX: (state) => {
      state.currentGuessIndex++
    },
    ADD_TO_GUESSED_LETTERS_FOUND: (state, value) => {
      state.guessedLetters.found.push(value)
    },
    ADD_TO_GUESSED_LETTERS_HINT: (state, value) => {
      state.guessedLetters.hint.push(value)
    },
    ADD_TO_GUESSED_LETTERS_MISS: (state, value) => {
      state.guessedLetters.miss.push(value)
    },
    REMOVE_LAST_LETTER: (state, {index, value}) => {
      state.guesses[index] = value.slice(0, -1)
    },
    ADD_LETTER: (state, {index, value}) => {
      state.guesses[index] += value
    },
    UPDATE_SHARED_DATA: (state, value) => {
      state.sharedData = value
    },
    SUBMIT_TO_COLOUR_ROW: (state, {index, value}) => {
      state.coloursGrid[index] = value
    },
    UPDATE_GUESSES: (state, value) => {
      state.guesses = value
    },
    UPDATE_CURRENT_GUESS_INDEX: (state, value) => {
      state.currentGuessIndex = value
    },
    SET_INVALID_GUESS: (state, value) => {
      state.invalidGuess = value
    }
  },
  actions: {
    fetchProgress({commit, state}) {
      const progress = JSON.parse(localStorage.getItem("meldle-progress") ?? "")
      const today = new Date().toDateString()

      if (!progress) {
        // if guesses don't exist, store blank guesses
        const newProgress = JSON.stringify({ date: today, guesses: state.guesses, currentGuessIndex: state.currentGuessIndex })
        window.localStorage.setItem("meldle-progress", newProgress)
      } else if (progress && (progress.date !== today)) {
        // if guesses exist but dates don't match, remove old dates and store new blank
        window.localStorage.removeItem("meldle-progress")

        const newProgress = JSON.stringify({ date: today, guesses: state.guesses, currentGuessIndex: state.currentGuessIndex })
        window.localStorage.setItem("meldle-progress", newProgress)
      } else {
        // retrieve current guesses
        commit('UPDATE_GUESSES', progress.guesses)
        commit('UPDATE_CURRENT_GUESS_INDEX', progress.currentGuessIndex)
      }
    },
    updateProgress({state}) {
      const today = new Date().toDateString()
      const progress = JSON.stringify({ date: today, guesses: state.guesses, currentGuessIndex: state.currentGuessIndex })
      window.localStorage.setItem("meldle-progress", progress)
    }
  },
  modules: {
    stats: stats,
    settings: settings
  }
})

export { store }