import http from './http'
import type { Instructions, Instruction, CreateInstructionRequest } from '../types/instruction'

// описание возможных фильтров для получения инструкций
export interface InstructionFilters {
  category?: string
  search?: string
  skip?: number
  limit?: number
}

export const instructionsApi = {
  // получает список инструкций
  async getAll(filters: InstructionFilters = {}): Promise<Instructions[]> {
    const response = await http.get<Instructions[]>('/v1/instructions/', {
      params: filters,
    })

    return response.data
  },

  // получает одну инструкцию по её id
  async getById(id: number): Promise<Instruction> {
    const response = await http.get<Instruction>(`/v1/instructions/${id}`)

    return response.data
  },

  // создаёт новую инструкцию
  async create(data: CreateInstructionRequest): Promise<Instruction> {
    const response = await http.post<Instruction>('/v1/instructions/', data)

    return response.data
  },

  // удаляет инструкцию по её id
  async delete(id: number): Promise<void> {
    await http.delete(`/v1/instructions/${id}`)
  },
}
