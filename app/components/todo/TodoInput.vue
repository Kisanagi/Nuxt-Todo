<template>
  <div class="mb-5 space-y-2">
    <div class="flex gap-2.5">
      <div class="flex-1 flex items-center gap-2 px-4 py-3 bg-white border border-stone-200 rounded-2xl focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition duration-150">
        <input
          v-model="newTask"
          @keyup.enter="handleAddTask"
          type="text"
          class="flex-1 text-sm text-stone-700 placeholder-stone-400 bg-transparent focus:outline-none"
          placeholder="Tambah tugas baru (misal: Rencana latihan maraton)..."
        />

        <!-- Improve Title Button -->
        <button
          v-if="newTask.trim().length > 3"
          @click="handleImproveTitle"
          :disabled="isImprovingTitle"
          title="Perbaiki judul dengan AI"
          class="p-1 rounded-lg transition duration-150 text-stone-300 hover:text-purple-500 disabled:opacity-40 shrink-0"
        >
          <svg v-if="!isImprovingTitle" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <svg v-else class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </button>

        <!-- Date picker toggle -->
        <button
          @click="showDate = !showDate"
          title="Tambah tenggat waktu"
          class="p-1 rounded-lg transition duration-150 shrink-0"
          :class="newTaskDueDate ? 'text-emerald-600' : 'text-stone-300 hover:text-stone-500'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
      </div>
      <button
        @click="handleAddTask"
        class="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-semibold rounded-2xl shadow-sm transition duration-150 text-sm shrink-0"
      >
        Tambah
      </button>
    </div>

    <!-- AI Title Suggestion -->
    <transition name="slide-down">
      <div v-if="titleSuggestion" class="flex items-start gap-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl">
        <div class="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-purple-700 mb-0.5">Saran AI</p>
          <p class="text-sm font-semibold text-stone-800">"{{ titleSuggestion.improved }}"</p>
          <p class="text-xs text-stone-500 mt-0.5">{{ titleSuggestion.explanation }}</p>
        </div>
        <div class="flex gap-1.5 shrink-0">
          <button @click="acceptSuggestion" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition">Pakai</button>
          <button @click="titleSuggestion = null" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 text-xs font-semibold rounded-lg transition">Abaikan</button>
        </div>
      </div>
    </transition>

    <!-- Due Date Input -->
    <transition name="slide-down">
      <div v-if="showDate" class="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-stone-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <label class="text-xs font-semibold text-stone-500">Tenggat waktu</label>
        <input v-model="newTaskDueDate" type="date" :min="today" class="flex-1 text-sm text-stone-700 bg-transparent focus:outline-none cursor-pointer"/>
        <button v-if="newTaskDueDate" @click="newTaskDueDate = ''" class="text-stone-400 hover:text-red-400 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { newTask, newTaskDueDate, addTask } = useTodos()
const { isImprovingTitle, requestImproveTitle } = useAI()
const emit = defineEmits(['error', 'success'])

const showDate = ref(false)
const titleSuggestion = ref(null)
const today = computed(() => new Date().toISOString().split('T')[0])

const handleImproveTitle = async () => {
  if (!newTask.value.trim()) return
  try {
    const result = await requestImproveTitle(newTask.value)
    if (result.improved && result.improved !== newTask.value) {
      titleSuggestion.value = result
    } else {
      emit('success', 'Judul sudah cukup jelas!')
    }
  } catch {
    emit('error', 'Gagal memperbaiki judul.')
  }
}

const acceptSuggestion = () => {
  newTask.value = titleSuggestion.value.improved
  titleSuggestion.value = null
}

const handleAddTask = async () => {
  if (!newTask.value.trim()) return
  titleSuggestion.value = null
  try {
    await addTask()
    showDate.value = false
    emit('success', 'Tugas baru berhasil ditambahkan!')
  } catch (err) {
    emit('error', err.message || 'Gagal menambahkan tugas baru.')
  }
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
