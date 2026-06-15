export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          title: string
          completed: boolean
          due_date: string | null
          priority: 'high' | 'medium' | 'low' | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          completed?: boolean
          due_date?: string | null
          priority?: 'high' | 'medium' | 'low' | null
          user_id: string
          created_at?: string
        }
        Update: {
          title?: string
          completed?: boolean
          due_date?: string | null
          priority?: 'high' | 'medium' | 'low' | null
        }
      }
      subtasks: {
        Row: {
          id: string
          todo_id: string
          title: string
          completed: boolean
          duration_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          todo_id: string
          title: string
          completed?: boolean
          duration_minutes?: number
          created_at?: string
        }
        Update: {
          title?: string
          completed?: boolean
          duration_minutes?: number
        }
      }
    }
  }
}
