import { ref } from 'vue'

export const useAI = () => {
  const loadingTasks = ref({})
  const isImprovingTitle = ref(false)
  const isSummarizing = ref(false)

  // AI Breakdown: pecah tugas jadi subtask
  const requestBreakdown = async (todoId, taskTitle) => {
    loadingTasks.value[todoId] = true
    try {
      const response = await $fetch('/api/breakdown', {
        method: 'POST',
        body: { title: taskTitle }
      })
      if (response && Array.isArray(response.subtasks)) return response.subtasks
      throw new Error('Respons AI tidak valid')
    } catch (err) {
      console.error('AI Breakdown error:', err)
      throw err
    } finally {
      loadingTasks.value[todoId] = false
    }
  }

  // Smart Prioritas: analisis dan beri label prioritas
  const requestPriority = async (todoId, taskTitle) => {
    loadingTasks.value[`priority_${todoId}`] = true
    try {
      const response = await $fetch('/api/prioritize', {
        method: 'POST',
        body: { title: taskTitle }
      })
      return response
    } catch (err) {
      console.error('Prioritize error:', err)
      throw err
    } finally {
      loadingTasks.value[`priority_${todoId}`] = false
    }
  }

  // Perbaiki Judul: buat judul lebih spesifik & actionable
  const requestImproveTitle = async (title) => {
    isImprovingTitle.value = true
    try {
      const response = await $fetch('/api/improve-title', {
        method: 'POST',
        body: { title }
      })
      return response
    } catch (err) {
      console.error('Improve title error:', err)
      throw err
    } finally {
      isImprovingTitle.value = false
    }
  }

  // Daily Summary: ringkasan harian
  const requestDailySummary = async (tasks) => {
    isSummarizing.value = true
    try {
      const response = await $fetch('/api/summary', {
        method: 'POST',
        body: { tasks }
      })
      return response
    } catch (err) {
      console.error('Summary error:', err)
      throw err
    } finally {
      isSummarizing.value = false
    }
  }

  return {
    loadingTasks,
    isImprovingTitle,
    isSummarizing,
    requestBreakdown,
    requestPriority,
    requestImproveTitle,
    requestDailySummary
  }
}
