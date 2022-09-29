<template>
  <div id="overlay" class="z-40 bg-gray-400 fixed w-full h-full top-0 left-0 transition-all" :class="store.state.settings.showSettings ? 'opacity-75 visible' : 'opacity-0 hidden'"></div>
  <div class="z-50 w-2/4 fixed p-5 top-2/4 left-2/4 bg-white shadow-xl rounded-lg transition-all" style="transform: translate(-50%, -50%); max-width: 350px; min-width: 300px;" :class="store.state.settings.showSettings ? 'opacity-100 visible' : 'opacity-0 hidden'">
    <div class="relative bg-white">
      <h3 class="text-center font-bold text-xl mb-5">Statistics</h3>
      <a @click="close" class="absolute right-0 top-0" href="javascript:void(0)">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </a>
      <div class="stats-values grid gap-2 grid-cols-4">
        <div class="item">
          <span class="value block text-center text-2xl font-bold text-blue-400" v-text="store.state.stats.gamesPlayed"></span>
          <span class="label block text-center text-xs">Played</span>
        </div>
        <div class="item">
          <span class="value block text-center text-2xl font-bold text-green-400" v-text="store.state.stats.winPercentage"></span>
          <span class="label block text-center text-xs">Win %</span>
        </div>
        <div class="item">
          <span class="value block text-center text-2xl font-bold text-yellow-400" v-text="store.state.stats.currentStreak"></span>
          <span class="label block text-center text-xs">Current Streak</span>
        </div>
        <div class="item">
          <span class="value block text-center text-2xl font-bold text-red-400" v-text="store.state.stats.maxStreak"></span>
          <span class="label block text-center text-xs">Max Streak</span>
        </div>
      </div>
      <div class="stats-charts my-5">
        <h5 class="font-bold mb-3">Average Successful Guesses</h5>
        <div class="chart flex my-1 items-center" v-for="(guess, idx) in guesses" :key="idx">
          <div class="chart-label mr-3 font-bold">{{idx}}</div>
          <div class="chart-bar bg-green-500 px-2 py-1 text-white inline-block hover:bg-green-400" :style="`width: ${calculateWidth(guess)}`">{{guess}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed } from 'vue'
import {useStore} from 'vuex'

const store = useStore()

const close = () => {
  store.commit('settings/SHOW_SETTINGS', false)
}

const guesses = computed(() => {
  let guessesFromStore = store.state.stats.guesses
  delete guessesFromStore.fail
  return guessesFromStore
})

const largestGuessRowValue = computed(() => {
  let newArr = Object.entries(guesses.value)
  let max = newArr.reduce((prev, curr) => (prev[1] > curr[1]) ? prev : curr)
  return max[1]
})

const calculateWidth = (guess) => {
  const percent = (guess / largestGuessRowValue.value) * 100

  if (percent === 0)
    return 'auto'

  return `${percent}%`
}

</script>