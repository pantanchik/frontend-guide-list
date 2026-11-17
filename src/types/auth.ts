// данные для регистрации
export interface RegisterData {
  username: string
  email: string
  password: string
}

// данные для входа
export interface LoginData {
  email: string
  password: string
}

// информация о пользователе
export interface User {
  id: number
  username: string
  email: string
  role: string
  created_at: string
  updated_at: string
}
