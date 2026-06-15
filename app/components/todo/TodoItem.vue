<template>
  <li
    class="bg-white rounded-2xl border transition-all duration-200 overflow-hidden"
    :class="{
      'border-stone-200': !isAiLoading && !task.completed,
      'border-emerald-200 shadow-sm shadow-emerald-100': isAiLoading,
      'border-stone-100 opacity-60': task.completed
    }"
  >
    <!-- AI Loading Bar -->
    <div v-if="isAiLoading" class="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shimmer-animate"></div>

    <!-- Todo Row -->
    <div class="px-4 py-3.5 flex items-start gap-3">

      <!-- Checkbox -->
      <button
        @click="handleToggle"
        class="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 active:scale-90"
        :class="task.completed ? 'bg-emerald-700 border-emerald-700 animate-check-pop' : 'border-stone-300 hover:border-emerald-500 hover:bg-emerald-50'"
      >
        <transition name="check">
          <svg v-if="task.completed" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </transition>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Priority Badge + Text -->
        <div v-if="editingId !== task.id" class="flex items-start gap-2">
          <span
            v-if="task.priority"
            class="shrink-0 mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
            :class="priorityClass"
          >
            <span>{{ priorityLabel }}</span>
          </span>
          <span
            class="block text-sm font-semibold leading-snug"
            :class="task.completed ? 'line-through text-stone-400' : 'text-stone-800'"
          >{{ task.text }}</span>
        </div>
        <!-- Edit Mode -->
        <span v-else-if="false"></span>
        <input
          v-if="editingId === task.id"
          v-model="editText"
          @keyup.enter="handleSave"
          @keyup.esc="cancelEdit"
          type="text"
          class="w-full px-3 py-1.5 bg-stone-50 border border-emerald-400 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          v-focus
        />

        <!-- Due Date Badge -->
        <div v-if="editingId !== task.id" class="mt-1.5 flex items-center gap-2 flex-wrap">
          <!-- Existing due date -->
          <div v-if="task.dueDate && !editingDueDate" class="flex items-center gap-1">
            <span
              class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg cursor-pointer transition duration-150"
              :class="dueDateClass"
              @click="startDueDateEdit"
              :title="'Klik untuk ubah tanggal'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ dueDateLabel }}
            </span>
            <button @click="handleClearDueDate" class="text-stone-300 hover:text-red-400 transition" title="Hapus tanggal">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Inline due date input -->
          <div v-else-if="editingDueDate || !task.dueDate" class="flex items-center gap-1.5">
            <input
              v-if="editingDueDate"
              v-model="tempDueDate"
              type="date"
              :min="today"
              class="text-xs border border-emerald-400 rounded-lg px-2 py-0.5 text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              @change="handleSaveDueDate"
              @keyup.esc="editingDueDate = false"
              v-focus-date
            />
            <button
              v-else-if="!task.dueDate && !task.completed"
              @click="startDueDateEdit"
              class="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400 hover:text-emerald-600 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Tambah tenggat
            </button>
          </div>

          <!-- Subtask progress -->
          <div v-if="task.subtasks && task.subtasks.length > 0" class="flex items-center gap-1.5 ml-auto">
            <div class="w-16 h-1 bg-stone-100 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" :style="{ width: subtaskProgress + '%' }"></div>
            </div>
            <span class="text-[10px] font-bold text-stone-400">{{ completedSubtasks }}/{{ task.subtasks.length }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 shrink-0">
        <!-- Edit Mode -->
        <template v-if="editingId === task.id">
          <button @click="handleSave" class="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Simpan
          </button>
          <button @click="cancelEdit" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 text-xs font-semibold rounded-lg transition">Batal</button>
        </template>

        <!-- Confirm Delete -->
        <template v-else-if="confirmingDelete">
          <span class="text-xs text-stone-500 font-medium mr-1">Yakin hapus?</span>
          <button @click="confirmDelete" class="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition">Ya</button>
          <button @click="confirmingDelete = false" class="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 text-xs font-semibold rounded-lg transition">Batal</button>
        </template>

        <!-- Normal Mode -->
        <template v-else>
          <!-- Smart Priority Button -->
          <button
            v-if="!task.completed"
            @click.stop="handlePrioritize"
            :disabled="isPrioritizing"
            :title="task.priority ? 'Analisis ulang prioritas' : 'Analisis prioritas dengan AI'"
            class="p-1.5 rounded-lg transition duration-150 disabled:opacity-40"
            :class="task.priority ? `${priorityBtnClass} hover:opacity-80` : 'text-stone-400 hover:text-amber-500 hover:bg-amber-50'"
          >
            <svg v-if="!isPrioritizing" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
            <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          </button>

          <button
            v-if="!task.completed"
            @click.stop="handleAiBreakdown"
            :disabled="isAiLoading"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 border disabled:opacity-40"
            :class="isAiLoading
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-stone-50 hover:bg-emerald-50 text-stone-500 hover:text-emerald-700 border-stone-200 hover:border-emerald-200'"
          >
            <svg v-if="!isAiLoading" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ isAiLoading ? 'Memproses...' : 'Pecah AI' }}
          </button>
          <button @click.stop="startEdit(task)" class="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button @click.stop="confirmingDelete = true" class="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </template>
      </div>
    </div>

    <!-- Subtasks -->
    <transition name="subtasks-slide">
      <div v-if="task.subtasks && task.subtasks.length > 0" class="border-t border-stone-100 bg-stone-50/60">
        <div class="px-4 pt-2.5 pb-1 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-stone-400">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Sub-tugas AI</span>
          </div>
          <!-- Regenerate Button -->
          <button
            v-if="!task.completed"
            @click="handleRegenerate"
            :disabled="isAiLoading"
            class="flex items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition duration-150 disabled:opacity-40"
            title="Generate ulang sub-tugas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'animate-spin': isAiLoading }">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Generate ulang
          </button>
        </div>
        <ul class="px-3 pb-3 space-y-0.5">
          <SubtaskItem
            v-for="sub in task.subtasks"
            :key="sub.id"
            :subtask="sub"
            :todoId="task.id"
            @error="(msg) => $emit('toast', { message: msg, type: 'error' })"
          />
        </ul>
      </div>
    </transition>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['toast'])

const { editingId, editText, toggleTask, deleteTask, startEdit, saveEdit, cancelEdit, updateDueDate, updatePriority } = useTodos()
const { saveSubtasks, regenerateSubtasks } = useSubtasks()
const { loadingTasks, requestBreakdown, requestPriority } = useAI()

const confirmingDelete = ref(false)
const editingDueDate = ref(false)
const tempDueDate = ref('')

const isAiLoading = computed(() => !!loadingTasks.value[props.task.id])
const isPrioritizing = computed(() => !!loadingTasks.value[`priority_${props.task.id}`])

// Priority display
const priorityMap = {
  high:   { label: '🔴 Tinggi', class: 'bg-red-50 text-red-600 border border-red-200', btn: 'text-red-500 bg-red-50' },
  medium: { label: '🟡 Sedang', class: 'bg-amber-50 text-amber-600 border border-amber-200', btn: 'text-amber-500 bg-amber-50' },
  low:    { label: '🔵 Rendah', class: 'bg-blue-50 text-blue-600 border border-blue-200', btn: 'text-blue-500 bg-blue-50' }
}
const priorityClass = computed(() => priorityMap[props.task.priority]?.class || '')
const priorityLabel = computed(() => priorityMap[props.task.priority]?.label || '')
const priorityBtnClass = computed(() => priorityMap[props.task.priority]?.btn || '')
const completedSubtasks = computed(() => (props.task.subtasks || []).filter(s => s.completed).length)
const subtaskProgress = computed(() => {
  const total = (props.task.subtasks || []).length
  return total ? Math.round((completedSubtasks.value / total) * 100) : 0
})

const today = computed(() => new Date().toISOString().split('T')[0])

// Due date formatting & color
const dueDateLabel = computed(() => {
  if (!props.task.dueDate) return ''
  const due = new Date(props.task.dueDate)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diff = Math.round((due - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `Telat ${Math.abs(diff)} hari`
  if (diff === 0) return 'Hari ini'
  if (diff === 1) return 'Besok'
  return due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
})

const dueDateClass = computed(() => {
  if (!props.task.dueDate) return ''
  const due = new Date(props.task.dueDate)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diff = Math.round((due - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
  if (diff === 0) return 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
  return 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
})

const startDueDateEdit = () => {
  tempDueDate.value = props.task.dueDate || ''
  editingDueDate.value = true
}

const handleSaveDueDate = async () => {
  try {
    await updateDueDate(props.task.id, tempDueDate.value || null)
  } catch {
    emit('toast', { message: 'Gagal menyimpan tenggat waktu.', type: 'error' })
  } finally {
    editingDueDate.value = false
  }
}

const handleClearDueDate = async () => {
  try {
    await updateDueDate(props.task.id, null)
  } catch {
    emit('toast', { message: 'Gagal menghapus tenggat waktu.', type: 'error' })
  }
}

const handleToggle = async () => {
  try { await toggleTask(props.task.id) }
  catch { emit('toast', { message: 'Gagal merubah status tugas.', type: 'error' }) }
}

const handleSave = async () => {
  try { await saveEdit(props.task.id) }
  catch { emit('toast', { message: 'Gagal menyimpan tugas.', type: 'error' }) }
}

const confirmDelete = async () => {
  try {
    await deleteTask(props.task.id)
  } catch {
    emit('toast', { message: 'Gagal menghapus tugas.', type: 'error' })
  } finally {
    confirmingDelete.value = false
  }
}

const handlePrioritize = async () => {
  try {
    const result = await requestPriority(props.task.id, props.task.text)
    await updatePriority(props.task.id, result.priority)
    emit('toast', { message: `Prioritas diatur ke: ${priorityLabel.value}`, type: 'success' })
  } catch {
    emit('toast', { message: 'Gagal menganalisis prioritas.', type: 'error' })
  }
}

const handleAiBreakdown = async () => {
  emit('toast', { message: `AI sedang memecah "${props.task.text}"...`, type: 'loading' })
  try {
    const subtasksList = await requestBreakdown(props.task.id, props.task.text)
    await saveSubtasks(props.task.id, subtasksList)
    emit('toast', { message: 'Tugas berhasil dipecah menjadi sub-task!', type: 'success' })
  } catch {
    emit('toast', { message: 'Gagal memproses AI breakdown.', type: 'error' })
  }
}

const handleRegenerate = async () => {
  emit('toast', { message: 'AI sedang membuat ulang sub-tugas...', type: 'loading' })
  try {
    const subtasksList = await requestBreakdown(props.task.id, props.task.text)
    await regenerateSubtasks(props.task.id, subtasksList)
    emit('toast', { message: 'Sub-tugas berhasil diperbarui!', type: 'success' })
  } catch {
    emit('toast', { message: 'Gagal generate ulang sub-tugas.', type: 'error' })
  }
}

const vFocus = { mounted: (el) => el.focus() }
const vFocusDate = { mounted: (el) => el.showPicker?.() }
</script>

<style scoped>
.subtasks-slide-enter-active, .subtasks-slide-leave-active {
  transition: all 0.3s ease; max-height: 600px; opacity: 1;
}
.subtasks-slide-enter-from, .subtasks-slide-leave-to { max-height: 0; opacity: 0; }

/* Checkbox check icon */
.check-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.check-enter-from   { opacity: 0; transform: scale(0); }
.check-leave-active { transition: all 0.15s ease; }
.check-leave-to     { opacity: 0; transform: scale(0); }

.shimmer-animate {
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
