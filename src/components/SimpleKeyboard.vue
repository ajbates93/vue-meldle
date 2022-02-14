<template>
  <div class="simple-keyboard"></div>
</template>

<script setup>
import Keyboard from "simple-keyboard"
import "simple-keyboard/build/css/index.css"
import {ref, onMounted, watch} from 'vue'

const emit = defineEmits(["onKeyPress"])

const props = defineProps({
  guessedLetters: Object
})

const keyboard = ref(null)

const onKeyPress = (button) => {
  emit("onKeyPress", button)
}

onMounted(() => {
  keyboard.value = new Keyboard("simple-keyboard", {
    layout: {
      default: [
        "Q W E R T Y U I O P",
        "A S D F G H J K L",
        "{enter} Z X C V B N M {bksp}",
      ],
    },
    display: {
      '{bksp}': '❌',
      '{enter}': '✅'
    },
    onKeyPress
  })
})

watch(
  () => props.guessedLetters,
  (guessedLetters, prevGuessedLetters) => {
    keyboard.value.addButtonTheme(
      guessedLetters.miss.join(" "),
      "miss"
    )
    keyboard.value.addButtonTheme(
      guessedLetters.found.join(" "),
      "found"
    )
    keyboard.value.addButtonTheme(
      guessedLetters.hint.join(" "),
      "hint"
    )
  },
  { deep: true }
)

</script>

<style>
div.miss {
  background-color: gray !important;
  color: #fff;
}
div.found {
  background-color: #16a34a !important;
  color: #fff;
}
div.hint:not(.found) {
  background-color: #eab308 !important;
  color: #fff;
}
</style>