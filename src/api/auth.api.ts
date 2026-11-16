import http from './http'

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface RegisteredUser {
  id: number
  username: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

export const authApi = {
  async register(data: RegisterData): Promise<RegisteredUser> {
    const response = await http.post<RegisteredUser>('/v1/users/', data)

    return response.data
  },
}
