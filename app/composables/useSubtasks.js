import { tasks } from './useTodos'
import { todoService } from '~/services/todoService'

export const useSubtasks = () => {
  const saveSubtasks = async (todoId, subtasksList) => {
    try {
      const data = await todoService.createSubtasks(todoId, subtasksList)
      const task = tasks.value.find(t => t.id === todoId)
      if (task && data) {
        task.subtasks = [...(task.subtasks || []), ...data]
      }
    } catch (err) {
      console.error('Error inserting subtasks:', err)
      throw err
    }
  }

  // Hapus semua subtask lama lalu generate ulang
  const regenerateSubtasks = async (todoId, subtasksList) => {
    try {
      await todoService.deleteAllSubtasksForTodo(todoId)
      const task = tasks.value.find(t => t.id === todoId)
      if (task) task.subtasks = []
      const data = await todoService.createSubtasks(todoId, subtasksList)
      if (task && data) task.subtasks = data
    } catch (err) {
      console.error('Error regenerating subtasks:', err)
      throw err
    }
  }

  const toggleSubtask = async (subtaskId, todoId) => {
    const task = tasks.value.find(t => t.id === todoId)
    if (!task) return
    const sub = task.subtasks.find(s => s.id === subtaskId)
    if (!sub) return
    const nextCompleted = !sub.completed
    try {
      await todoService.updateSubtaskCompleted(subtaskId, nextCompleted)
      sub.completed = nextCompleted
    } catch (err) {
      console.error('Error toggling subtask:', err)
      throw err
    }
  }

  const deleteSubtask = async (subtaskId, todoId) => {
    try {
      await todoService.deleteSubtask(subtaskId)
      const task = tasks.value.find(t => t.id === todoId)
      if (task) task.subtasks = task.subtasks.filter(s => s.id !== subtaskId)
    } catch (err) {
      console.error('Error deleting subtask:', err)
      throw err
    }
  }

  return { saveSubtasks, regenerateSubtasks, toggleSubtask, deleteSubtask }
}
