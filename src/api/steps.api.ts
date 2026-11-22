import http from './http'
import type { Step, StepCreateRequest, StepUpdateRequest } from '../types/instruction'

export const stepsApi = {
  // добавляет шаг к инструкции
  async create(instructionId: number, data: StepCreateRequest): Promise<Step> {
    const response = await http.post<Step>(`/v1/steps/instruction/${instructionId}`, data)

    return response.data
  },

  // обновляет существующий шаг
  async update(stepId: number, data: StepUpdateRequest): Promise<Step> {
    const response = await http.patch<Step>(`/v1/steps/${stepId}`, data)

    return response.data
  },

  // удаляет шаг
  async delete(stepId: number): Promise<void> {
    await http.delete(`/v1/steps/${stepId}`)
  },
}
