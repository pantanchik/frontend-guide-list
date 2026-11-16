import http from './http'
import type { Instruction } from '../types/instruction'

// описание возможных фильтров для получения инструкций
export interface InstructionFilters {
  category?: string
  search?: string
  skip?: number
  limit?: number
}

export const instructionsApi = {
  // получает список инструкций
  async getAll(filters: InstructionFilters = {}): Promise<Instruction[]> {
    const response = await http.get<Instruction[]>('/v1/instructions/', {
      params: filters,
    })

    return response.data
  },

  // получает одну инструкцию по её id
  async getById(id: number): Promise<Instruction> {
    const response = await http.get<Instruction>(`/v1/instructions/${id}`)

    return response.data
  },
}
