import http from './http'
import type { Instruction } from '../types/instruction'

export interface InstructionFilters {
  category?: string
  search?: string
  skip?: number
  limit?: number
}

export const instructionsApi = {
  async getAll(filters: InstructionFilters = {}): Promise<Instruction[]> {
    const response = await http.get<Instruction[]>('/v1/instructions/', {
      params: filters,
    })

    return response.data
  },

  async getById(id: number): Promise<Instruction> {
    const response = await http.get<Instruction>(`/v1/instructions/${id}`)

    return response.data
  },
}

