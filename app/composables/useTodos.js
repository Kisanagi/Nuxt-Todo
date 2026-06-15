import { ref, computed } from 'vue'
import { todoService } from '~/services/todoService'

const newTask = ref('')
const newTaskDueDate = ref('')
export const tasks = ref([])
const filter = ref('all')
const editingId = ref(null)
const editText = ref('')
const isLoadingData = ref(false)

export const useTodos = () => {
  const user = useSupabaseUser()

  const fetchTodos = async () => {
    if (!user.value) return
    isLoadingData.value = true
    try {
      const data = await todoService.getAll(user.value.id)
      tasks.value = data.map(todo => ({
        id: todo.id,
        text: todo.title,
        completed: todo.completed,
        dueDate: todo.due_date || null,
        priority: todo.priority || null,
        subtasks: todo.subtasks
          ? todo.subtasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          : []
      }))
    } catch (err) {
      console.error('Error fetching todos:', err)
    } finally {
      isLoadingData.value = false
    }
  }

  const addTask = async () => {
    const text = newTask.value.trim()
    if (!text || !user.value) return
    try {
      const userId = user.value.id || user.value.sub
      const data = await todoService.create(text, userId, newTaskDueDate.value || null)
      const newTodo = {
        id: data.id,
        text: data.title,
        completed: data.completed,
        dueDate: data.due_date || null,
        priority: null,
        subtasks: []
      }
      tasks.value.unshift(newTodo)
      newTask.value = ''
      newTaskDueDate.value = ''
      return newTodo
    } catch (err) {
      console.error('Error adding todo:', err)
      throw err
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    const nextCompleted = !task.completed
    try {
      await todoService.updateCompleted(id, nextCompleted)
      task.completed = nextCompleted
    } catch (err) {
      console.error('Error toggling todo:', err)
      throw err
    }
  }

  const deleteTask = async (id) => {
    try {
      await todoService.delete(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err) {
      console.error('Error deleting todo:', err)
      throw err
    }
  }

  const startEdit = (task) => {
    editingId.value = task.id
    editText.value = task.text
  }

  const saveEdit = async (id) => {
    const trimmed = editText.value.trim()
    if (!trimmed) {
      await deleteTask(id)
      editingId.value = null
      return
    }
    try {
      await todoService.updateTitle(id, trimmed)
      const task = tasks.value.find(t => t.id === id)
      if (task) task.text = trimmed
      editingId.value = null
      editText.value = ''
    } catch (err) {
      console.error('Error updating todo:', err)
      throw err
    }
  }

  const cancelEdit = () => {
    editingId.value = null
    editText.value = ''
  }

  const updateTaskTitle = async (id, title) => {
    try {
      await todoService.updateTitle(id, title)
      const task = tasks.value.find(t => t.id === id)
      if (task) task.text = title
    } catch (err) {
      console.error('Error updating task title:', err)
      throw err
    }
  }

  const updatePriority = async (id, priority) => {
    try {
      await todoService.updatePriority(id, priority)
      const task = tasks.value.find(t => t.id === id)
      if (task) task.priority = priority
    } catch (err) {
      console.error('Error updating priority:', err)
      throw err
    }
  }

  const updateDueDate = async (id, dueDate) => {
    try {
      await todoService.updateDueDate(id, dueDate || null)
      const task = tasks.value.find(t => t.id === id)
      if (task) task.dueDate = dueDate || null
    } catch (err) {
      console.error('Error updating due date:', err)
      throw err
    }
  }

  const clearCompleted = async () => {
    const completedIds = tasks.value.filter(t => t.completed).map(t => t.id)
    if (completedIds.length === 0) return
    try {
      await todoService.deleteMany(completedIds)
      tasks.value = tasks.value.filter(t => !t.completed)
    } catch (err) {
      console.error('Error clearing completed:', err)
      throw err
    }
  }

  const filteredTasks = computed(() => {
    if (filter.value === 'active') return tasks.value.filter(t => !t.completed)
    if (filter.value === 'completed') return tasks.value.filter(t => t.completed)
    return tasks.value
  })

  const hasCompleted = computed(() => tasks.value.some(t => t.completed))

  return {
    newTask,
    newTaskDueDate,
    tasks,
    filter,
    editingId,
    editText,
    isLoadingData,
    fetchTodos,
    addTask,
    toggleTask,
    deleteTask,
    startEdit,
    saveEdit,
    cancelEdit,
    updateTaskTitle,
    updatePriority,
    updateDueDate,
    filteredTasks,
    hasCompleted,
    clearCompleted
  }
}
