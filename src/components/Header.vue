<template>
  <header class="flex justify-between items-center px-5 border-b border-gray-200 dark:border-slate-700 py-3 relative dark:bg-slate-800">
    <button @click="toggleDark()" id="themeSwitcher" aria-label="Theme switcher" class="mx-2 relative rounded-xl block w-[40px] h-[22px] mr-5 border dark:border-slate-400 dark:hover:border-slate-200 dark:bg-slate-600 bg-slate-100 transition-all">
      <span class="icon rounded-2xl absolute top-0 dark:bg-slate-800 bg-white p-1 transition-all" :class="isDark ? 'right-0' : 'right-full'" :style="isDark ? '' : 'transform: translateX(100%)'">
        <svg v-if="isDark" id="moon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="dark:text-slate-400 w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
        <svg v-else id="sun" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-yellow-500 w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      </span>
    </button>
    <h1 class=" text-center text-3xl font-bold dark:text-gray-100">MELDLE</h1>
    <button @click="show" id="settingsPanel" aria-label="Click to open statistics panel." class="z-40 dark:text-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
  </header>
</template>

<script setup>
import { useStore } from 'vuex'
import { useDark, useToggle } from '@vueuse/core'

const store = useStore()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const show = () => {
  store.commit('settings/SHOW_SETTINGS', true)
} 

</script>