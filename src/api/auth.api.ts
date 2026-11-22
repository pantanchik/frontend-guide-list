import http from './http'
import type { RegisterData, LoginData, User } from '../types/auth'

export const authApi = {
  // регистрация
  async register(data: RegisterData): Promise<User> {
    const response = await http.post<User>('/v1/users/', data)
    return response.data
  },

  // вход
  async login(data: LoginData): Promise<void> {
    await http.post('/v1/auth/login', data)
  },

  // получение текущего пользователя
  async getMe(): Promise<User> {
    const response = await http.get<User>('/v1/auth/me')
    return response.data
  },

  // обновление access-токена
  async refresh(): Promise<void> {
    await http.post('/v1/auth/refresh')
  },

  // выход
  async logout(): Promise<void> {
    await http.get('/v1/auth/logout')
  },
}
