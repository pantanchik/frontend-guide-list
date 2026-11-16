// тип автора
export interface AuthorShort {
  id: number
  username: string
  role: string
}

// тип шага
export interface Step {
  id: number
  instruction_id: number
  step_number: number
  title: string
  content: string
  image_url: string | null
  created_at: string
  updated_at: string
}

// тип инструкции
export interface Instruction {
  id: number
  title: string
  description: string
  category: string
  tags: string | null
  parent_id: number | null
  views_count: number
  completions_count: number
  created_at: string
  updated_at?: string
  author: AuthorShort
  steps?: Step[]
}
