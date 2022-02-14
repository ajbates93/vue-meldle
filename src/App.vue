<template>
  <Header />
  <div class="flex flex-col h-screen max-w-md mx-auto justify-evenly meldle-app">
    <div>
      <word-row
        v-for="(guess, i) in state.guesses"
        :key="i"
        :value="guess"
        :solution="state.solution"   
        :submitted="i < state.currentGuessIndex"
      />
    </div>
    <p v-if="wonGame" class="inline-flex flex-col items-center justify-center text-center font-bold">
      <span>🍻 Congratulations! Mel would be proud.</span>
      <a v-if="webShareApiSupported" @click="share" class="mt-2 w-14 bg-green-600 text-white button font-bold py-1 px-2">Share</a>
      <a v-else @click="copyResults" class="mt-2 w-14 bg-green-600 text-white button font-bold py-1 px-2">Copy Results</a>
    </p>
    <p v-else-if="lostGame" class="text-center font-bold">
      😞 Out of tries. No Timmy Taylors for you.
    </p>
    <simple-keyboard 
      @onKeyPress="handleInput" 
      :guessedLetters="state.guessedLetters"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from "vue";
import SimpleKeyboard from "./components/SimpleKeyboard.vue"
import WordRow from './components/WordRow.vue'
import Header from './components/Header.vue'
import { getWordOfTheDay } from './utils'

const today = new Date()
const date = new Date(today).toDateString()

const state = reactive({
  solution: getWordOfTheDay(date),
  guesses: ["", "", "", "", "", ""],
  currentGuessIndex: 0,
  guessedLetters: {
    miss: [],
    found: [],
    hint: []
  },
  sharedData: false
})

const wonGame = computed(() => 
  state.guesses[state.currentGuessIndex - 1] === state.solution
)

const lostGame = computed(() => !wonGame.value
  && state.currentGuessIndex >= 6
)

const handleInput = (key) => {
  if (state.currentGuessIndex >= 6 || wonGame.value)
    return;
  const currentGuess = state.guesses[state.currentGuessIndex]
  if (key == "{enter}") {
    // SEND GUESS
    if (currentGuess.length == 5) {
      state.currentGuessIndex++
      // HANDLE GUESSES
      for (var i = 0; i < currentGuess.length; i++) {
        let c = currentGuess.charAt(i)
        if (c == state.solution.charAt(i))
          state.guessedLetters.found.push(c)
        else if (state.solution.indexOf(c) != -1)
          state.guessedLetters.hint.push(c)
        else
          state.guessedLetters.miss.push(c)
      }
    }
  } else if (key == "{bksp}") {
    // REMOVE LAST LETTER
    state.guesses[state.currentGuessIndex] =
      currentGuess.slice(0, -1)
  } else if (currentGuess.length < 5) {
    // ADD LETTER IF ALPHABETICAL
    const alphaRegex = /[a-zA-Z]/;
    if (alphaRegex.test(key))
      state.guesses[state.currentGuessIndex] += key
  }
}

const share = async () => {
  if (!wonGame)
    return;
  const shareDataText = `I'M A VICTORIOUS MEL! 🏆 I GOT TODAY'S MELDLE IN ${state.currentGuessIndex} ${state.currentGuessIndex === 1 ? 'TRY' : 'TRIES'}.`
  try {
    console.log('share reached')
    await navigator.share({
      title: 'MELDLE RESULTS',
      text: shareDataText,
      url: 'https://ajbates93.github.io/vue-meldle/'
    })
    state.sharedData = true
  } catch (err) {
    state.sharedData = false
    throw new Error("Error: ", err)
  }
}

const copyResults = async () => {
  if (!wonGame)
    return;
  const shareDataText = `I'M A VICTORIOUS MEL! 🏆 I GOT TODAY'S MELDLE IN ${state.currentGuessIndex} ${state.currentGuessIndex === 1 ? 'TRY' : 'TRIES'}.`
  try {
    console.log('copy reached')
    var type = "text/plain"
    var blob = new Blob([shareDataText], { type })
    var data = [new ClipboardItem({ [type]: blob })]

    navigator.clipboard.write(data).then(() => {
      console.log('successfully written to clipboard!')
    })
    .catch((err) => {
      console.log('could not write data to clipboard: ', err)
    })
  } catch (err) {
    throw new Error('could not write data to clipboard: ', err)
  }
}

const webShareApiSupported = computed(() => {
  return navigator.share
})

onMounted(() => {
  window.addEventListener("keyup", (e) => {
    e.preventDefault()
    let key = 
      e.keyCode == 13
        ? "{enter}"
        : e.keyCode == 8
        ? "{bksp}"
        : String.fromCharCode(e.keyCode).toUpperCase()
    handleInput(key)
  })
})
</script>

<style>
.meldle-app {
  min-height: 650px;
}
</style>