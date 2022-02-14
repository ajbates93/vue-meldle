<template>
  <header class="border-b border-gray-200 py-3 relative">
    <h1 class="flex justify-center text-3xl font-bold">MELDLE</h1>
    <!-- <a class="absolute right-4 top-2/4" style="transform: translateY(-50%);" @click="toggleActive"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg></a> -->
  </header>
  <!-- <div v-if="active">
    Diddleberg!
  </div> -->
</template>

<script setup>
import {ref} from 'vue'

let active = ref(false)

const toggleActive = () => {
  active.value = !active.value
}
</script>