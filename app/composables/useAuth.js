import { ref, computed } from 'vue'

const sessionExpired = ref(false)
// Track intentional logout so SIGNED_OUT doesn't get treated as token revocation
let intentionalSignOut = false

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const isLoading = ref(false)
  const errorMsg = ref('')

  const userEmailPrefix = computed(() => {
    if (!user.value || !user.value.email) return 'U'
    return user.value.email.charAt(0).toUpperCase()
  })

  if (import.meta.client) {
    supabase.auth.onAuthStateChange((event) => {
      // TOKEN_REFRESHED means session is alive and well — clear any expired flag
      if (event === 'TOKEN_REFRESHED') {
        sessionExpired.value = false
      }
      // SIGNED_OUT from token revocation (not from user clicking logout)
      if (event === 'SIGNED_OUT' && !intentionalSignOut) {
        sessionExpired.value = true
      }
      if (event === 'SIGNED_OUT') {
        intentionalSignOut = false
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
    intentionalSignOut = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigateTo('/login')
    } catch (err) {
      intentionalSignOut = false
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
    sessionExpired, login, signup, logout, checkAuthAndRedirect
  }
}
