import http from './http'

// данные для регистрации
export interface RegisterData {
  username: string
  email: string
  password: string
}

// ответ backend'а после регистрации
export interface RegisteredUser {
  id: number
  username: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

// данные для входа
export interface LoginData {
  email: string
  password: string
}

export const authApi = {
  // регистрация
  async register(data: RegisterData): Promise<RegisteredUser> {
    const response = await http.post<RegisteredUser>('/v1/users/', data)

    return response.data
  },

  // вход
  async login(data: LoginData): Promise<void> {
    await http.post('/v1/auth/login', data)
  },
}
