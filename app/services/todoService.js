import { useSupabaseClient } from '#imports'

export const todoService = {
  async getAll(userId) {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('todos')
      .select(`
        id, title, completed, due_date, priority, created_at,
        subtasks ( id, title, completed, duration_minutes, created_at )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(title, userId, dueDate = null) {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, user_id: userId, completed: false, due_date: dueDate, priority: null }])
      .select()
    if (error) throw error
    return data[0]
  },

  async updatePriority(id, priority) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('todos').update({ priority }).eq('id', id)
    if (error) throw error
  },

  async updateCompleted(id, completed) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('todos').update({ completed }).eq('id', id)
    if (error) throw error
  },

  async updateTitle(id, title) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('todos').update({ title }).eq('id', id)
    if (error) throw error
  },

  async updateDueDate(id, dueDate) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('todos').update({ due_date: dueDate }).eq('id', id)
    if (error) throw error
  },

  async delete(id) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (error) throw error
  },

  async deleteMany(ids) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('todos').delete().in('id', ids)
    if (error) throw error
  },

  async createSubtasks(todoId, subtasksList) {
    const supabase = useSupabaseClient()
    const rows = subtasksList.map(sub => ({
      todo_id: todoId,
      title: sub.title,
      duration_minutes: sub.duration_minutes || 10,
      completed: false
    }))
    const { data, error } = await supabase.from('subtasks').insert(rows).select()
    if (error) throw error
    return data
  },

  async deleteAllSubtasksForTodo(todoId) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('subtasks').delete().eq('todo_id', todoId)
    if (error) throw error
  },

  async updateSubtaskCompleted(subtaskId, completed) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('subtasks').update({ completed }).eq('id', subtaskId)
    if (error) throw error
  },

  async deleteSubtask(subtaskId) {
    const supabase = useSupabaseClient()
    const { error } = await supabase.from('subtasks').delete().eq('id', subtaskId)
    if (error) throw error
  }
}
