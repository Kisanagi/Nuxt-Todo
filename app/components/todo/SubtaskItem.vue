<template>
  <li class="flex items-center justify-between gap-3 px-2 py-2 rounded-xl hover:bg-stone-100 transition-all duration-150 group animate-fade-up">
    <!-- Checkbox + Text -->
    <div class="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0" @click="handleToggle">
      <div
        class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 active:scale-90"
        :class="subtask.completed ? 'bg-teal-600 border-teal-600' : 'bg-transparent border-stone-300 hover:border-teal-500 hover:bg-teal-50'"
      >
        <transition name="check">
          <svg v-if="subtask.completed" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </transition>
      </div>
      <span
        class="text-xs font-medium leading-snug truncate"
        :class="subtask.completed ? 'line-through text-stone-400' : 'text-stone-600'"
      >{{ subtask.title }}</span>
    </div>

    <!-- Duration + Delete -->
    <div class="flex items-center gap-1.5 shrink-0">
      <span class="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50 border border-teal-100 text-[10px] font-bold text-teal-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {{ subtask.duration_minutes }}m
      </span>
      <button
        @click.stop="handleDelete"
        class="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150"
        title="Hapus langkah"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </li>
</template>

<style scoped>
.check-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.check-enter-from   { opacity: 0; transform: scale(0); }
.check-leave-active { transition: all 0.15s ease; }
.check-leave-to     { opacity: 0; transform: scale(0); }
</style>

<script setup>
const props = defineProps({
  subtask: { type: Object, required: true },
  todoId: { type: String, required: true }
})
const { toggleSubtask, deleteSubtask } = useSubtasks()
const emit = defineEmits(['error'])

const handleToggle = async () => {
  try { await toggleSubtask(props.subtask.id, props.todoId) }
  catch { emit('error', 'Gagal memperbarui status langkah.') }
}

const handleDelete = async () => {
  try { await deleteSubtask(props.subtask.id, props.todoId) }
  catch { emit('error', 'Gagal menghapus langkah.') }
}
</script>
