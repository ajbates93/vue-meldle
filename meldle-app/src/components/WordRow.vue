<template>
  <div class="grid max-w-xs grid-cols-5 gap-1 mx-auto mb-1">
    <letter-box
      v-for="i in 5"
      :key="i"
      :letter="value[i - 1]" 
      :colour="colours[i - 1]"  
    />
  </div>
</template>

<script setup>
import {watch, ref} from 'vue'
import LetterBox from './LetterBox.vue'
const props = defineProps({
  value: String,
  solution: String,
  submitted: Boolean
})

const colours = ref(["", "", "", "", ""])

watch(
  () => props.submitted,
  async(submitted, prevSubmitted) => {
    if (props.submitted) {
      let s = props.solution
      let v = props.value

      let temp = ["gray", "gray", "gray", "gray", "gray"]
      let letterPool = []
      for (let i = 0; i < 5; i++) {
        if (s.charAt(i) == v.charAt(i)) {
          // if the value matches...
          temp[i] = "green"
        } else {
          letterPool.push(s.charAt(i))
        }
      }
      for (let i = 0; i < 5; i++) {
        // if letter hasn't already been guessed correctly
        if (temp[i] == "gray") {
          if (letterPool.indexOf(v.charAt(i)) !== -1) {
            letterPool.splice(letterPool.indexOf(v.charAt(i)), 1)
            temp[i] = "yellow"
          }
        }
        colours.value[i] = temp[i]
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
    }
  }
)
</script>