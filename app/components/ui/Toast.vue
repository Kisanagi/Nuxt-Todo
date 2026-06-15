<template>
  <transition name="toast-fade">
    <div 
      v-if="message" 
      :class="toastClass" 
      class="px-4 py-3.5 rounded-2xl border text-xs flex items-center justify-between shadow-lg backdrop-blur-md transition-all duration-300"
    >
      <div class="flex items-center gap-2.5">
        <!-- Loading Spinner -->
        <svg v-if="type === 'loading'" class="animate-spin h-5 w-5 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        <!-- Error Icon -->
        <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>

        <!-- Success Icon -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <span class="font-semibold tracking-wide leading-relaxed">{{ message }}</span>
      </div>

      <!-- Close Button (tampil jika bukan loading) -->
      <button 
        v-if="type !== 'loading'" 
        @click="$emit('close')" 
        class="text-slate-500 hover:text-slate-400 font-bold ml-4 p-1 hover:bg-slate-800/50 rounded transition-colors"
      >
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success'
  }
})

defineEmits(['close'])

const toastClass = computed(() => {
  if (props.type === 'loading') {
    return 'bg-purple-950/40 text-purple-300 border-purple-900/60 shadow-purple-500/[0.03]'
  }
  if (props.type === 'error') {
    return 'bg-red-950/40 text-red-400 border-red-900/60 shadow-red-500/[0.03]'
  }
  return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80 shadow-emerald-500/[0.03]'
})
</script>

<style scoped>
.toast-fade-enter-active, 
.toast-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-fade-enter-from, 
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
