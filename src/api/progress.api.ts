import http from './http'
import type { ProgressUpdate } from '../types/progress'

export const progressApi = {
  // отправляем обновлённый прогресс на backend
  async update(data: ProgressUpdate) {
    const response = await http.post('/v1/progress/', data)

    return response.data
  },
}
