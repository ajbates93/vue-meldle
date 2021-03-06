<template>
  <Header />
  <div class="flex flex-col h-screen max-w-md mx-auto justify-evenly meldle-app relative">
    <div class="absolute top-10 left-2/4 text-center z-50 p-2 bg-gray-700 text-white opacity-0 font-bold transition-opacity rounded-md" style="transform: translateX(-50%)" :class="store.state.invalidGuess ? 'animate-fade-in-up opacity-100' : ''" id="notValidWordWarning">Not in word list</div>
    <div>
      <word-row
        v-for="(guess, i) in store.state.guesses"
        :key="i"
        :value="guess"
        :solution="store.state.solution"   
        :submitted="i < store.state.currentGuessIndex"
        :shake="store.state.invalidGuess && store.state.currentGuessIndex === i"
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
      :guessedLetters="store.state.guessedLetters"
    />
    <settings />
  </div>
</template>

<script setup>
import { onMounted, reactive, computed } from "vue";
import { useStore } from 'vuex'
import { useStoreModule } from './composables'
import SimpleKeyboard from "./components/SimpleKeyboard.vue"
import WordRow from './components/WordRow.vue'
import Header from './components/Header.vue'
import Settings from './components/Settings.vue'
import { validateGuess } from './utils'

// const { actions } = useStoreModule('stats')

const today = new Date()
const date = new Date(today).toDateString()

const store = useStore()

const wonGame = computed(() => 
  store.state.guesses[store.state.currentGuessIndex - 1] === store.state.solution
)

const lostGame = computed(() => !wonGame.value
  && store.state.currentGuessIndex >= 6
)

const fetchStats = () => {
  return mapActions(['fetchStats'])
}
const updateAndFetchStats = () => {
  return mapActions(['updateAndFetchStats'])
}

const handleInvalidGuess = () => {
  store.commit('SET_INVALID_GUESS', true)
  setTimeout(() => store.commit('SET_INVALID_GUESS', false), 1500)
}

const handleInput = async (key) => {
  if (store.state.currentGuessIndex >= 6 || wonGame.value)
    return;
  const currentGuess = store.state.guesses[store.state.currentGuessIndex]
  if (key == "{enter}") {
    // VALIDATE GUESS
    const valid = await validateGuess(currentGuess)
    if (!valid) {
      handleInvalidGuess()
    } else {
      // SEND GUESS
      if (currentGuess.length == 5) {
        store.commit('INCREMENT_CURRENT_GUESS_INDEX')
        // HANDLE GUESSES
        for (var i = 0; i < currentGuess.length; i++) {
          let c = currentGuess.charAt(i)
          if (c == store.state.solution.charAt(i))
            store.commit('ADD_TO_GUESSED_LETTERS_FOUND', c)
          else if (store.state.solution.indexOf(c) != -1)
            store.commit('ADD_TO_GUESSED_LETTERS_HINT', c)
          else
            store.commit('ADD_TO_GUESSED_LETTERS_MISS', c)
        }
        // update progress and stats      
        store.dispatch('updateProgress')
        store.dispatch('stats/updateAndFetchStats', {wonGame: wonGame.value, lostGame: lostGame.value, currentGuessIndex: lostGame.value ? 'fail' : store.state.currentGuessIndex})
      }
    }
  } else if (key == "{bksp}") {
    // REMOVE LAST LETTER
    store.commit('REMOVE_LAST_LETTER', {index: store.state.currentGuessIndex, value: currentGuess})
  } else if (currentGuess.length < 5) {
    // ADD LETTER IF ALPHABETICAL
    const alphaRegex = /[a-zA-Z]/;
    if (alphaRegex.test(key))
      store.commit('ADD_LETTER', {index: store.state.currentGuessIndex, value: key})
  }
}

const share = () => {
  const shareDataText = wonGame 
    ? `I'M A VICTORIOUS MEL! 🏆 I GOT TODAY'S MELDLE IN ${store.state.currentGuessIndex} ${store.state.currentGuessIndex === 1 ? 'TRY' : 'TRIES'}.\n\n${getShareDataProgressGrid.value}\n\n Diddleberg.`
    : `SHAME UPON ME AND MY FAMILY! 💀 I FAILED TODAY'S MELDLE AND HAVE FORFEITED ALL RIGHTS TO FUTURE WENCHING.\n\n${getShareDataProgressGrid.value}\n\n No Diddleberg.`
  try {
    navigator.share({
      title: 'MELDLE RESULTS',
      text: shareDataText,
      url: 'https://ajbates93.github.io/vue-meldle/'
    })
    .then(() => {
      store.commit('UPDATE_SHARED_DATA', true)
    })
    .catch((err) => {
      store.commit('UPDATE_SHARED_DATA', false)
      throw new Error("Error: ", err)  
    })
  } catch (err) {
    store.commit('UPDATE_SHARED_DATA', false)
    throw new Error("Error: ", err)
  }
}

const copyResults = async () => {
  if (!wonGame)
    return;
  const shareDataText = `I'M A VICTORIOUS MEL! 🏆 I GOT TODAY'S MELDLE IN ${store.state.currentGuessIndex} ${store.state.currentGuessIndex === 1 ? 'TRY' : 'TRIES'}.`
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
  store.commit('SUBMIT_TO_COLOUR_ROW', {index: store.state.currentGuessIndex - 1, value: colours})
}

const getShareDataProgressGrid = computed(() => {
  const miss = '⬜'
  const hint = '🟨'
  const hit = '🟩'


  let rawGrid = JSON.parse(JSON.stringify(store.state.coloursGrid))
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

// const getWinPercentage = (played, won) => {
//   const p = Number(played)
//   const w = Number(won)
//   return (w / p) * 100
// }

onMounted(() => {
  store.dispatch('fetchProgress')
  store.dispatch('stats/fetchStats')
  // actions.fetchStats()
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