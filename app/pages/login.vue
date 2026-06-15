<template>
  <div class="flex h-screen bg-stone-100">

    <!-- Left Panel (Branding) -->
    <div class="hidden lg:flex w-[45%] bg-emerald-700 flex-col justify-between p-12">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <span class="text-white font-bold text-sm">Tugas Saya</span>
      </div>

      <!-- Center Text -->
      <div>
        <h1 class="text-4xl font-bold text-white leading-tight mb-3">
          Susun tugas,<br>capai tujuan.
        </h1>
        <p class="text-emerald-200 text-sm">Pecah tugas kompleks dengan AI secara otomatis.</p>
      </div>

      <!-- Bottom Quote -->
      <p class="text-emerald-300 text-xs">&copy; 2025 Tugas Saya. Semua hak dilindungi.</p>
    </div>

    <!-- Right Panel (Form) -->
    <div class="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
      <div class="w-full max-w-sm">

        <!-- Mobile Logo -->
        <div class="flex lg:hidden items-center gap-2.5 mb-8">
          <div class="w-8 h-8 bg-emerald-700 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <span class="font-bold text-stone-800">Tugas Saya</span>
        </div>

        <!-- Heading -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-stone-800">{{ isSignUp ? 'Buat akun' : 'Masuk' }}</h2>
        </div>

        <!-- Tab -->
        <div class="flex p-1 bg-stone-200 rounded-xl mb-6">
          <button
            @click="isSignUp = false"
            class="flex-1 py-2 text-sm font-semibold rounded-lg transition duration-150"
            :class="!isSignUp ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'"
          >Masuk</button>
          <button
            @click="isSignUp = true"
            class="flex-1 py-2 text-sm font-semibold rounded-lg transition duration-150"
            :class="isSignUp ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'"
          >Daftar Baru</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleAuth" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="nama@email.com"
              class="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-150 text-sm"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition duration-150 text-sm"
            />
          </div>

          <!-- Alert -->
          <transition name="fade">
            <div
              v-if="alertMsg"
              :class="alertClass"
              class="p-3.5 rounded-xl border text-xs flex items-start gap-2.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>{{ alertMsg }}</span>
            </div>
          </transition>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold rounded-xl transition duration-150 text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isSignUp ? 'Buat Akun' : 'Masuk' }}
          </button>
        </form>

        <!-- Switch mode -->
        <p class="text-center text-xs text-stone-400 mt-5">
          {{ isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?' }}
          <button @click="isSignUp = !isSignUp" class="text-emerald-700 font-semibold hover:underline ml-1">
            {{ isSignUp ? 'Masuk di sini' : 'Daftar gratis' }}
          </button>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { user, login, signup, errorMsg, isLoading } = useAuth()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const alertMsg = ref('')
const alertClass = ref('')


onMounted(() => {
  if (user.value) navigateTo('/')
})

const handleAuth = async () => {
  alertMsg.value = ''
  try {
    if (isSignUp.value) {
      await signup(email.value, password.value)
      alertClass.value = 'bg-emerald-50 text-emerald-700 border-emerald-200'
      alertMsg.value = 'Pendaftaran berhasil! Periksa email Anda untuk konfirmasi sebelum masuk.'
    } else {
      await login(email.value, password.value)
      alertClass.value = 'bg-emerald-50 text-emerald-700 border-emerald-200'
      alertMsg.value = 'Login sukses! Mengalihkan...'
      setTimeout(() => navigateTo('/'), 800)
    }
  } catch {
    alertClass.value = 'bg-red-50 text-red-600 border-red-200'
    alertMsg.value = errorMsg.value || 'Terjadi kesalahan. Periksa email dan password Anda.'
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
