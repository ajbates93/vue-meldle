<template>
  <Header />
  <div class="flex flex-col h-screen max-w-md mx-auto justify-evenly meldle-app relative">
    <div class="absolute top-10 left-2/4 text-center p-2 bg-gray-700 text-white opacity-0 font-bold transition-opacity rounded-md" style="transform: translateX(-50%)" :class="state.invalidGuess ? 'animate-fade-in-up opacity-100' : ''" id="notValidWordWarning">Not in word list</div>
    <div>
      <word-row
        v-for="(guess, i) in state.guesses"
        :key="i"
        :value="guess"
        :solution="state.solution"   
        :submitted="i < state.currentGuessIndex"
        :shake="state.invalidGuess && state.currentGuessIndex === i"
        @submitColourRow="submitToColourRow"
      />
    </div>
    <p v-if="wonGame" class="inline-flex flex-col items-center justify-center text-center font-bold">
      <span>🍻 Congratulations! Mel would be proud.</span>
      <a href="javascript:void(0)" v-if="webShareApiSupported" @click="share" class="mt-5 rounded text-xl bg-green-600 text-white button font-bold py-2 px-3">Share</a>
    </p>
    <p v-else-if="lostGame" class="inline-flex flex-col items-center justify-center text-center font-bold">
      😞 Out of tries. No Timmy Taylors for you.
      <a href="javascript:void(0)" v-if="webShareApiSupported" @click="share" class="mt-5 rounded text-xl bg-red-600 text-white button font-bold py-2 px-3">Share</a>
    </p>
    <simple-keyboard 
      @onKeyPress="handleInput" 
      :guessedLetters="state.guessedLetters"
    />
    <settings />
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from "vue";
import SimpleKeyboard from "./components/SimpleKeyboard.vue"
import WordRow from './components/WordRow.vue'
import Header from './components/Header.vue'
import Settings from './components/Settings.vue'
import { getWordOfTheDay, validateGuess } from './utils'

const today = new Date()
const date = new Date(today).toDateString()

const state = reactive({
  solution: getWordOfTheDay(date),
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
})

const wonGame = computed(() => 
  state.guesses[state.currentGuessIndex - 1] === state.solution
)

const lostGame = computed(() => !wonGame.value
  && state.currentGuessIndex >= 6
)

const handleInvalidGuess = () => {
  state.invalidGuess = true
  setTimeout(() => state.invalidGuess = false, 1500)
}

const handleInput = async (key) => {
  if (state.currentGuessIndex >= 6 || wonGame.value)
    return;
  const currentGuess = state.guesses[state.currentGuessIndex]
  if (key == "{enter}") {
    // VALIDATE GUESS
    const valid = await validateGuess(currentGuess)
    if (!valid) {
      handleInvalidGuess()
    } else {
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
        updateProgress()
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

const share = () => {
  const shareDataText = wonGame 
    ? `I'M A VICTORIOUS MEL! 🏆 I GOT TODAY'S MELDLE IN ${state.currentGuessIndex} ${state.currentGuessIndex === 1 ? 'TRY' : 'TRIES'}.\n\n${getShareDataProgressGrid.value}\n\n Diddleberg.`
    : `SHAME UPON ME AND MY FAMILY! 💀 I FAILED TODAY'S MELDLE AND HAVE FORFEITED ALL RIGHTS TO FUTURE WENCHING.\n\n${getShareDataProgressGrid.value}\n\n No Diddleberg.`
  try {
    navigator.share({
      title: 'MELDLE RESULTS',
      text: shareDataText,
      url: 'https://ajbates93.github.io/vue-meldle/'
    })
    .then(() => {
      state.sharedData = true
    })
    .catch((err) => {
      state.sharedData = false
      throw new Error("Error: ", err)  
    })
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

const submitToColourRow = (colours) => {
  const values = colours
  const index = state.currentGuessIndex
  Object.assign(state.coloursGrid[state.currentGuessIndex - 1], colours)
}

const getShareDataProgressGrid = computed(() => {
  const miss = '⬜'
  const hint = '🟨'
  const hit = '🟩'


  let rawGrid = JSON.parse(JSON.stringify(state.coloursGrid))
  let newGrid = []

  for (var i = 0; i < rawGrid.length; i++) {
    let guess = rawGrid[i]
    newGrid.push([])
    for (var x = 0; x < guess.length; x++) {
      let letter = guess[x]
      let newGuess = newGrid[i]
      if (letter == 'gray')
        newGuess.push(miss)
      if (letter == 'green')
        newGuess.push(hit)
      if (letter == 'yellow')
        newGuess.push(hint)
      newGuess.join('')
    }
  }
  
  let gridString = newGrid.join('\n').replaceAll(',','')
  let pos = gridString.lastIndexOf('\n\n')
  if (pos !== -1)
    gridString = gridString.substring(0, pos)
  return gridString
})

const webShareApiSupported = computed(() => {
  return navigator.share
})

const updateProgress = () => {
  const today = new Date().toDateString()
  const progress = JSON.stringify({ date: today, guesses: state.guesses, currentGuessIndex: state.currentGuessIndex })
  window.localStorage.setItem("meldle-progress", progress)
}

const fetchProgress = () => {
  const progress = JSON.parse(localStorage.getItem("meldle-progress"))
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
    state.guesses = progress.guesses
    state.currentGuessIndex = progress.currentGuessIndex
  }
}

onMounted(() => {
  fetchProgress()
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