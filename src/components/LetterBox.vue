<script setup>
const props = defineProps({
  letter: {
    type: String,
    default: "",
  },
  colour: {
    type: String,
    default: ""
  }
})
</script>

<template>
  <div 
    class="col-span-1 flex items-center justify-center h-16
      uppercase border-2 border-gray-200 dark:border-slate-700
      transition-all duration-300 font-bold text-xl dark:text-white"
    :class="{
      'border-gray-500 bg-gray-500 text-white'
        : colour == 'gray',
      'border-green-600 bg-green-600 text-white'
        : colour == 'green',
      'border-yellow-500 bg-yellow-500 text-white'
        : colour == 'yellow',
    }"
    >
    {{letter}}  
  </div>
</template>