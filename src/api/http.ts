import axios, { type InternalAxiosRequestConfig } from 'axios'

// прокси к backend'у
const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// флаг для защиты от повторных запросов обновления
let isRefreshing = false

// запросы, которые ожидают обновления токена
let failedQueue: {
  resolve: () => void
  reject: (error: unknown) => void
}[] = []

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// обработка очереди ожидающих запросов
function processQueue(error?: unknown) {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error)
    } else {
      request.resolve()
    }
  })

  failedQueue = []
}

// перехватчик ответов сервера
http.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined

    // проверяем, что это ошибка 401
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes('/v1/auth/refresh') ||
      originalRequest.url?.includes('/v1/auth/login') ||
      originalRequest.url?.includes('/v1/auth/logout')
    ) {
      return Promise.reject(error)
    }

    // если обновление уже выполняется, ждём его завершения
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => http(originalRequest))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // обновляем токен
      await http.post('/v1/auth/refresh')

      // сообщаем ожидающим запросам, что обновление прошло успешно
      processQueue()

      // повторяем первоначальный запрос
      return http(originalRequest)
    } catch (refreshError) {
      // отклоняем ожидающие запросы
      processQueue(refreshError)

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default http
