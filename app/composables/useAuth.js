import { ref, computed } from 'vue'

const sessionExpired = ref(false)
const isAuthReady = ref(false)

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const isLoading = ref(false)
  const errorMsg = ref('')

  const userEmailPrefix = computed(() => {
    if (!user.value || !user.value.email) return 'U'
    return user.value.email.charAt(0).toUpperCase()
  })

  // Tunggu INITIAL_SESSION sebelum izinkan redirect
  if (import.meta.client) {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'INITIAL_SESSION') {
        isAuthReady.value = true
      }
      if (event === 'SIGNED_OUT' && isAuthReady.value && !isLoading.value) {
        sessionExpired.value = true
      }
    })
  }

  const login = async (email, password) => {
    isLoading.value = true
    errorMsg.value = ''
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      sessionExpired.value = false
      return data
    } catch (err) {
      errorMsg.value = err.message || 'Gagal masuk. Periksa kembali email dan password Anda.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (email, password) => {
    isLoading.value = true
    errorMsg.value = ''
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return data
    } catch (err) {
      errorMsg.value = err.message || 'Gagal mendaftar akun baru.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    errorMsg.value = ''
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigateTo('/login')
    } catch (err) {
      errorMsg.value = err.message || 'Gagal keluar.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const checkAuthAndRedirect = () => {
    if (!user.value) navigateTo('/login')
  }

  return {
    user, isLoading, errorMsg, userEmailPrefix,
    sessionExpired, isAuthReady, login, signup, logout, checkAuthAndRedirect
  }
}
