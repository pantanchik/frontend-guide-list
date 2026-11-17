import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '../api/auth.api'
import type { User, LoginData } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  // текущий пользователь
  const user = ref<User | null>(null)

  // проверка авторизации
  const isAuthenticated = computed(() => user.value !== null)

  // проверка первоначальной загрузки
  const isInitialized = ref(false)

  // получение пользователя с backend
  async function fetchCurrentUser() {
    try {
      user.value = await authApi.getMe()
    } catch (error) {
      user.value = null
    } finally {
      isInitialized.value = true
    }
  }

  // вход в аккаунт
  async function login(data: LoginData) {
    await authApi.login(data)
    user.value = await authApi.getMe()
    isInitialized.value = true
  }

  // выход из аккаунта
  async function logout() {
    try {
      await authApi.logout()
    } finally {
      user.value = null
      isInitialized.value = true
    }
  }

  return {
    user,
    isAuthenticated,
    isInitialized,
    fetchCurrentUser,
    login,
    logout,
  }
})
