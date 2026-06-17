<template>
  <div class="flex h-screen bg-stone-100 overflow-hidden">

    <!-- Daily Summary Modal -->
    <transition name="modal">
      <div v-if="showSummary && summaryData" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" @click.self="showSummary = false">
        <transition name="modal-inner" appear>
          <div v-if="showSummary" class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-emerald-700 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3 class="text-base font-bold text-stone-800">Ringkasan Harian</h3>
            </div>
            <button @click="showSummary = false" class="p-1.5 text-stone-400 hover:bg-stone-100 rounded-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Summary Text -->
          <p class="text-sm text-stone-700 leading-relaxed mb-4">{{ summaryData.summary }}</p>

          <!-- Highlights -->
          <ul v-if="summaryData.highlights?.length" class="space-y-2 mb-4">
            <li
              v-for="(h, i) in summaryData.highlights" :key="i"
              class="flex items-start gap-2.5 text-sm text-stone-600"
            >
              <div class="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#15803D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              {{ h }}
            </li>
          </ul>

          <!-- Recommendation -->
          <div v-if="summaryData.recommendation" class="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p class="text-xs font-semibold text-emerald-800">{{ summaryData.recommendation }}</p>
          </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Mobile Overlay -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/30 z-20 md:hidden"
        @click="sidebarOpen = false"
      />
    </transition>

    <!-- ===================== SIDEBAR ===================== -->
    <aside
      class="fixed md:relative inset-y-0 left-0 z-30 w-72 shrink-0 flex flex-col bg-white border-r border-stone-200 p-5 overflow-y-auto transition-transform duration-350 md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo + Close (mobile) -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1" ry="1"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <h1 class="text-sm font-bold text-stone-800 leading-tight">Wujudkan</h1>
            <p class="text-xs text-stone-400">Breakdown AI otomatis</p>
          </div>
        </div>
        <button @click="sidebarOpen = false" class="md:hidden p-1.5 text-stone-400 hover:bg-stone-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Nav Filters -->
      <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">Tampilan</p>
      <nav class="space-y-1 mb-6">
        <button
          v-for="item in filterItems" :key="item.value"
          @click="filter = item.value; sidebarOpen = false"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          :class="filter === item.value
            ? 'bg-emerald-50 text-emerald-800'
            : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'"
        >
          <div class="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.icon"/>
            {{ item.label }}
          </div>
          <span
            class="text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center"
            :class="filter === item.value ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-500'"
          >{{ item.count }}</span>
        </button>
      </nav>

      <!-- Progress Ring -->
      <div class="mt-auto mb-3 bg-stone-50 rounded-2xl p-5 border border-stone-100">
        <div class="flex justify-center mb-3">
          <svg viewBox="0 0 100 100" class="w-24 h-24 -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E7E5E4" stroke-width="9"/>
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke="#15803D" stroke-width="9"
              stroke-linecap="round"
              :stroke-dasharray="251.2"
              :stroke-dashoffset="251.2 * (1 - progressPercent / 100)"
              style="transition: stroke-dashoffset 0.6s ease"
            />
            <text x="50" y="46" text-anchor="middle" font-size="18" font-weight="700" fill="#1C1917" style="transform:rotate(90deg);transform-origin:50% 50%">{{ progressPercent }}%</text>
            <text x="50" y="61" text-anchor="middle" font-size="9" fill="#A8A29E" style="transform:rotate(90deg);transform-origin:50% 50%">selesai</text>
          </svg>
        </div>
        <p class="text-center text-sm font-semibold text-stone-700">Progress kamu</p>
        <p class="text-center text-xs text-stone-400 mt-0.5">{{ completedCount }} dari {{ tasks.length }} tujuan tercapai</p>
      </div>

      <!-- Daily Summary Button -->
      <div class="mb-3">
        <button
          @click="handleDailySummary"
          :disabled="isSummarizing || !tasks.length"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-500 hover:text-emerald-700 text-xs font-semibold rounded-2xl transition duration-150 disabled:opacity-40"
        >
          <svg v-if="!isSummarizing" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <svg v-else class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          {{ isSummarizing ? 'Membuat ringkasan...' : 'Ringkasan Harian AI' }}
        </button>
      </div>

      <!-- User Info -->
      <div class="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
            {{ userEmailPrefix }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-stone-700 truncate max-w-[140px]">{{ user?.email }}</p>
            <p class="text-xs text-stone-400">Masuk sebagai</p>
          </div>
        </div>
        <button @click="logout" title="Keluar" class="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-150 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>

    <!-- ===================== MAIN ===================== -->
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">

      <!-- Mobile Top Bar -->
      <div class="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200 shrink-0">
        <button @click="sidebarOpen = true" class="p-2 text-stone-500 hover:bg-stone-100 rounded-xl transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-emerald-700 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <span class="text-sm font-bold text-stone-800">Wujudkan</span>
        </div>
        <div class="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {{ userEmailPrefix }}
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

        <!-- Header (desktop only) -->
        <div class="hidden md:flex items-start justify-between mb-6 animate-fade-up">
          <div>
            <h2 class="text-2xl font-bold text-stone-800">{{ currentFilterLabel }}</h2>
            <p class="text-stone-400 text-sm mt-1">Tulis apa yang ingin kamu capai — AI akan menyusun langkahnya otomatis.</p>
          </div>
          <div class="text-xs text-stone-500 bg-white border border-stone-200 rounded-xl px-4 py-2 shrink-0">
            {{ tasks.length }} tujuan &nbsp;·&nbsp; {{ progressPercent }}% tercapai
          </div>
        </div>

        <!-- Mobile Header -->
        <div class="md:hidden mb-4">
          <h2 class="text-xl font-bold text-stone-800">{{ currentFilterLabel }}</h2>
          <p class="text-stone-400 text-xs mt-0.5">{{ tasks.length }} tujuan · {{ progressPercent }}% tercapai</p>
        </div>

        <!-- Mobile Filter Pills -->
        <div class="md:hidden flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            v-for="item in filterItems" :key="item.value"
            @click="filter = item.value"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0"
            :class="filter === item.value
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-stone-500 border border-stone-200'"
          >
            {{ item.label }}
            <span class="font-bold">{{ item.count }}</span>
          </button>
        </div>

        <!-- Input -->
        <TodoInput
          @success="(msg) => handleToast(msg, 'success')"
          @error="(msg) => handleToast(msg, 'error')"
        />

        <!-- Toast -->
        <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" @close="toastMsg = ''" class="mb-4" />

        <!-- Loading -->
        <div v-if="isLoadingData" class="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
          <svg class="animate-spin h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-xs font-semibold uppercase tracking-wider">Memuat tujuan...</span>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-14 h-14 bg-stone-200 rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <p class="text-base font-bold text-stone-700 mb-1">Belum ada tujuan</p>
          <p class="text-sm text-stone-400 mb-5">Coba tulis salah satu tujuan di bawah.</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              v-for="ex in examples" :key="ex"
              @click="fillExample(ex)"
              class="px-3 py-1.5 bg-white border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 text-xs sm:text-sm rounded-full transition duration-150"
            >{{ ex }}</button>
          </div>
        </div>

        <!-- Todo List -->
        <TransitionGroup v-else tag="ul" name="list" class="space-y-3 relative">
          <TodoItem
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            @toast="(t) => handleToast(t.message, t.type)"
          />
        </TransitionGroup>

        <!-- Clear Completed -->
        <div v-if="hasCompleted && !isLoadingData" class="mt-6 flex justify-end">
          <button @click="handleClear" class="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-xl border border-transparent hover:border-red-100 transition duration-150">
            Hapus semua yang tercapai
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const { user, userEmailPrefix, logout, sessionExpired } = useAuth()
const supabase = useSupabaseClient()
const { isSummarizing, requestDailySummary } = useAI()
const { tasks, filter, newTask, fetchTodos, isLoadingData, filteredTasks, hasCompleted, clearCompleted } = useTodos()

const sidebarOpen = ref(false)
const toastMsg = ref('')
const toastType = ref('')

const handleToast = (message, type = 'success') => {
  toastMsg.value = message
  toastType.value = type
  if (type !== 'loading') {
    setTimeout(() => { if (toastMsg.value === message) toastMsg.value = '' }, 4000)
  }
}

const handleClear = async () => {
  try {
    await clearCompleted()
    handleToast('Tujuan yang tercapai telah dihapus.', 'success')
  } catch {
    handleToast('Gagal menghapus tugas selesai.', 'error')
  }
}

const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
const progressPercent = computed(() => {
  if (!tasks.value.length) return 0
  return Math.round((completedCount.value / tasks.value.length) * 100)
})

const filterItems = computed(() => [
  {
    value: 'all', label: 'Semua', count: tasks.value.length,
    icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'
  },
  {
    value: 'active', label: 'Dikejar', count: tasks.value.filter(t => !t.completed).length,
    icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
  },
  {
    value: 'completed', label: 'Tercapai', count: tasks.value.filter(t => t.completed).length,
    icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
  }
])

const filterLabels = { all: 'Semua Tujuan', active: 'Sedang Dikejar', completed: 'Tercapai' }
const currentFilterLabel = computed(() => filterLabels[filter.value] || 'Semua Tugas')

// Daily Summary
const summaryData = ref(null)
const showSummary = ref(false)

const handleDailySummary = async () => {
  try {
    const taskList = tasks.value.map(t => ({
      text: t.text,
      completed: t.completed,
      dueDate: t.dueDate,
      priority: t.priority,
      subtasksTotal: (t.subtasks || []).length,
      subtasksDone: (t.subtasks || []).filter(s => s.completed).length
    }))
    summaryData.value = await requestDailySummary(taskList)
    showSummary.value = true
  } catch {
    handleToast('Gagal membuat ringkasan harian.', 'error')
  }
}

const examples = ['Bisa berbicara bahasa Inggris', 'Lulus ujian sertifikasi AWS', 'Bangun kebiasaan olahraga rutin', 'Selesaikan proyek portofolio']
const fillExample = (text) => { newTask.value = text }

// Cek session saat pertama buka — getSession() baca langsung dari storage
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    await fetchTodos()
  } else {
    navigateTo('/login')
  }
})

// Deteksi logout saat app sedang buka
watch(user, (u, prevU) => {
  if (prevU && !u) {
    if (sessionExpired.value) {
      handleToast('Sesi berakhir karena aktivitas di perangkat/tab lain. Data kamu aman — silakan masuk kembali.', 'error')
      setTimeout(() => navigateTo('/login'), 3000)
    } else {
      navigateTo('/login')
    }
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
